from fastapi import APIRouter,Depends
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

@router.get("/sleep/today")
def get_today_sleep_log(
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    today = datetime.now().date()
    user_id = current_user.user_id

    sleep_log = db.query(SleepLog).filter_by(user_id=user_id, date=today).first()

    if not sleep_log:
        return {"logged":False}

    return {
        "logged":True,
        "date": sleep_log.date,
        "sleep_duration_hours": sleep_log.sleep_duration_hours,
        "duration_label": sleep_log.duration_label,
        "bedtime": sleep_log.bedtime,
        "wake_up": sleep_log.wake_up,
        "sleep_quality_score": sleep_log.sleep_quality_score,
        "sleep_quality_label": sleep_log.sleep_quality_label,
        "streak_count": sleep_log.streak_count
    }

@router.get("/sleep/weekly")
def get_weekly_sleep_summary(
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    user_id = current_user.user_id
    today = datetime.now().date()
    week_start = today - timedelta(days=today.weekday())

    weekly_summary = db.query(WeeklySleepSummary).filter_by(
        user_id=user_id,
        week_start_date=week_start
    ).first()

    if not weekly_summary:
        return {"message": "No sleep data for this week"}

    return {
        "week_start_date": weekly_summary.week_start_date,
        "mon_hours": weekly_summary.mon_hours,
        "tue_hours": weekly_summary.tue_hours,
        "wed_hours": weekly_summary.wed_hours,
        "thu_hours": weekly_summary.thu_hours,
        "fri_hours": weekly_summary.fri_hours,
        "sat_hours": weekly_summary.sat_hours,
        "sun_hours": weekly_summary.sun_hours
    }
 
@router.get("/api/v1/sleep/day/{query_date}")
def get_sleep_by_date(
    query_date: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.user_id

    
    try:
        parsed_date = datetime.strptime(query_date, "%Y-%m-%d").date()
    except ValueError:
        return {"logged": False, "error": "Invalid date format. Use YYYY-MM-DD"}

    sleep_log = db.query(SleepLog).filter_by(user_id=user_id, date=parsed_date).first()

    if not sleep_log:
        return {"logged": False}

    return {
        "logged": True,
        "date": sleep_log.date,
        "sleep_duration_hours": sleep_log.sleep_duration_hours,
        "duration_label": sleep_log.duration_label,
        "bedtime": sleep_log.bedtime.strftime("%H:%M") if sleep_log.bedtime else "--:--",
        "wake_up": sleep_log.wake_up.strftime("%H:%M") if sleep_log.wake_up else "--:--",
        "sleep_quality_score": sleep_log.sleep_quality_score or 0,
        "sleep_quality_label": sleep_log.sleep_quality_label or "No data",
        "streak_count": sleep_log.streak_count or 0
    }


def update_weekly_summary(db: Session, user_id: int, log_date: datetime.date, duration: float):
    """Ensure weekly summary is updated when a log is created or updated."""
    week_start = log_date - timedelta(days=log_date.weekday())

    weekly_summary = db.query(WeeklySleepSummary).filter_by(
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

    setattr(weekly_summary, weekday_map[log_date.weekday()], duration)
    db.commit()


@router.put("/sleep/log/{log_date}")
def update_sleep_log(
    log_date:str,
    sleep_data:SleepLogCreate,
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    user_id=current_user.user_id
    target_date = datetime.strptime(log_date, "%Y-%m-%d").date()
    log=db.query(SleepLog).filter_by(
        user_id=user_id,
        date=target_date
    ).first()

    if not log:
        return {"message":"No sleep log for this date"}
    
    log.sleep_duration_hours = sleep_data.sleep_duration_hours
    log.duration_label = sleep_data.duration_label
    log.bedtime = sleep_data.bedtime.time()
    log.wake_up = sleep_data.wake_up.time()
    log.sleep_quality_score = sleep_data.sleep_quality_score
    log.sleep_quality_label = sleep_data.sleep_quality_label
    log.streak_count = sleep_data.streak_count
    log.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(log)
    update_weekly_summary(db, user_id, target_date, sleep_data.sleep_duration_hours)
    return {"message": "Sleep log updated", "log_id": log.id}