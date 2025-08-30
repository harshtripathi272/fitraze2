from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from datetime import datetime
from typing import List
from .. import models
from ..database import get_db
from ..auth import get_current_user
import pytz
from pytz import timezone

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

class WaterLogResponse(BaseModel):
    id:int
    time:str
    amount:int
    type:str

class UpdateWaterLogRequest(BaseModel):
    amount_ml:int

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

@router.get("/api/v1/water/day/{date}",response_model=List[WaterLogResponse])
def get_water_logs_at_dates(date:str,db:Session=Depends(get_db),current_user:models.User=Depends(get_current_user)):

    ist=timezone("Asia/Kolkata")
    logs=db.query(models.WaterLog).filter(
        models.WaterLog.user_id==current_user.user_id,
        func.date(models.WaterLog.timestamp)==date
    ).all()
    return [
        {
            "id":log.id,
            "time":log.timestamp.replace(tzinfo=pytz.utc).astimezone(ist).strftime("%H:%M"),
            "amount":log.amount_ml,
            "type":"glass"
        } 
        for log in logs
    ]

@router.put("/api/v1/water/update/{log_id}")
def update_latest_water_log(
    log_id:int,
    data: UpdateWaterLogRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Fetch the latest water log for the current user
    log = (
        db.query(models.WaterLog)
        .filter(
            models.WaterLog.id==log_id,
            models.WaterLog.user_id == current_user.user_id
            ).first()
    )

    if not log:
        raise HTTPException(status_code=404, detail="No water log found")

    # Update amount
    log.amount_ml = data.amount_ml
    db.commit()
    db.refresh(log)

    return {"message": "Log updated", "log": log}
