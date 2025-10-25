import os
from typing import List,Optional
from google import generativeai
import google.generativeai as genai
import asyncio
import re
from typing import Dict,Any
import json


genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
SYSTEM_PROMPT="""
You are a helpful AI fitness and health assistant.
You can discuss fitness, sleep, and nutrition, and also reference user documents for context.

Keep your tone encouraging, supportive, and informative.
If data is missing, clearly say so instead of guessing.
"""

model=genai.GenerativeModel("gemini-2.0-flash")


async def infer_excercise_params(user_data:Dict[str,Any]=None,user_message:str=None):
    """
    Asking Gemini to infer appropriate parameters for the exercise API based on user goals, body part, and context.
    """
    context=f"""
    User message: "{user_message}"
    """

    prompt = f"""
    You are a fitness planning assistant. Based on the user's message,
    infer suitable parameters for the exercise API.

    Valid parameter keys:
    - name (specific exercise name, optional)
    - type (e.g. 'strength', 'cardio', 'stretching', 'plyometrics')
    - muscle (e.g. 'chest', 'back', 'legs', 'shoulders', 'biceps', 'core')
    - difficulty (beginner, intermediate, advanced)
    - offset (default 0)

    Return only a valid JSON object like:
    {{
        "name": null,
        "type": "strength",
        "muscle": "legs",
        "difficulty": "intermediate",
        "offset": 0
    }}
    Context:
    {context}
    """

    loop=asyncio.get_event_loop()
    response=await loop.run_in_executor(
        None,
        lambda:model.generate_content(prompt)
    )
    text=response.text.strip()
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            params = json.loads(match.group())
            return params
        except json.JSONDecodeError as e:
            print(f"[JSON ERROR] {e}, raw response: {text}")
            
        return {"muscle": "full body", "type": "strength", "difficulty": "beginner", "offset": 0}
    
##########################################################################################################
async def query_llm_intent(
        user_message:str)->str:
    loop = asyncio.get_event_loop()
    response = await loop.run_in_executor(
        None,
        lambda: model.generate_content(user_message)
    )
    return response.text.strip() if response and response.text else "I'm sorry, I couldn’t generate a response."

async def query_llm(
        user_message:str,
        chat_history:List[dict],
        tool_outputs:Optional[Dict[str,Any]],
        retrieved_docs:Optional[List[str]]=None,
        intent:Optional[str]="general"
        ) -> str:
    
    conversation_text = SYSTEM_PROMPT + "\n\n"
    for m in chat_history[-5:]:  # include last few turns
        conversation_text += f"{m['role'].capitalize()}: {m['content']}\n"
    conversation_text += f"User: {user_message}\n\n"

    # Add retrieved documents if available
    if retrieved_docs:
        docs_text = "\n\n".join(retrieved_docs[:3])  # limit size
        conversation_text += f"[Context from {intent} documents]\n{docs_text}\n\n"

    if tool_outputs:
        if hasattr(tool_outputs, "structured_content") and "result" in tool_outputs.structured_content:
            output = tool_outputs.structured_content["result"]
        elif hasattr(tool_outputs, "content"):
            output = tool_outputs.content
        else:
            output = []
        tool_name = getattr(tool_outputs, "tool_id", "tool_output")


        if isinstance(output, list):
            # List of dicts (like exercises)
            formatted_items = "\n".join([
                f"- {item.get('name', 'Unnamed')} ({item.get('type', 'N/A')} - {item.get('difficulty', 'N/A')})\n"
                f"  Muscle: {item.get('muscle', 'N/A')}\n"
                f"  Instructions: {item.get('instructions', 'No instructions')}"
                for item in output
            ])
            conversation_text += f"[{tool_name}]\n{formatted_items}\n\n"

        elif isinstance(output, dict):
            # Single dict output
            formatted_items = "\n".join([f"{k}: {v}" for k, v in output.items()])
            conversation_text += f"[{tool_name}]\n{formatted_items}\n\n"

        else:
            # Fallback
            conversation_text += f"[{tool_name}]\n{str(output)}\n\n"

        # Prompt LLM to integrate tool outputs
        conversation_text += (
            "Using the above data, write a clear, concise, and friendly response to the user.\n\n"
            "including advice or formatting as appropriate.\n\n"
        )


    # Run generation (Gemini is synchronous, so wrap in thread to make async)
    
    loop = asyncio.get_event_loop()
    response = await loop.run_in_executor(
        None,
        lambda: model.generate_content(conversation_text)
    )

    # Extract and return clean text
    return response.text.strip() if response and response.text else "I'm sorry, I couldn’t generate a response."