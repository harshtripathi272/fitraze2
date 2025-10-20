from sqlalchemy import Column, Integer, String, Date, JSON,DECIMAL, ForeignKey,DateTime,Boolean,Text, Float,Enum,Time,func
from sqlalchemy.orm import relationship
from server.database import Base
from datetime import datetime,timezone
from sqlalchemy import UniqueConstraint
# from pgvector.sqlalchemy import Vector
import enum


#User Management Models------------------------------------------------------------------------
class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at=Column(DateTime,default=datetime.utcnow)
    updated_at=Column(DateTime,default=datetime.utcnow,onupdate=datetime.utcnow)
    is_active=Column(Boolean,default=True)
    timezone=Column(String(50),default='UTC')
    # Profile information
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    stats = relationship("UserStat", back_populates="user")
    workouts = relationship("Workout", back_populates="user")
    goals = relationship("FitnessGoal", back_populates="user")
    chat_sessions = relationship("ChatSession", back_populates="user")
    sleep_logs = relationship("SleepLog", back_populates="user", cascade="all, delete-orphan")
    water_logs = relationship("WaterLog", back_populates="user")
    weekly_sleep_summaries = relationship("WeeklySleepSummary", back_populates="user", cascade="all, delete-orphan")
    bedtime_reminder = relationship("BedtimeReminder", back_populates="user", uselist=False, cascade="all, delete-orphan")
    embedding_cache_entries = relationship("UserEmbeddingsCache", back_populates="user", cascade="all, delete-orphan")



class UserStat(Base):
    __tablename__ = "user_stats"

    stat_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    date = Column(Date)
    weight_kg = Column(DECIMAL(5,2))
    height_cm = Column(DECIMAL(5,2))
    bmi = Column(DECIMAL(5,2))
    body_fat_percent = Column(DECIMAL(5,2))
    muscle_mass_kg = Column(DECIMAL(5,2))

    user = relationship("User", back_populates="stats")

class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    profile_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), unique=True)
    date_of_birth = Column(Date)
    age = Column(Integer, nullable = False)
    gender = Column(String(20))
    activity_level = Column(String(50))  # sedentary, lightly_active, moderately_active, very_active
    fitness_experience = Column(String(50))  # beginner, intermediate, advanced
    preferred_workout_types = Column(JSON)  # ["strength", "cardio", "yoga"]
    dietary_restrictions = Column(JSON)
    
    health_condition = Column(String(255), nullable=True)  # e.g., diabetes, hypertension
    equipment_access = Column(String(255), nullable=True)  # e.g., gym, home, no equipment
    motivation = Column(String(255), nullable=True)        # e.g., weight loss, muscle gain
    habits = Column(JSON, nullable=True)                   # e.g., ["smoking", "late-night eating"]
    challenges = Column(JSON, nullable=True)
    
    user = relationship("User", back_populates="profile")

#Fitness Tracking models------------------------------------------------
class FitnessGoal(Base):
    __tablename__ = "fitness_goals"
    
    goal_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    goal_type = Column(String(50))  # weight_loss, muscle_gain, endurance, strength
    target_weight_value = Column(DECIMAL(10,2))
    current_weight_value = Column(DECIMAL(10,2))
    target_date = Column(Date)
    target_protien_value = Column(DECIMAL(10,2))
    target_carbs_value = Column(DECIMAL(10,2))
    target_fat_value = Column(DECIMAL(10,2))
    target_calorie_value = Column(DECIMAL(10,2))
    status = Column(String(20), default='active')  # active, completed, paused
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="goals")

class Workout(Base):
    __tablename__ = "workouts"
    
    workout_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    name = Column(String(200))
    workout_type = Column(String(50))  # strength, cardio, flexibility, sports
    duration_minutes = Column(Integer)
    calories_burned = Column(Integer)
    difficulty_level = Column(Integer)  # 1-10 scale
    notes = Column(Text)
    date_performed = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="workouts")
    exercises = relationship("WorkoutExercise", back_populates="workout")

class Exercise(Base):
    __tablename__ = "exercises"
    
    exercise_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    category = Column(String(100))  # chest, back, legs, cardio, etc.
    muscle_groups = Column(JSON)  # ["chest", "triceps", "shoulders"]
    equipment_needed = Column(JSON)  # ["barbell", "bench"]
    instructions = Column(Text)
    difficulty_level = Column(Integer)
    
    workout_exercises = relationship("WorkoutExercise", back_populates="exercise")

class WorkoutExercise(Base):
    __tablename__ = "workout_exercises"
    
    workout_exercise_id = Column(Integer, primary_key=True, index=True)
    workout_id = Column(Integer, ForeignKey("workouts.workout_id"))
    exercise_id = Column(Integer, ForeignKey("exercises.exercise_id"))
    sets = Column(Integer)
    reps = Column(Integer)
    weight_kg = Column(DECIMAL(5,2))
    rest_seconds = Column(Integer)
    order_in_workout = Column(Integer)
    
    workout = relationship("Workout", back_populates="exercises")
    exercise = relationship("Exercise", back_populates="workout_exercises")


