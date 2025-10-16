import os
from typing import List,Optional
from google import generativeai
import google.generativeai as genai
import asyncio
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPT="""
You are a helpful AI fitness and health assistant.
You can discuss fitness, sleep, and nutrition, and also reference user documents for context.

Keep your tone encouraging, supportive, and informative.
If data is missing, clearly say so instead of guessing.
"""

model=genai.GenerativeModel("gemini-2.0-flash")

async def query_llm(
        user_message:str,
        chat_history:List[dict],
        retrieved_docs:Optional[List[str]]=None,
        intent:Optional[str]="general") -> str:
    
    conversation_text = SYSTEM_PROMPT + "\n\n"
    for m in chat_history[-5:]:  # include last few turns
        conversation_text += f"{m['role'].capitalize()}: {m['content']}\n"
    conversation_text += f"User: {user_message}\n\n"

    # Add retrieved documents if available
    if retrieved_docs:
        docs_text = "\n\n".join(retrieved_docs[:3])  # limit size
        conversation_text += f"[Context from {intent} documents]\n{docs_text}\n\n"

    # Run generation (Gemini is synchronous, so wrap in thread to make async)
    
    loop = asyncio.get_event_loop()
    response = await loop.run_in_executor(
        None,
        lambda: model.generate_content(conversation_text)
    )

    # Extract and return clean text
    return response.text.strip() if response and response.text else "I'm sorry, I couldn’t generate a response."