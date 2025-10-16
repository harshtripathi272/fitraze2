from datetime import date
from typing import Dict,Any
from sqlalchemy.orm import Session
from sqlalchemy import func,cast,Date
from fastapi import Depends

from server.models import(
    User,UserProfile,UserStat,Workout,FoodEntry,SleepLog,WaterLog,FitnessGoal
)
from server.database import get_db
from server.auth import get_current_user

def get_user_daily_data(target_date:date,db:Session=Depends(get_db),current_user=Depends(get_current_user)) -> Dict[str,Any]:
    """ Query the database for a user's daily data. Returns a dict with user, profile, stats,
      workouts, meals, sleep, water_logs, goal. """
    user_id=current_user.user_id
    user=db.query(User).filter(User.user_id==user_id).first()
    if not user:
        return {"user":None}
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

    stats = (
        db.query(UserStat)
        .filter(UserStat.user_id == user_id, UserStat.date == target_date)
        .first()
    )

    workouts = (
        db.query(Workout)
        .filter(
            Workout.user_id == user_id,
            cast(Workout.date_performed, Date) == target_date
        )
        .all()
    )

    meals = (
        db.query(FoodEntry)
        .filter(
            cast(FoodEntry.timestamp, Date) == target_date,
            FoodEntry.user_id == user_id
        )
        .all()
    )

    sleep = (
        db.query(SleepLog)
        .filter(SleepLog.user_id == user_id, SleepLog.date == target_date)
        .first()
    )

    water_logs = (
        db.query(WaterLog)
        .filter(
            cast(WaterLog.timestamp, Date) == target_date,
            WaterLog.user_id == user_id
        )
        .all()
    )

    goal = (
        db.query(FitnessGoal)
        .filter(FitnessGoal.user_id == user_id, FitnessGoal.status == "active")
        .first()
    )

    return {
        "user": user,
        "profile": profile,
        "stats": stats,
        "workouts": workouts,
        "meals": meals,
        "sleep": sleep,
        "water_logs": water_logs,
        "goal": goal,
    }
