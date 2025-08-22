from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, date
from typing import List
from sqlalchemy.orm import  joinedload # Make sure joinedload is imported
from server.auth import get_current_user
# Adjust these imports based on your project structure
from server import models
from server.pydatnes import schemas
from server.database import get_db

router = APIRouter(
    prefix="/api/v1",
    tags=["Analytics"]
)
   # --- CORRECTED: Helper function to use 'age' directly instead of 'date_of_birth' ---
def _calculate_default_goals(user_profile: models.UserProfile, latest_stat: models.UserStat):
    """
    Calculates default calorie and macro goals if no active FitnessGoal is set.
    Uses Mifflin-St Jeor formula for BMR and a DYNAMIC activity multiplier from the user's profile.
    """
    # First guard clause: if user_profile itself is missing
    if not user_profile or not latest_stat:
        return (2000, 150, 200, 89)

    # Second guard: check fields individually
    if not (user_profile.age and user_profile.gender and latest_stat.weight_kg and latest_stat.height_cm):
        return (2000, 150, 200, 89)

    # --- 1. Use the age directly from the profile ---
    age = user_profile.age

    # --- 2. Calculate BMR using Mifflin-St Jeor ---
    weight_kg = float(latest_stat.weight_kg)
    height_cm = float(latest_stat.height_cm)

    if user_profile.gender.lower() == 'male':
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5
    elif user_profile.gender.lower() == 'female':
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161
    else:
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 78

    # --- 3. Dynamically determine the activity multiplier from the user's profile ---
    activity_multipliers = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725
    }
    activity_multiplier = activity_multipliers.get(user_profile.activity_level, 1.375)

    # --- 4. Calculate TDEE ---
    tdee = bmr * activity_multiplier

    # --- 5. Calculate Macros ---
    calories = round(tdee)
    protein = round((tdee * 0.30) / 4)
    carbs = round((tdee * 0.40) / 4)
    fat = round((tdee * 0.30) / 9)

    return calories, protein, carbs, fat



@router.get("/users/{user_id}/analytics", response_model=schemas.AnalyticsResponse)
def get_user_analytics(user_id: int, db: Session = Depends(get_db),current_user:models.User=Depends(get_current_user)):
    """
    Retrieve a consolidated report of weekly analytics data for a user,
    including calories, macros, and weight progress.
    Goals are now sourced from the active FitnessGoal or calculated dynamically.
    """
    
    if current_user.user_id!=user_id:
        raise HTTPException(status_code=403,detail="Not authorized to access this user's analytics")

    # --- CORRECTED: Efficiently load the user and their profile in one query ---
    user = db.query(models.User).options(
        joinedload(models.User.profile)
    ).filter(models.User.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # --- ADDED: The missing query to define latest_user_stat ---
    # Get the most recent user stat entry for weight/height calculation
    latest_user_stat = db.query(models.UserStat).filter(
        models.UserStat.user_id == user_id
    ).order_by(models.UserStat.date.desc()).first()

    # Get the user's active fitness goal
    user_goal = db.query(models.FitnessGoal).filter(
        models.FitnessGoal.user_id == user_id,
        models.FitnessGoal.status == 'active'
    ).order_by(models.FitnessGoal.created_at.desc()).first()

    # --- Step 2: Determine the authoritative goals for the week ---
    if user_goal and user_goal.target_calorie_value is not None:
        # Use goals from the user's active fitness_goals entry
        authoritative_calorie_goal = float(user_goal.target_calorie_value)
        authoritative_protein_goal = float(user_goal.target_protien_value)
        authoritative_carbs_goal = float(user_goal.target_carbs_value)
        authoritative_fat_goal = float(user_goal.target_fat_value)
    else:
        # If no active goal, calculate defaults based on user's stats
        # This line will now work correctly
        calories, protein, carbs, fat = _calculate_default_goals(user.profile, latest_user_stat)
        authoritative_calorie_goal = calories
        authoritative_protein_goal = protein
        authoritative_carbs_goal = carbs
        authoritative_fat_goal = fat
        
    # --- The rest of your code from here is correct and requires no changes ---
    today = datetime.utcnow().date()
    start_of_week = today - timedelta(days=today.weekday())
    
    nutrition_logs = db.query(models.DailyNutritionLog).filter(
        models.DailyNutritionLog.user_id == user_id,
        models.DailyNutritionLog.date >= start_of_week,
        models.DailyNutritionLog.date <= today
    ).order_by(models.DailyNutritionLog.date).all()

    logs_by_day = {log.date.strftime('%a'): log for log in nutrition_logs}

    weekly_calories_data: List[schemas.WeeklyCaldorieDataPoint] = []
    weekly_macros_data: List[schemas.WeeklyMacroDataPoint] = []

    for i in range(7):
        current_date = start_of_week + timedelta(days=i)
        day_str = current_date.strftime('%a')
        log = logs_by_day.get(day_str)
        
        if log and log.calorie_goal:
            weekly_calories_data.append(schemas.WeeklyCalorieDataPoint(
                day=day_str, calories=log.calories, goal=log.calorie_goal
            ))
            weekly_macros_data.append(schemas.WeeklyMacroDataPoint(
                day=day_str, protein=log.protein_grams, carbs=log.carbs_grams, fat=log.fat_grams
            ))
        else:
            calories_consumed = log.calories if log else 0
            protein_consumed = log.protein_grams if log else 0
            carbs_consumed = log.carbs_grams if log else 0
            fat_consumed = log.fat_grams if log else 0
            
            weekly_calories_data.append(schemas.WeeklyCalorieDataPoint(
                day=day_str, calories=calories_consumed, goal=authoritative_calorie_goal
            ))
            weekly_macros_data.append(schemas.WeeklyMacroDataPoint(
                day=day_str, protein=protein_consumed, carbs=carbs_consumed, fat=fat_consumed
            ))

    seven_weeks_ago = today - timedelta(weeks=4)
    
    weight_logs = db.query(
        func.date_trunc('week', models.UserStat.date).label('week_start'),
        func.avg(models.UserStat.weight_kg).label('avg_weight')
    ).filter(
        models.UserStat.user_id == user_id,
        models.UserStat.date >= seven_weeks_ago
    ).group_by('week_start').order_by('week_start').all()

    weight_progress_data: List[schemas.WeeklyWeightDataPoint] = []
    for i, log in enumerate(weight_logs):
        weight_progress_data.append(schemas.WeeklyWeightDataPoint(
            week=f"W{i+1}",
            weight=round(float(log.avg_weight), 2)
        ))

    return schemas.AnalyticsResponse(
        weekly_calories=weekly_calories_data,
        weekly_macros=weekly_macros_data,
        weight_progress=weight_progress_data
    )