#Nutrition Tracking-----------------------------------------


class MealType(enum.Enum):
    breakfast = "breakfast"
    lunch = "lunch"
    dinner = "dinner"
    snack = "snack"

class FoodEntry(Base):
    __tablename__ = "food_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    food_name = Column(String, nullable=False)            # e.g., "Dal"
    quantity = Column(Float, nullable=False)              # e.g., 100
    unit = Column(String, default="grams")                # e.g., "grams"
    
    calories = Column(Float, nullable=False)              # e.g., 145
    protein = Column(Float, nullable=False)               # e.g., 8.6g
    carbohydrates = Column(Float, nullable=False)         # e.g., 19.2g
    fats = Column(Float, nullable=False)                  # e.g., 4.3g

    meal_type = Column(Enum(MealType), nullable=False)    # breakfast/lunch/dinner/snack

    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))  # When entry was added

    def __repr__(self):
        return f"<FoodEntry(name={self.food_name}, meal={self.meal_type}, calories={self.calories})>"
# class MealLog(Base):
#     _tablename_ = "meal_logs"
    
#     meal_log_id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.user_id"))
#     food_id = Column(Integer, ForeignKey("foods.food_id"))
#     meal_type = Column(String(50))  # breakfast, lunch, dinner, snack
#     quantity_grams = Column(DECIMAL(7,2))
#     logged_at = Column(DateTime, default=datetime.utcnow)
    
#     user = relationship("User")
#     food = relationship("Food")

#Sleep Log Models-------------------------------------------\
class SleepLog(Base):
    __tablename__ = "sleep_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)

    date = Column(Date, nullable=False)
    sleep_duration_hours = Column(Float, nullable=False)  # e.g., 8.5
    duration_label = Column(String(50))  # e.g., "Optimal"

    bedtime = Column(Time, nullable=False)
    wake_up = Column(Time, nullable=False)

    sleep_quality_score = Column(Integer)  # e.g., 1–10
    sleep_quality_label = Column(String(50))  # e.g., "Good"

    streak_count = Column(Integer, default=0)  # e.g., 5-day streak

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="sleep_logs")
# Hydration Tracking
class WaterLog(Base):
    __tablename__ = "water_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    amount_ml = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="water_logs")


    timestamp = Column(DateTime, default=datetime.utcnow)  # When entry was added

    def _repr_(self):
        return f"<FoodEntry(name={self.food_name}, meal={self.meal_type}, calories={self.calories})>"
    
# class MealLog(Base):

class WeeklySleepSummary(Base):
    __tablename__ = "weekly_sleep_summaries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)

    week_start_date = Column(Date, nullable=False)
    mon_hours = Column(Float)
    tue_hours = Column(Float)
    wed_hours = Column(Float)
    thu_hours = Column(Float)
    fri_hours = Column(Float)
    sat_hours = Column(Float)
    sun_hours = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="weekly_sleep_summaries")


class SleepTip(Base):
    __tablename__ = "sleep_tips"

    id = Column(Integer, primary_key=True, autoincrement=True)
    text = Column(String(500), nullable=False)
    min_temp_f = Column(Float)
    max_temp_f = Column(Float)
    min_temp_c = Column(Float)
    max_temp_c = Column(Float)


class BedtimeReminder(Base):
    __tablename__ = "bedtime_reminders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    enabled = Column(Boolean, default=False)
    reminder_time = Column(Time, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="bedtime_reminder")

#Chat Sessions Models-------------------------------------
class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.session_id"))
    role = Column(String(20))  # "user" or "assistant"
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    session_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    title = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

class UserEmbeddingsCache(Base):
    __tablename__="user_embeddings_cache"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    doc_hash = Column(String(128), nullable=False)
    doc_metadata = Column(JSON, nullable=True)
    last_indexed = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

    # ensure only one cache entry per user per day
    __table_args__ = (UniqueConstraint("user_id", "date", name="unique_user_date_cache"),)

    # optional relationship to users table
    user = relationship("User", back_populates="embedding_cache_entries")

    def __repr__(self):
        return f"<UserEmbeddingsCache user_id={self.user_id}, date={self.date}, hash={self.doc_hash[:8]}...>"



class DailyNutritionLog(Base):
    __tablename__ = "daily_nutrition_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    date = Column(Date, nullable=False)

    # Calorie Info
    calories = Column(Float, nullable=False)
    calorie_goal = Column(Float, nullable=True)

    # Macro Info
    protein_grams = Column(Float, nullable=False)
    carbs_grams = Column(Float, nullable=False)
    fat_grams = Column(Float, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")

    # Ensure a user can only have one nutrition log per day
    __table_args__ = (UniqueConstraint('user_id', 'date', name='_user_date_uc'),)

