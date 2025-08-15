from fastapi import APIRouter,Depends
from pydantic import BaseModel,EmailStr,AnyUrl
from typing import List,Tuple,Optional
from sqlalchemy.orm import Session
from datetime import datetime,timedelta
from server.database import get_db,Base,engine
from server.models import ChatSession

from qdrant_client import QdrantClient
import openai

# Initialize Qdrant
qdrant = QdrantClient("localhost", port=6333)
COLLECTION = "rag_data"

router=APIRouter()

class ChatRequest(BaseModel):
    user_id: int
    session_id: int
    message: str

class ChatResponse(BaseModel):
    reply: str
    sources: list = []

def embed_text(text: str):
    res = openai.Embedding.create(model="text-embedding-ada-002", input=text)
    return res["data"][0]["embedding"]

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest, db: Session = Depends(get_db)):
    # store user message in Qdrant
    user_vector = embed_text(req.message)
    qdrant.upsert(
        collection_name=COLLECTION,
        points=[{
            "id": f"chat_{req.session_id}_{hash(req.message)}",
            "vector": user_vector,
            "payload": {
                "type": "chat_message",
                "session_id": req.session_id,
                "user_id": req.user_id,
                "role": "user",
                "content": req.message
            }
        }]
    )

    #Retrieve relevant context from Qdrant (chat + KB + context)
    hits = qdrant.search(
        collection_name=COLLECTION,
        query_vector=user_vector,
        limit=5,
        query_filter={"must": [
            {"key": "type", "match": {"any": ["chat_message","knowledge_base","user_context"]}}
        ]}
    )

    context_text = "\n".join([h.payload["content"] for h in hits if "content" in h.payload])

    #Generate response using GPT
    prompt = f"""
    You are FitRaze AI, a personal fitness assistant.
    Use the following context when answering:

    {context_text}

    User: {req.message}
    """

    completion = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "system", "content": prompt}]
    )
    ai_reply = completion["choices"][0]["message"]["content"]

    # Store AI reply in Qdrant
    ai_vector = embed_text(ai_reply)
    qdrant.upsert(
        collection_name=COLLECTION,
        points=[{
            "id": f"chat_{req.session_id}_ai_{hash(ai_reply)}",
            "vector": ai_vector,
            "payload": {
                "type": "chat_message",
                "session_id": req.session_id,
                "user_id": req.user_id,
                "role": "assistant",
                "content": ai_reply
            }
        }]
    )

    return ChatResponse(reply=ai_reply, sources=[h.payload for h in hits])
