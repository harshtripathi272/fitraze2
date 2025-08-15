from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from datetime import datetime,timedelta
from pydantic import BaseModel,Field
from typing import Optional

from server.database import get_db
from server.models import SleepLog,WeeklySleepSummary,User
from server.auth import get_current_user

router=APIRouter()

class SleepLogCreate(BaseModel):
    date: datetime = Field(..., description="Date of the sleep log")
    sleep_duration_hours: float = Field(..., description="Total sleep in hours")
    duration_label: Optional[str] = Field(None, description="Label like Optimal, Poor, etc.")
    bedtime: datetime = Field(..., description="Bedtime timestamp")
    wake_up: datetime = Field(..., description="Wake up timestamp")
    sleep_quality_score: Optional[int] = Field(None, description="Numeric sleep quality score")
    sleep_quality_label: Optional[str] = Field(None, description="Good, Excellent, etc.")
    streak_count: Optional[int] = 0

@router.post("/sleep/log")
def log_sleep(
    sleep_data:SleepLogCreate,
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    user_id=current_user.user_id

    new_log=SleepLog(
        user_id=user_id,
        date=sleep_data.date.date(),
        sleep_duration_hours=sleep_data.sleep_duration_hours,
        duration_label=sleep_data.duration_label,
        bedtime=sleep_data.bedtime.time(),
        wake_up=sleep_data.wake_up.time(),
        sleep_quality_score=sleep_data.sleep_quality_score,
        sleep_quality_label=sleep_data.sleep_quality_label,
        streak_count=sleep_data.streak_count
    )
    db.add(new_log)

    week_start=sleep_data.date.date() -timedelta(days=sleep_data.date.weekday())

    weekly_summary=db.query(WeeklySleepSummary).filter_by(
        user_id=user_id,
        week_start_date=week_start
    ).first()
    if not weekly_summary:
        weekly_summary = WeeklySleepSummary(
            user_id=user_id,
            week_start_date=week_start
        )
        db.add(weekly_summary)
    
    weekday_map = {
        0: "mon_hours",
        1: "tue_hours",
        2: "wed_hours",
        3: "thu_hours",
        4: "fri_hours",
        5: "sat_hours",
        6: "sun_hours"
    }
    setattr(weekly_summary, weekday_map[sleep_data.date.weekday()], sleep_data.sleep_duration_hours)

    db.commit()

    return {"message":"Sleep log added successfully","log_id":new_log.id}