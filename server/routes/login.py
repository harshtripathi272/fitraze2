from fastapi import APIRouter,FastAPI,Depends,HTTPException,status
from pydantic import BaseModel,EmailStr,AnyUrl
from typing import List,Tuple,Optional
from sqlalchemy.orm import Session
from datetime import datetime,timedelta
from server.database import get_db,Base,engine
from server.models import User
from dotenv import load_dotenv
import jwt
from passlib.context import CryptContext
import os
from server.pydatnes import schemas


router=APIRouter()

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, os.getenv('SECRET_KEY'), algorithm=os.getenv('ALGORITHM'))

class SignupRequest(BaseModel):
    firstName: str
    lastName:str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int  # Add this line
    is_new_user: bool 


Base.metadata.create_all(bind=engine)

# ---------------- Signup -----------------
@router.post("/signup", response_model=TokenResponse)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    # check if user exists
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    full_name=f"{payload.firstName} {payload.lastName}".strip()

    # create user
    user = User(
        name=full_name,
        email=payload.email,
        password_hash=hash_password(payload.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # generate token
    access_token = create_access_token(data={"sub": str(user.user_id)})
    return {"access_token": access_token, "token_type": "bearer","is_new_user":True, "user_id": user.user_id}

# ---------------- Login -----------------
@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # generate token
    access_token = create_access_token(
        data={"sub": str(user.user_id)},
        expires_delta=timedelta(minutes=int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES')))
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "is_new_user": False, 
        "user_id": user.user_id  # Add this line
    }

# In main.py (or your relevant API file)

# ... (your existing imports and app setup)
# ...
from .. import models
from sqlalchemy.orm import Session
from server.database import get_db

# --- Add the Service Function from the document ---

def save_onboarding_data(db: Session, user_id: int, data: schemas.OnboardingData):
    """
    Saves or updates the user's questionnaire data to the database.
    This function performs an "upsert" operation.
    
    Args:
        db (Session): The database session.
        user_id (int): The ID of the user for whom to save the data.
        data (schemas.OnboardingData): The Pydantic schema containing validated questionnaire data.
    """
    # First, check if the user exists
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # 1. Upsert the UserProfile record
    profile_data = db.query(models.UserProfile).filter(models.UserProfile.user_id == user_id).first()
    if profile_data:
        # Update existing profile
        for key, value in data.profile.dict(exclude_unset=True).items():
            setattr(profile_data, key, value)
    else:
        # Create new profile
        profile_data = models.UserProfile(user_id=user_id, **data.profile.dict())
        db.add(profile_data)
    
    # 2. Upsert the FitnessGoal record
    goal_data = db.query(models.FitnessGoal).filter(models.FitnessGoal.user_id == user_id).first()
    goal_data_dict = data.goal.dict(exclude_unset=True)
    if 'target_protein_value' in goal_data_dict:
         goal_data_dict['target_protien_value'] = goal_data_dict.pop('target_protein_value')

    if goal_data:
        # Update existing goal
        for key, value in goal_data_dict.items():
            setattr(goal_data, key, value)
    else:
        # Create new goal
        goal_data = models.FitnessGoal(user_id=user_id, **goal_data_dict)
        db.add(goal_data)

    # 3. Upsert the initial UserStat record
    # For stats, we usually add a new record each time, but for onboarding, we can update the latest one.
    # A simpler approach for onboarding is to just create one if it doesn't exist.
    # For this example, we'll upsert like the others.
    stats_data = db.query(models.UserStat).filter(models.UserStat.user_id == user_id).order_by(models.UserStat.date.desc()).first()
    stat_payload = data.stats.dict(exclude_unset=True)
    
    # Calculate BMI if possible
    try:
        height_cm = stat_payload.get('height_cm', stats_data.height_cm if stats_data else 0)
        weight_kg = stat_payload.get('weight_kg', stats_data.weight_kg if stats_data else 0)
        if height_cm > 0 and weight_kg > 0:
            height_m = height_cm / 100
            bmi = round(weight_kg / (height_m ** 2), 2)
            stat_payload['bmi'] = bmi
    except (TypeError, ZeroDivisionError):
        pass # BMI will not be set if data is insufficient

    if stats_data:
        # Update existing stats
        for key, value in stat_payload.items():
            setattr(stats_data, key, value)
    else:
        # Create new stats
        stats_data = models.UserStat(user_id=user_id, date=datetime.utcnow().date(), **stat_payload)
        db.add(stats_data)

    # Commit all changes to the database at once
    try:
        db.commit()
        db.refresh(profile_data)
        db.refresh(goal_data)
        db.refresh(stats_data)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save data to database: {e}")

    return {
        "profile": profile_data,
        "goal": goal_data,
        "stats": stats_data
    }


# --- Add the new API Endpoint from the document ---
@router.post("/users/{user_id}/onboarding", response_model=schemas.OnboardingResponse)
def complete_onboarding(user_id: int, onboarding_data: schemas.OnboardingData, db: Session = Depends(get_db)):
    """
    Endpoint to receive and store user questionnaire data.
    """
    saved_data = save_onboarding_data(db=db, user_id=user_id, data=onboarding_data)
    return saved_data

# --- Include your existing authentication router ---
# Assuming your signup/login code is in a file named 'auth.py'
# from auth import router as auth_router 
# app.include_router(auth_router)