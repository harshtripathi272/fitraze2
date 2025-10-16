# routes/api.py
import uuid
from datetime import datetime,date
from typing import Optional, List, Dict
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import ChatMessage,ChatSession
from server.mcp_agents.agent_helpers import retrieve_user_docs,index_insert_document
from server.services.llm_helper import query_llm
from server.auth import get_current_user
from server.knowledge_base.document_builder import build_daily_document
from server.knowledge_base.extractor import get_user_daily_data

router = APIRouter(prefix="/api", tags=["Chat"])

# -----------------------------
# Pydantic models
# -----------------------------
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


@router.post("/build_embed")
def build_and_index_daily_document(
    db:Session=Depends(get_db),
    current_user=Depends(get_current_user),
):
    '''
    buills user's today daily document and pushes it to the vector store for retrieval in chats
    '''
    try:
        target_date=date.today()
        user_data=get_user_daily_data(target_date,db=db,current_user=current_user)
        if not user_data or not user_data.get("user"):
            raise HTTPException(status_code=404,detail="No daily data found for this user.")
        document=build_daily_document(user_data,target_date)
        doc_text=document.get("text","")
        metadata=document.get("metadata",{})
        if not doc_text.strip():
            raise HTTPException(status_code=400,detail="Empty daily data")
        success=index_insert_document(
            user_id=current_user.user_id,
            doc_text=doc_text,
            metadata=metadata
        )
        if not success:
            raise HTTPException(status_code=500,detail="Failed to insert document into index")
        
        return {
            "status":"success",
            "message":f"Indexed daily document for {target_date}",
            "metadata":metadata,
        }
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Error building daily document:{str(e)}")


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

    # 6️⃣ Generate LLM response
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
