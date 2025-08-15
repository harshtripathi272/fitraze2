from fastapi import APIRouter,Query, Depends
import httpx
import os
from dotenv  import load_dotenv
from server.models import FoodEntry
from server.database import get_db 
from pydantic import BaseModel
from enum import Enum
from sqlalchemy.orm import Session
from typing import Optional



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



@router.get("/api/v1/foods")
async def search_foods(query:str=Query(...,description="Food name to search")):
    url = f"https://api.nal.usda.gov/fdc/v1/foods/search"
    params = {"query": query, "pageSize": 10, "api_key": USDA_API_KEY}
    async with httpx.AsyncClient() as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        return r.json()
    

@router.post("/api/v1/food-entry")
def create_food_entry(entry: FoodEntryCreate, db: Session = Depends(get_db)):
    db_entry = FoodEntry(
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
    db.commit()
    db.refresh(db_entry)
    return {"message": "Food entry saved", "id": db_entry.id}