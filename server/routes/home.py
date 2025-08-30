from fastapi import APIRouter,Query, Depends
import httpx
import os
from dotenv  import load_dotenv
from server.models import FoodEntry,DailyNutritionLog
from server.database import get_db 
from pydantic import BaseModel
from enum import Enum
from sqlalchemy.orm import Session
from typing import Optional
from server.auth import get_current_user
from datetime import date,datetime,timedelta
from typing import List
import pytz



USDA_API_KEY=os.getenv("NEXT_PUBLIC_USDA_API_KEY")
router=APIRouter()
load_dotenv()

class MealType(str, Enum):
    breakfast = "breakfast"
    lunch = "lunch"
    dinner = "dinner"
    snack = "snack"

class FoodEntryCreate(BaseModel):

    name: str
    calories: float
    protein: float
    carbs: float
    fat: float
    serving: str
    meal_type: MealType
    quantity: float
    unit: str

class MacroGoal(BaseModel):
    current: float
    goal: float

class DailyNutritionResponse(BaseModel):
    calories: MacroGoal
    protein: MacroGoal
    carbs: MacroGoal
    fat: MacroGoal

class MealItem(BaseModel):
    name:str
    calories:str
    protein:float
    carbs:float
    fat:float
    quantity:float
    unit:str

class DailyMealsResponse(BaseModel):
    breakfast:List[MealItem]
    lunch:List[MealItem]
    dinner:List[MealItem]
    snacks:List[MealItem]

@router.get("/api/v1/foods")
async def search_foods(query:str=Query(...,description="Food name to search")):
    url = f"https://api.nal.usda.gov/fdc/v1/foods/search"
    params = {"query": query, "pageSize": 10, "api_key": USDA_API_KEY}
    async with httpx.AsyncClient() as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        return r.json()
    

@router.post("/api/v1/food-entry")
def create_food_entry(entry: FoodEntryCreate, db: Session = Depends(get_db),current_user=Depends(get_current_user)):

    user_id=current_user.user_id
    today=date.today()
    db_entry = FoodEntry(
        user_id=user_id,
        food_name=entry.name,
        quantity=entry.quantity,
        unit=entry.unit,
        calories=entry.calories,
        protein=entry.protein,
        carbohydrates=entry.carbs,
        fats=entry.fat,
        meal_type=entry.meal_type
    )
    db.add(db_entry)
    #Update/Create dailyNutritionLogs
    daily_log=db.query(DailyNutritionLog).filter(
        DailyNutritionLog.user_id==user_id,
        DailyNutritionLog.date==today
    ).first()

    if daily_log:
        #Update existing log
        daily_log.calories += entry.calories
        daily_log.protein_grams += entry.protein
        daily_log.carbs_grams += entry.carbs
        daily_log.fat_grams += entry.fat
    else:
        #create new daily log
        daily_log=DailyNutritionLog(
            user_id=user_id,
            date=today,
            calories=entry.calories,
            protein_grams=entry.protein,
            carbs_grams=entry.carbs,
            fat_grams=entry.fat,
            calorie_goal=None  # Can be set from user's goal logic if available
        
        )
        db.add(daily_log)

    db.commit()
    db.refresh(db_entry)
    return {"message": "Food entry saved", "id": db_entry.id}


@router.get("/api/v1/food/day/{date}",response_model=DailyMealsResponse)
def get_meals_for_day(
    date:str,
    db:Session=Depends(get_db),
    current_user=Depends(get_current_user)
):
    ist = pytz.timezone("Asia/Kolkata")

    start_date = ist.localize(datetime.fromisoformat(date))       # YYYY-MM-DD 00:00 IST
    end_date = start_date + timedelta(days=1)

    entries=db.query(FoodEntry).filter(
        FoodEntry.user_id==current_user.user_id,
        FoodEntry.timestamp>=start_date,
        FoodEntry.timestamp<end_date
    ).all()

    meals = {
        "breakfast": [],
        "lunch": [],
        "dinner": [],
        "snacks": []
    }

    for entry in entries:
        meal_dict={
            "name":entry.food_name,
            "calories":entry.calories,
            "protein":entry.protein,
            "carbs": entry.carbohydrates,
            "fat": entry.fats,
            "quantity": entry.quantity,
            "unit": entry.unit
        }
        if entry.meal_type == MealType.breakfast:
            meals["breakfast"].append(meal_dict)
        if entry.meal_type == MealType.lunch:
            meals["lunch"].append(meal_dict)
        if entry.meal_type == MealType.snack:
            meals["snacks"].append(meal_dict)
        if entry.meal_type == MealType.dinner:
            meals["dinner"].append(meal_dict)
    
    return meals
        
    

@router.get("/api/v1/daily-nutrition", response_model=DailyNutritionResponse)
def get_daily_nutrition(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    today = date.today()
    user_id = current_user.user_id

    daily_log = db.query(DailyNutritionLog).filter(
        DailyNutritionLog.user_id == user_id,
        DailyNutritionLog.date == today
    ).first()

    if not daily_log:
        # If no log found, return zero values but include goals
        return {
            "calories": {"current": 0, "goal": 2200},  # TODO: fetch real goal logic
            "protein": {"current": 0, "goal": 140},
            "carbs": {"current": 0, "goal": 220},
            "fat": {"current": 0, "goal": 85}
        }

    return {
        "calories": {"current": daily_log.calories, "goal": daily_log.calorie_goal or 2200},
        "protein": {"current": daily_log.protein_grams, "goal": 140},
        "carbs": {"current": daily_log.carbs_grams, "goal": 220},
        "fat": {"current": daily_log.fat_grams, "goal": 85}
    }