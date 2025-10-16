import httpx
import os
import time
from datetime import datetime, timedelta
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from dotenv import load_dotenv
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse, JSONResponse


load_dotenv()

oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.location.read https://www.googleapis.com/auth/fitness.body.read",
        "access_type": "offline",
        "prompt": "consent"
    }
)



# Load environment variables
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")  # e.g. http://localhost:8000/auth/callback
FRONTEND_URL = os.getenv("FRONTEND_URL")  # e.g. http://localhost:5173

SCOPES = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/fitness.activity.read",
    "https://www.googleapis.com/auth/fitness.location.read",
    "https://www.googleapis.com/auth/fitness.body.read"
]

router = APIRouter()

# ----- Helpers -----

def get_google_auth_url():
    return (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&response_type=code"
        f"&scope={' '.join(SCOPES)}"
        f"&access_type=offline"
        f"&prompt=consent"
    )

async def get_tokens(code: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": REDIRECT_URI,
                "grant_type": "authorization_code",
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        return response.json()

async def fetch_fitness_summary(access_token: str):
    end_time = int(time.time() * 1000)
    start_time = int(
    datetime.now()
    .replace(hour=0, minute=0, second=0, microsecond=0)
    .timestamp() * 1000)

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    body = {
        "aggregateBy": [
            {
                "dataTypeName": "com.google.step_count.delta",
                "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
            },
            {"dataTypeName": "com.google.calories.expended"},
            {"dataTypeName": "com.google.distance.delta"},
            {"dataTypeName": "com.google.active_minutes"},
            {"dataTypeName": "com.google.floor_climb.delta"}
        ],

        "bucketByTime": {"durationMillis": 86400000},
        "startTimeMillis": start_time,
        "endTimeMillis": end_time
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
            headers=headers,
            json=body
        )
        return response.json()

# ----- Routes -----

@router.get("/auth/google")
async def login_via_google(request: Request):
    print("Session available:", hasattr(request, "session"))
    redirect_uri = REDIRECT_URI  # same as in Google Cloud Console
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/api/v1/oauth2callback")
async def auth_callback(request: Request, code: str):
    token = await oauth.google.authorize_access_token(request)
    #user_info = await oauth.google.parse_id_token(request, token)
    # inside auth_callback
    access_token = token.get("access_token")
    #print("Token returned by Google:", token)


    if not access_token:
        return JSONResponse({"error": "Failed to retrieve access token"}, status_code=400)
    #print("User_info",user_info)
    # Optionally, you could store the access token in a database or in session
    # For simplicity, we redirect and send it as a query param (NOT SAFE for production)
    return RedirectResponse(f"{FRONTEND_URL}?access_token={access_token}")

@router.get("/fit/summary")
async def get_fitness_summary(access_token: str):
    raw_data = await fetch_fitness_summary(access_token)

    summary = {
        "steps": 0,
        "goal": 10000,
        "calories": 0,
        "distance": 0,
        "activeMinutes": 0,
        "floors": 0
    }

    for bucket in raw_data.get("bucket", []):
        for dataset in bucket.get("dataset", []):
            for point in dataset.get("point", []):
                data_type = point.get("dataTypeName")
                val = point.get("value", [])[0]

                if data_type == "com.google.step_count.delta":
                    summary["steps"] += val.get("intVal", 0)
                elif data_type == "com.google.calories.expended":
                    summary["calories"] += int(val.get("fpVal", 0))
                elif data_type == "com.google.distance.delta":
                    summary["distance"] += round(val.get("fpVal", 0) / 1000, 2)
                elif data_type == "com.google.active_minutes":
                    summary["activeMinutes"] += val.get("intVal", 0)
                elif data_type == "com.google.floor_climb.delta":
                    summary["floors"] += val.get("intVal", 0)

    return JSONResponse(content=summary)
