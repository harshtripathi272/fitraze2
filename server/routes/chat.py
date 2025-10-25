# routes/api.py
import uuid
from datetime import datetime,date
from typing import Optional, List, Dict
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
import hashlib
from sqlalchemy.dialects.postgresql import insert
from server.database import get_db
from server.models import ChatMessage,ChatSession,UserEmbeddingsCache
from server.mcp_agents.agent_helpers import retrieve_user_docs,index_insert_document
from server.services.llm_helper import query_llm,infer_excercise_params,query_llm_intent
from server.auth import get_current_user
from server.knowledge_base.document_builder import build_daily_document
from server.knowledge_base.extractor import get_user_daily_data
from server.mcp_agents.mcp_client import call_mcp_tool

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


async def classify_intent_llm(message: str) -> str:
    prompt = f"""
    Classify the following user message into one of these intents:
    daily_summary, nutrition_advice, training_suggestion, sleep_advice,
    motivation, fitness_tips, general.

    Message: "{message}"
    Return only the intent as a single word.
    """
    intent = await query_llm_intent(user_message=prompt)
    return intent.strip()

def classify_intent_rule_based(message:str)->Optional[str]:
    msg = message.lower()
    if "sleep" in msg: return "sleep_advice"
    if "workout" in msg or "training" in msg: return "training_suggestion"
    if "meal" in msg or "nutrition" in msg: return "nutrition_advice"
    if "tip" in msg or "recipe" in msg: return "fitness_tips"
    if "summary" in msg or "progress" in msg: return "daily_summary"
    return None


def get_existing_embedding_entry(db: Session, user_id: int, target_date: date):
    return (db.query(UserEmbeddingsCache).filter(
        UserEmbeddingsCache.user_id==user_id,
        UserEmbeddingsCache.date==target_date
    ).first())


def upsert_embedding_entry(db: Session, user_id: int, target_date: date, doc_hash: str, doc_metadata: Optional[Dict]):
    stmt=insert(UserEmbeddingsCache).values(
        user_id=user_id,
        date=target_date,
        doc_hash=doc_hash,
        doc_metadata=doc_metadata,
        last_indexed=datetime.utcnow(),
    )
    stmt=stmt.on_conflict_do_update(
        index_elements=['user_id','date'],
        set_={
            "doc_hash":doc_hash,
            "doc_metadata":doc_metadata,
            "last_indexed":datetime.utcnow(),
        },
    )
    result=db.execute(stmt)
    db.commit()
    entry=(db.query(UserEmbeddingsCache).filter_by(user_id=user_id,date=target_date).first())
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
async def chat_endpoint(req: ChatRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    try:
        # Load or create chat session
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
        print("added message to db")
        # Intent classification
        intent = classify_intent_rule_based(req.message) or await classify_intent_llm(req.message)
        print(f"[DEBUG] Classified intent: {intent}")

        workouts = None
        if intent == "training_suggestion":
            #user_data = get_user_daily_data(date.today(), db=db, current_user=current_user)
            inferred_params = await infer_excercise_params(user_message=req.message)
            print(f"inferred_params:{inferred_params}")
            workouts = await call_mcp_tool("get_excercises", **inferred_params)
            print(f"[DEBUG] MCP workouts: {workouts.structured_content}")

        # Document retrieval
        retrieved_docs = []
        if req.require_retrieval:
            retrieved = retrieve_user_docs(req.user_id, intent, top_k=2)
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
            intent=intent,
            tool_outputs=workouts
        )
        # print(f"[DEBUG] LLM response: {assistant_message}")

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

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error in chat endpoint: {str(e)}")

