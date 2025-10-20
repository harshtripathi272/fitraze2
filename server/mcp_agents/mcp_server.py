from llama_index.embeddings.huggingface import HuggingFaceEmbedding

embed = HuggingFaceEmbedding(model_name="sentence-transformers/paraphrase-MiniLM-L12-v2")
emb = embed.get_text_embedding("Hello world")
print(len(emb))
