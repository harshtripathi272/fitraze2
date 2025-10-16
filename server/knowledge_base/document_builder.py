
from datetime import date
from typing import Dict, Any

def safe(val, default=""):
    return str(val) if val is not None else default

def build_daily_document(data: Dict[str, Any], target_date: date) -> Dict[str, str]:
    """
    Convert extracted structured data into a daily knowledge document.
    Returns a dict with 'text' and 'metadata' keys.
    """
    user = data.get("user")
    profile = data.get("profile")
    stats = data.get("stats")
    workouts = data.get("workouts") or []
    meals = data.get("meals") or []
    sleep = data.get("sleep")
    water_logs = data.get("water_logs") or []
    goal = data.get("goal")

    if not user:
        return {"text": "", "metadata": {"valid": False}}

    lines = []
    lines.append(f"User: {safe(user.name)} (id={user.user_id})")
    if profile:
        lines.append(f"Profile: gender={safe(profile.gender)}, age={safe(profile.age)}, activity_level={safe(profile.activity_level)}, experience={safe(profile.fitness_experience)}")
        if profile.dietary_restrictions:
            lines.append(f"Dietary restrictions: {safe(profile.dietary_restrictions)}")
        if profile.health_condition:
            lines.append(f"Health conditions: {safe(profile.health_condition)}")

    lines.append(f"Date: {target_date.isoformat()}")

    if goal:
        lines.append(f"Active goal: {safe(goal.goal_type)} — target: {safe(goal.target_weight_value)} kg by {safe(goal.target_date)}; status={safe(goal.status)}")

    if stats:
        lines.append(f"Daily stats: weight={safe(stats.weight_kg)} kg, BMI={safe(stats.bmi)}, body_fat%={safe(stats.body_fat_percent)}, muscle_mass={safe(stats.muscle_mass_kg)} kg")

    if workouts:
        total_cal = sum((w.calories_burned or 0) for w in workouts)
        lines.append(f"Workouts: {len(workouts)} session(s), total_calories_burned={total_cal}")
        for w in workouts:
            lines.append(f" - {safe(w.name)}: type={safe(w.workout_type)}, dur={safe(w.duration_minutes)}min, calories={safe(w.calories_burned)}, date={safe(w.date_performed)}")

    if meals:
        total_cal = sum((m.calories or 0) for m in meals)
        lines.append(f"Nutrition: {len(meals)} entries, total_calories={total_cal}")
        for m in meals[:8]:  # keep examples short
            lines.append(f" - {safe(m.food_name)}: {safe(m.quantity)} {safe(m.unit)}, cals={safe(m.calories)}, protein={safe(m.protein)}, carbs={safe(m.carbohydrates)}, fats={safe(m.fats)}")

    if sleep:
        lines.append(f"Sleep: duration_hours={safe(sleep.sleep_duration_hours)}, quality={safe(sleep.sleep_quality_label)}, bedtime={safe(sleep.bedtime)}, wake_up={safe(sleep.wake_up)}")

    if water_logs:
        total_ml = sum((w.amount_ml or 0) for w in water_logs)
        lines.append(f"Hydration: total={total_ml} ml")

    # small derived insights (simple heuristics)
    insights = []
    if stats and goal and hasattr(stats, "weight_kg") and hasattr(goal, "target_weight_value"):
        try:
            cur = float(stats.weight_kg or 0)
            target = float(goal.target_weight_value or cur)
            if cur > target:
                insights.append(f"On track to lose {cur - target:.2f} kg to reach target.")
        except Exception:
            pass

    if not insights:
        insights_text = ""
    else:
        insights_text = "Insights: " + " | ".join(insights)
        lines.append(insights_text)

    text = "\n".join(lines)
    metadata = {
        "type": "daily_summary",
        "user_id": str(user.user_id),
        "date": target_date.isoformat()
    }

    return {"text": text, "metadata": metadata}

