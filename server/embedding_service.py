from llama_index.core import Document, StorageContext, VectorStoreIndex
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
import datetime
import openai

qdrant_client = QdrantClient("localhost", port=6333)

vector_store=QdrantVectorStore(
    client=qdrant_client,
    collection_name="rag_data",
    distance="cosine",
)

embed_model=OpenAIEmbedding(model="text-embedding-ada-002")
storage_context=StorageContext.from_defaults(vector_store=vector_store)

index=VectorStoreIndex([],storage_context=storage_context,embed_model=embed_model)


def store_chat_message(session_id, user_id, role, content):
    doc=Document(
        text=content,
        metadata={
            "type":"chat_message",
            "session_id":session_id,
            "user_id":user_id,
            "role":role,
        },
        doc_id=f"chat_{session_id}_{role}_{hash(content)}"
    )
    index.insert(doc)

def store_kb_doc(title, content, tags, source):
    doc=Document(
        text=content,
        metadata={
            "type":"knowledge_base",
            "title":title,
            "tags":tags,
            "source":source,
        },
        doc_id=f"kb_{hash(content)}",
    )
    index.insert(doc)


def store_user_context(user_id, context_type, content, expires_at=None):
    doc=Document(
        text=content,
        metadata={
            "type":"user_context",
            "user_id":user_id,
            "context_type":context_type,
            "expires_at":expires_at or datetime.datetime.utcnow().isoformat(),
        },
        doc_id=f"ctx_{user_id}_{context_type}",
    )
    index.insert(doc)
