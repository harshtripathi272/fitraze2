# schemas.py

from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import date, datetime
from decimal import Decimal

# --- Pydantic Schemas for Onboarding Data Validation ---

# This schema defines the data expected for the UserProfile
class UserProfileBase(BaseModel):
    date_of_birth: Optional[date] = None
    age: int
    gender: Optional[str] = None
    activity_level: Optional[str] = None
    fitness_experience: Optional[str] = None
    preferred_workout_types: Optional[List[Any]] = None # Using Any for JSON fields
    dietary_restrictions: Optional[List[Any]] = None
    health_condition: Optional[str] = None
    equipment_access: Optional[str] = None
    motivation: Optional[str] = None
    habits: Optional[List[Any]] = None
    challenges: Optional[List[Any]] = None

    class Config:
        from_attributes = True

# This schema defines the data expected for the FitnessGoal
class FitnessGoalBase(BaseModel):
    goal_type: Optional[str] = None
    target_weight_value: Optional[Decimal] = None
    current_weight_value: Optional[Decimal] = None
    target_date: Optional[date] = None
    # This correctly handles the 'target_protien_value' typo in your model
    target_protein_value: Optional[Decimal] = Field(None, alias='target_protien_value')
    target_carbs_value: Optional[Decimal] = None
    target_fat_value: Optional[Decimal] = None
    target_calorie_value: Optional[Decimal] = None
    status: str = 'active'

    class Config:
        from_attributes = True
        # This allows Pydantic to work with the alias for the typo
        validate_by_name = True

# This schema defines the data expected for the UserStat
class UserStatBase(BaseModel):
    weight_kg: Optional[Decimal] = None
    height_cm: Optional[Decimal] = None
    body_fat_percent: Optional[Decimal] = None
    muscle_mass_kg: Optional[Decimal] = None

    class Config:
        from_attributes = True

# This is the main schema that combines all parts for the API request.
# Your frontend will send a JSON object that matches this structure.
class OnboardingData(BaseModel):
    profile: UserProfileBase
    goal: FitnessGoalBase
    stats: UserStatBase


# --- Schemas for API Responses ---
# These define the shape of the data your API will send back.

class UserProfileResponse(UserProfileBase):
    profile_id: int
    user_id: int

class FitnessGoalResponse(FitnessGoalBase):
    goal_id: int
    user_id: int
    created_at: datetime
    
class UserStatResponse(UserStatBase):
    stat_id: int
    user_id: int
    # This was the line causing the error. I have fixed it.
    date: Optional[date]
    bmi: Optional[Decimal] = None
    
class OnboardingResponse(BaseModel):
    profile: UserProfileResponse
    goal: FitnessGoalResponse
    stats: UserStatResponse

# --- Schemas for User Authentication (already in your auth file but good to have here) ---

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    user_id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
# Add these new classes to your schemas.py file

# --- Schemas for Daily Nutrition Logging ---

class DailyNutritionLogBase(BaseModel):
    date: date
    calories: float
    calorie_goal: Optional[float] = None
    protein_grams: float
    carbs_grams: float
    fat_grams: float

class DailyNutritionLogCreate(DailyNutritionLogBase):
    pass

class DailyNutritionLogResponse(DailyNutritionLogBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Schemas for Analytics API Responses ---

class WeeklyCalorieDataPoint(BaseModel):
    day: str
    calories: float
    goal: Optional[float] = None

class WeeklyMacroDataPoint(BaseModel):
    day: str
    protein: float
    carbs: float
    fat: float

class WeeklyWeightDataPoint(BaseModel):
    week: str
    weight: float


class AnalyticsResponse(BaseModel):
    weekly_calories: List[WeeklyCalorieDataPoint]
    weekly_macros: List[WeeklyMacroDataPoint]
    weight_progress: List[WeeklyWeightDataPoint]

