from qdrant_client import QdrantClient
from qdrant_client.http.models import VectorParams, Distance
import openai

qdrant = QdrantClient("localhost", port=6333)

# Create collection once
qdrant.recreate_collection(
    collection_name="rag_data",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE)
)

def embed_text(text: str):
    res = openai.Embedding.create(model="text-embedding-ada-002", input=text)
    return res["data"][0]["embedding"]

def store_chat_message(session_id, user_id, role, content):
    qdrant.upsert(
        collection_name="rag_data",
        points=[{
            "id": f"chat_{session_id}_{role}_{hash(content)}",
            "vector": embed_text(content),
            "payload": {
                "type": "chat_message",
                "session_id": session_id,
                "user_id": user_id,
                "role": role,
                "content": content
            }
        }]
    )

def store_kb_doc(title, content, tags, source):
    qdrant.upsert(
        collection_name="rag_data",
        points=[{
            "id": f"kb_{hash(content)}",
            "vector": embed_text(content),
            "payload": {
                "type": "knowledge_base",
                "title": title,
                "content": content,
                "tags": tags,
                "source": source
            }
        }]
    )

def store_user_context(user_id, context_type, content, expires_at=None):
    qdrant.upsert(
        collection_name="rag_data",
        points=[{
            "id": f"ctx_{user_id}_{context_type}",
            "vector": embed_text(content),
            "payload": {
                "type": "user_context",
                "user_id": user_id,
                "context_type": context_type,
                "content": content,
                "expires_at": expires_at
            }
        }]
    )
