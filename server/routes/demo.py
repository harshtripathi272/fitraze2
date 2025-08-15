from fastapi import APIRouter
from pydantic import BaseModel
import os

router = APIRouter()

# Equivalent of DemoResponse
class DemoResponse(BaseModel):
    message: str

@router.get("/api/demo", response_model=DemoResponse)
async def handle_demo():
    return {"message": "Hello from FastAPI server"}

@router.get("/api/ping")
def ping():
    ping_message = os.getenv("PING_MESSAGE", "ping")
    return {"message": ping_message}
