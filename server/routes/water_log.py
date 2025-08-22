from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from datetime import datetime
from .. import models
from ..database import get_db
from ..auth import get_current_user

# It's better to define the router without the /api/v1 prefix.
# Add the prefix in your main.py when you include the router.
# e.g., app.include_router(water_log_router, prefix="/api/v1")
router = APIRouter(
    tags=["Water"], # Add a tag for better OpenAPI docs
)

# Pydantic models for data validation
class WaterLogCreate(BaseModel):
    amount_ml: int

class TodaysWaterResponse(BaseModel):
    total_ml: int

# --- API Endpoints ---

@router.post("/api/v1/water", status_code=201)
def log_water(
    water_data: WaterLogCreate,
    db: Session = Depends(get_db),
    # Corrected parameter name and type hint
    current_user: models.User = Depends(get_current_user)
):
    new_log = models.WaterLog(
        # This is now much clearer
        user_id=current_user.user_id,
        amount_ml=water_data.amount_ml
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

@router.get("/api/v1/water/today", response_model=TodaysWaterResponse)
def get_todays_water(
    db: Session = Depends(get_db),
    # Corrected parameter name and type hint
    current_user: models.User = Depends(get_current_user)
):
    today=datetime.utcnow().date()

    # Corrected the filter query
    total_intake = db.query(func.sum(models.WaterLog.amount_ml)).filter(
        models.WaterLog.user_id == current_user.user_id,
        func.date(models.WaterLog.timestamp) == today
    ).scalar()

    return {"total_ml": total_intake or 0}