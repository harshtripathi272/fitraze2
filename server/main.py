import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from server.database import get_db,engine,Base
from server.auth import get_current_user
from . import models
from server.routes.demo import router as demo_router
from server.routes.login import router as login_router
from server.routes.chat import router as chat_router
from server.routes.analytics import router as analytics_router
from server.routes.home import router as food_get
from server.routes.google_fit import router as google_fit
from server.routes.sleepLog import router as sleepLog
from server.routes.water_log import router as water_log
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware


load_dotenv()

app = FastAPI()

# ============================ CORS FIX ============================
# Define the specific origins (frontend addresses) that are allowed to connect.
origins = [
    "http://localhost:5173",  # The default address for Vite React apps
    "http://127.0.0.1:5173",
    # You can add the URL of your deployed frontend here later
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ================================================================

PORT = int(os.getenv("PORT", 5173))
current_path=os.path.dirname(__file__)
parent=os.path.dirname(current_path)
# Serve static files from React build
client_path = os.path.join(parent,"dist","client")

app.mount("/assets", StaticFiles(directory=os.path.join(client_path, "assets")), name="assets")
app.add_middleware(SessionMiddleware,secret_key=os.getenv("SESSION_SECRET_KEY"))

# API routes
app.include_router(demo_router)
app.include_router(login_router)
app.include_router(chat_router)
app.include_router(food_get)
app.include_router(google_fit)
app.include_router(sleepLog)
app.include_router(water_log)
app.include_router(analytics_router)

# Middleware to serve the Single Page Application (SPA)
@app.get("/{full_path:path}")
async def serve_spa(full_path: str, request: Request):
    # Don't override API or static asset requests
    if request.url.path.startswith("/api") or request.url.path.startswith("/assets"):
        return JSONResponse({"error": "Not Found"}, status_code=404)

    index_file = os.path.join(client_path, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return JSONResponse({"error": "index.html not found"}, status_code=404)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", port=PORT, reload=True)