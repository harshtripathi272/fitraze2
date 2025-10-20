# routes/api.py
import uuid
from datetime import datetime,date
from typing import Optional, List, Dict
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
import hashlib
from server.database import get_db
from server.models import ChatMessage,ChatSession,UserEmbeddingsCache
from server.mcp_agents.agent_helpers import retrieve_user_docs,index_insert_document
from server.services.llm_helper import query_llm
from server.auth import get_current_user
from server.knowledge_base.document_builder import build_daily_document
from server.knowledge_base.extractor import get_user_daily_data

router = APIRouter(prefix="/api", tags=["Chat"])


# Pydantic models

class StartSessionResponse(BaseModel):
    session_id: int
    title: str
    created_at: datetime

class ChatRequest(BaseModel):
    user_id: int
    message: str
    session_id: Optional[int] = None
    require_retrieval: Optional[bool] = False

class ChatResponse(BaseModel):
    session_id: int
    user_id: int
    assistant_message: str
    retrieved_docs: List[Dict]
    timestamp: datetime

class UserEmbeddingsCacheRead(BaseModel):
    id: int
    user_id: int
    date: date
    doc_hash: str
    doc_metadata: Optional[Dict] = None
    last_indexed: datetime

    class Config:
        orm_mode = True


#for now a simple intent classifier->only to fetch relevant data relating to query
def classify_intent(user_query: str) -> str:
    q = user_query.lower()
    if any(tok in q for tok in ["protein", "calorie", "meal", "macros", "carb", "fat"]):
        return "nutrition"
    if any(tok in q for tok in ["sleep", "nap", "rest", "bed", "wake"]):
        return "sleep"
    if any(tok in q for tok in ["workout", "exercise", "run", "training"]):
        return "fitness"
    return "general"

def get_existing_embedding_entry(db: Session, user_id: int, target_date: date):
    return (db.query(UserEmbeddingsCache).filter(
        UserEmbeddingsCache.user_id==user_id,
        UserEmbeddingsCache.date==target_date
    ).first())


def upsert_embedding_entry(db: Session, user_id: int, target_date: date, doc_hash: str, doc_metadata: Optional[Dict]):
    entry = get_existing_embedding_entry(db, user_id, target_date)
    if entry:
        entry.doc_hash = doc_hash
        entry.doc_metadata = doc_metadata
        entry.last_indexed = datetime.utcnow()
    else:
        entry = UserEmbeddingsCache(
            user_id=user_id,
            date=target_date,
            doc_hash=doc_hash,
            doc_metadata=doc_metadata,
            last_indexed=datetime.utcnow()
        )
        db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry



###### Routes

@router.post("/start_session", response_model=StartSessionResponse)
def start_session(user_id: int, db: Session = Depends(get_db)):
    new_session = ChatSession(user_id=user_id, title="New Chat Session")
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return StartSessionResponse(
        session_id=new_session.session_id,
        title=new_session.title,
        created_at=new_session.created_at
    )


@router.post("/build_embed", response_model=UserEmbeddingsCacheRead)
def build_and_index_daily_document(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    try:
        target_date = date.today()
        # Fetch user daily data
        user_data = get_user_daily_data(target_date, db=db, current_user=current_user)
        if not user_data or not user_data.get("user"):
            raise HTTPException(status_code=404, detail="No daily data found for this user.")

        # Build the document
        document = build_daily_document(user_data, target_date)
        doc_text = document.get("text", "")
        metadata = document.get("metadata", {})

        if not doc_text.strip():
            raise HTTPException(status_code=400, detail="Empty daily data")

        # Compute hash
        doc_hash = hashlib.sha256(doc_text.encode("utf-8")).hexdigest()

        # # Check cache
        existing_entry = get_existing_embedding_entry(db, current_user.user_id, target_date)
        if existing_entry and existing_entry.doc_hash == doc_hash:
            print("entry already exists")
            existing_entry.doc_metadata["type"]="cached"
            db.commit()
            db.refresh(existing_entry)
            return existing_entry
        
        # Insert into vector store
        success = index_insert_document(user_id=current_user.user_id, doc_text=doc_text, metadata=metadata)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to insert document into index")
        
        # Upsert cache entry
        entry = upsert_embedding_entry(db, current_user.user_id, target_date, doc_hash, metadata)
        print(f"Indexed new document for user {current_user.user_id} date {target_date}")

        return entry

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error building daily document: {str(e)}")


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest, db: Session = Depends(get_db)):
    #Loading and creating the chat session
    if req.session_id:
        session = db.query(ChatSession).filter(ChatSession.session_id == req.session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        session = ChatSession(user_id=req.user_id, title="New Chat")
        db.add(session)
        db.commit()
        db.refresh(session)
        req.session_id = session.session_id

    # Save user message
    user_msg = ChatMessage(session_id=req.session_id, role="user", content=req.message)
    db.add(user_msg)
    db.commit()

    # Intent classification
    intent = classify_intent(req.message)

    # retrieval
    retrieved_docs = []
    if req.require_retrieval:
        retrieved = retrieve_user_docs(req.user_id, intent , top_k=2)
        retrieved_docs = [
            {"text": getattr(d, "text", str(d)), "metadata": getattr(d, "metadata", {})}
            for d in retrieved
        ]

    # Retrieve last few messages for context
    history = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == req.session_id)
        .order_by(ChatMessage.timestamp.desc())
        .limit(10)
        .all()
    )
    chat_history = [{"role": m.role, "content": m.content} for m in reversed(history)]

    # Generate LLM response
    assistant_message = await query_llm(
        user_message=req.message,
        chat_history=chat_history,
        retrieved_docs=[doc["text"] for doc in retrieved_docs],
        intent=intent
    )

    # Save assistant message
    ai_msg = ChatMessage(session_id=req.session_id, role="assistant", content=assistant_message)
    db.add(ai_msg)
    db.commit()

    return ChatResponse(
        session_id=req.session_id,
        user_id=req.user_id,
        assistant_message=assistant_message,
        retrieved_docs=retrieved_docs,
        timestamp=datetime.utcnow()
    )
