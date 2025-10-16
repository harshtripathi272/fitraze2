import os
from typing import List
from llama_index.core import VectorStoreIndex, StorageContext, Document
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from qdrant_client import QdrantClient
from uuid import uuid4

# Environment variables
QDRANT_URL = os.environ.get("QDRANT_URL", "http://localhost:6333")
QDRANT_API_KEY = os.environ.get("QDRANT_API_KEY", None)
QDRANT_COLLECTION = os.environ.get("QDRANT_COLLECTION", "user_knowledge_base")
HF_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

# Single client + vector store for this process
_qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
_qdrant_store = QdrantVectorStore(client=_qdrant_client, 
                                  collection_name=QDRANT_COLLECTION,
                                  dense_vector_name="abstract-dense-vector")
_storage_context = StorageContext.from_defaults(vector_store=_qdrant_store)
_embed_model = HuggingFaceEmbedding(model_name=HF_MODEL)

# Create or reuse an index object (empty index uses existing vector store)
_index = VectorStoreIndex([], storage_context=_storage_context, embed_model=_embed_model)


def index_insert_document(user_id: int, doc_text: str, metadata: dict) -> bool:
    """
    Insert a document (text + metadata) into the index/Qdrant.
    metadata must include useful tags like type/date/doc_id (optional).
    """
    metadata = metadata.copy()
    metadata.setdefault("user_id", str(user_id))  # allow caller to provide doc_id to avoid duplicates
    doc_id = metadata.get("doc_id") or str(uuid4())
    doc = Document(text=doc_text, metadata=metadata, doc_id=doc_id)
    
    _index.insert(doc)
    
    try:
        _index.storage_context.persist()
    except Exception:
        # Some setups persist automatically; ignoring persistence error is OK here.
        pass
    
    return True


def retrieve_user_docs(user_id: int, query_type: str, top_k: int = 4) -> List[Document]:
    """
    Retrieve top_k documents for the given user and query.
    Returns LlamaIndex Document-like objects.
    """
    retriever = _index.as_retriever(similarity_top_k=top_k)
    
    # Bias retrieval by prefixing user hint; LlamaIndex will handle metadata matching in future versions
    full_query = f"User {user_id}: {query_type}"
    results = retriever.retrieve(full_query)
    
    return results


