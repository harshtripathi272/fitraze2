import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Scale,
  Ruler,
  Target,
  Heart,
  Clock,
  Utensils,
  Dumbbell,
  Moon,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// *** KEY CHANGE HERE ***
// Update the props to accept user and auth info
interface HealthQuestionnaireProps {
  onComplete: () => void; // A simple function to call on success
  userName: string;
  userId: number;
  token: string;
}

interface QuestionnaireData {
  // (No changes to this interface)
  age: number;
  gender: string;
  height: number;
  currentWeight: number;
  targetWeight: number;
  activityLevel: string;
  primaryGoal: string;
  workoutFrequency: number;
  workoutDuration: number;
  healthConditions: string[];
  allergies: string[];
  dietaryPreferences: string[];
  sleepHours: number;
  stressLevel: number;
  fitnessExperience: string;
  preferredWorkouts: string[];
  availableEquipment: string[];
  motivation: string;
  currentHabits: string[];
  challenges: string[];
}

const steps = [
  // (No changes to steps)
  { id: 1, title: "Personal Info", description: "Tell us about yourself" },
  { id: 2, title: "Goals & Activity", description: "What do you want to achieve?" },
  { id: 3, title: "Health & Lifestyle", description: "Your health background" },
  { id: 4, title: "Experience", description: "Your fitness journey so far" },
  { id: 5, title: "Motivation", description: "What drives you?" },
];

// *** A helper function to transform frontend data to the backend schema ***
// *** A helper function to transform frontend data to the backend schema ***
const transformDataForAPI = (formData: QuestionnaireData) => {
  // A helper to get a future date for the target_date
  const getFutureDate = (months: number) => {
      const date = new Date();
      date.setMonth(date.getMonth() + months);
      return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  return {
      profile: {
          // date_of_birth is not in the form, so we can omit it or calculate it
          age: formData.age,
          gender: formData.gender,
          activity_level: formData.activityLevel,
          fitness_experience: formData.fitnessExperience,
          preferred_workout_types: formData.preferredWorkouts,
          dietary_restrictions: formData.dietaryPreferences,
          health_condition: formData.healthConditions.join(', '),
          equipment_access: formData.availableEquipment.join(', '),
          motivation: formData.motivation,
          habits: formData.currentHabits,
          challenges: formData.challenges,
      },
      goal: {
          goal_type: formData.primaryGoal,
          target_weight_value: formData.targetWeight,
          current_weight_value: formData.currentWeight,
          target_date: getFutureDate(6), // Example: Set a 6-month target date
          // The backend schema has more nutrition fields, which are optional.
          // We can leave them out, and the backend will handle it.
      },
      stats: {
          weight_kg: formData.currentWeight,
          height_cm: formData.height,
          // body_fat_percent and muscle_mass_kg are optional.
      }
  };
};


export default function HealthQuestionnaire({
  onComplete,
  userName,
  userId,
  token,
}: HealthQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<QuestionnaireData>({
    age: 25,
    gender: "",
    height: 170,
    currentWeight: 70,
    targetWeight: 65,
    activityLevel: "",
    primaryGoal: "",
    workoutFrequency: 3,
    workoutDuration: 45,
    healthConditions: [],
    allergies: [],
    dietaryPreferences: [],
    sleepHours: 7,
    stressLevel: 3,
    fitnessExperience: "",
    preferredWorkouts: [],
    availableEquipment: [],
    motivation: "",
    currentHabits: [],
    challenges: [],
  });

  // (No changes to handleInputChange or handleArrayToggle)
  const handleInputChange = (field: keyof QuestionnaireData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleArrayToggle = (field: keyof QuestionnaireData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter((item) => item !== value)
        : [...(prev[field] as string[]), value],
    }));
  };

  // *** KEY CHANGE HERE ***
  // This function now handles the final API submission
  const handleCompleteSetup = async () => {
    setIsLoading(true);
    const apiData = transformDataForAPI(formData);

    try {
        const response = await fetch(`http://localhost:8000/users/${userId}/onboarding`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Send the authentication token
            },
            body: JSON.stringify(apiData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to submit questionnaire.");
        }

        // On success, call the onComplete prop to notify the parent
        onComplete();

    } catch (error: any) {
        alert(`An error occurred: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  };


  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // When the last step is completed, call the new handler
      handleCompleteSetup();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };


  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.gender &&
          formData.age > 0 &&
          formData.height > 0 &&
          formData.currentWeight > 0
        );
      case 2:
        return formData.activityLevel && formData.primaryGoal;
      case 3:
        return true; // Optional fields
      case 4:
        return formData.fitnessExperience;
      case 5:
        return formData.motivation;
      default:
        return true;
    }
  };

  const ProgressBar = () => (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-shimmer">Health Assessment</h2>
        <Badge variant="outline" className="glass">
          Step {currentStep} of {steps.length}
        </Badge>
      </div>

      <div className="relative">
        <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 progress-fill"
            style={
              {
                "--progress-width": `${(currentStep / steps.length) * 100}%`,
              } as React.CSSProperties
            }
          />
        </div>

        <div className="flex justify-between mt-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  currentStep > index
                    ? "bg-accent text-white"
                    : currentStep === index + 1
                      ? "bg-primary text-white animate-pulse"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {currentStep > index ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-bold">{step.id}</span>
                )}
              </div>
              <span className="text-xs mt-2 text-center max-w-20">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const QuestionCard = ({
    icon: Icon,
    title,
    children,
  }: {
    icon: any;
    title: string;
    children: React.ReactNode;
  }) => (
    <Card className="glass-enhanced border-glass-border glow-accent animate-scale-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl">
          <Icon className="w-6 h-6 mr-3 text-primary animate-glow" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  );

  const OptionGrid = ({
    options,
    selected,
    onSelect,
    multiple = false,
  }: {
    options: Array<{ value: string; label: string; icon?: string }>;
    selected: string | string[];
    onSelect: (value: string) => void;
    multiple?: boolean;
  }) => (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => {
        const isSelected = multiple
          ? (selected as string[]).includes(option.value)
          : selected === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cn(
              "p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105",
              isSelected
                ? "border-primary bg-primary/10 glow-accent"
                : "border-glass-border glass-card hover:border-primary/50",
            )}
          >
            <div className="flex items-center space-x-3">
              {option.icon && <span className="text-2xl">{option.icon}</span>}
              <span className="font-medium">{option.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <QuestionCard
            icon={User}
            title={`Hi ${userName}! Let's get to know you better`}
          >
            {/* Gender Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                What's your gender?
              </Label>
              <OptionGrid
                options={[
                  { value: "male", label: "Male", icon: "👨" },
                  { value: "female", label: "Female", icon: "👩" },
                  { value: "other", label: "Other", icon: "🧑" },
                  {
                    value: "prefer-not-to-say",
                    label: "Prefer not to say",
                    icon: "🤐",
                  },
                ]}
                selected={formData.gender}
                onSelect={(value) => handleInputChange("gender", value)}
              />
            </div>

            {/* Age */}
            <div className="space-y-3">
              <Label htmlFor="age" className="text-base font-medium">
                How old are you?
              </Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    handleInputChange("age", parseInt(e.target.value) || 0)
                  }
                  className="w-24 text-center glass-card border-glass-border"
                  min="13"
                  max="100"
                />
                <span className="text-muted-foreground">years old</span>
              </div>
            </div>

            {/* Height */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center">
                <Ruler className="w-4 h-4 mr-2" />
                What's your height?
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[formData.height]}
                  onValueChange={(value) =>
                    handleInputChange("height", value[0])
                  }
                  min={120}
                  max={220}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>120 cm</span>
                  <Badge variant="outline" className="glass">
                    {formData.height} cm ({Math.round(formData.height / 2.54)}{" "}
                    ft)
                  </Badge>
                  <span>220 cm</span>
                </div>
              </div>
            </div>

            {/* Weight */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center">
                  <Scale className="w-4 h-4 mr-2" />
                  Current Weight
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={formData.currentWeight}
                    onChange={(e) =>
                      handleInputChange(
                        "currentWeight",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="text-center glass-card border-glass-border"
                    min="30"
                    max="300"
                    step="0.1"
                  />
                  <span className="text-muted-foreground">kg</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Target Weight
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={formData.targetWeight}
                    onChange={(e) =>
                      handleInputChange(
                        "targetWeight",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="text-center glass-card border-glass-border"
                    min="30"
                    max="300"
                    step="0.1"
                  />
                  <span className="text-muted-foreground">kg</span>
                </div>
              </div>
            </div>
          </QuestionCard>
        );

      case 2:
        return (
          <QuestionCard icon={Target} title="What are your fitness goals?">
            {/* Activity Level */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                How active are you currently?
              </Label>
              <OptionGrid
                options={[
                  { value: "sedentary", label: "Sedentary", icon: "🛋️" },
                  {
                    value: "lightly-active",
                    label: "Lightly Active",
                    icon: "🚶",
                  },
                  {
                    value: "moderately-active",
                    label: "Moderately Active",
                    icon: "🏃",
                  },
                  { value: "very-active", label: "Very Active", icon: "🏋️" },
                ]}
                selected={formData.activityLevel}
                onSelect={(value) => handleInputChange("activityLevel", value)}
              />
            </div>

            {/* Primary Goal */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                What's your primary goal?
              </Label>
              <OptionGrid
                options={[
                  { value: "lose-weight", label: "Lose Weight", icon: "📉" },
                  { value: "gain-muscle", label: "Gain Muscle", icon: "💪" },
                  {
                    value: "maintain-health",
                    label: "Stay Healthy",
                    icon: "❤️",
                  },
                  {
                    value: "improve-endurance",
                    label: "Build Endurance",
                    icon: "🏃‍♂️",
                  },
                ]}
                selected={formData.primaryGoal}
                onSelect={(value) => handleInputChange("primaryGoal", value)}
              />
            </div>

            {/* Workout Frequency */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                How often do you want to work out?
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[formData.workoutFrequency]}
                  onValueChange={(value) =>
                    handleInputChange("workoutFrequency", value[0])
                  }
                  min={1}
                  max={7}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1 day/week</span>
                  <Badge variant="outline" className="glass">
                    {formData.workoutFrequency} days/week
                  </Badge>
                  <span>7 days/week</span>
                </div>
              </div>
            </div>

            {/* Workout Duration */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                How long per workout session?
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[formData.workoutDuration]}
                  onValueChange={(value) =>
                    handleInputChange("workoutDuration", value[0])
                  }
                  min={15}
                  max={120}
                  step={15}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>15 min</span>
                  <Badge variant="outline" className="glass">
                    {formData.workoutDuration} minutes
                  </Badge>
                  <span>2 hours</span>
                </div>
              </div>
            </div>
          </QuestionCard>
        );

      case 3:
        return (
          <QuestionCard icon={Heart} title="Tell us about your health">
            {/* Health Conditions */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Any health conditions? (Select all that apply)
              </Label>
              <OptionGrid
                options={[
                  { value: "none", label: "None", icon: "✅" },
                  { value: "diabetes", label: "Diabetes", icon: "🩺" },
                  {
                    value: "hypertension",
                    label: "High Blood Pressure",
                    icon: "❤️",
                  },
                  {
                    value: "heart-disease",
                    label: "Heart Disease",
                    icon: "💔",
                  },
                  { value: "arthritis", label: "Arthritis", icon: "🦴" },
                  { value: "asthma", label: "Asthma", icon: "🫁" },
                ]}
                selected={formData.healthConditions}
                onSelect={(value) =>
                  handleArrayToggle("healthConditions", value)
                }
                multiple
              />
            </div>

            {/* Dietary Preferences */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center">
                <Utensils className="w-4 h-4 mr-2" />
                Dietary preferences
              </Label>
              <OptionGrid
                options={[
                  { value: "none", label: "No restrictions", icon: "🍽️" },
                  { value: "vegetarian", label: "Vegetarian", icon: "🥗" },
                  { value: "vegan", label: "Vegan", icon: "🌱" },
                  { value: "keto", label: "Keto", icon: "🥑" },
                  { value: "paleo", label: "Paleo", icon: "🥩" },
                  { value: "gluten-free", label: "Gluten-free", icon: "🌾" },
                ]}
                selected={formData.dietaryPreferences}
                onSelect={(value) =>
                  handleArrayToggle("dietaryPreferences", value)
                }
                multiple
              />
            </div>

            {/* Sleep Hours */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center">
                <Moon className="w-4 h-4 mr-2" />
                How many hours do you sleep per night?
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[formData.sleepHours]}
                  onValueChange={(value) =>
                    handleInputChange("sleepHours", value[0])
                  }
                  min={4}
                  max={12}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>4 hours</span>
                  <Badge variant="outline" className="glass">
                    {formData.sleepHours} hours
                  </Badge>
                  <span>12 hours</span>
                </div>
              </div>
            </div>

            {/* Stress Level */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                What's your typical stress level?
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[formData.stressLevel]}
                  onValueChange={(value) =>
                    handleInputChange("stressLevel", value[0])
                  }
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>😌 Low</span>
                  <Badge variant="outline" className="glass">
                    Level {formData.stressLevel}
                  </Badge>
                  <span>😰 High</span>
                </div>
              </div>
            </div>
          </QuestionCard>
        );

      case 4:
        return (
          <QuestionCard icon={Dumbbell} title="Your fitness experience">
            {/* Fitness Experience */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                What's your fitness experience level?
              </Label>
              <OptionGrid
                options={[
                  { value: "beginner", label: "Beginner", icon: "🌱" },
                  { value: "intermediate", label: "Intermediate", icon: "🌿" },
                  { value: "advanced", label: "Advanced", icon: "🌳" },
                  { value: "expert", label: "Expert", icon: "🏆" },
                ]}
                selected={formData.fitnessExperience}
                onSelect={(value) =>
                  handleInputChange("fitnessExperience", value)
                }
              />
            </div>

            {/* Preferred Workouts */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                What types of workouts do you enjoy?
              </Label>
              <OptionGrid
                options={[
                  { value: "cardio", label: "Cardio", icon: "🏃" },
                  { value: "strength", label: "Strength Training", icon: "💪" },
                  { value: "yoga", label: "Yoga", icon: "🧘" },
                  { value: "pilates", label: "Pilates", icon: "🤸" },
                  { value: "dancing", label: "Dancing", icon: "💃" },
                  { value: "swimming", label: "Swimming", icon: "🏊" },
                ]}
                selected={formData.preferredWorkouts}
                onSelect={(value) =>
                  handleArrayToggle("preferredWorkouts", value)
                }
                multiple
              />
            </div>

            {/* Available Equipment */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                What equipment do you have access to?
              </Label>
              <OptionGrid
                options={[
                  { value: "none", label: "Body weight only", icon: "🤲" },
                  { value: "home-gym", label: "Home gym", icon: "🏠" },
                  {
                    value: "commercial-gym",
                    label: "Commercial gym",
                    icon: "🏋️",
                  },
                  {
                    value: "basic-equipment",
                    label: "Basic equipment",
                    icon: "🏃‍♂️",
                  },
                ]}
                selected={formData.availableEquipment}
                onSelect={(value) =>
                  handleArrayToggle("availableEquipment", value)
                }
                multiple
              />
            </div>
          </QuestionCard>
        );

      case 5:
        return (
          <QuestionCard icon={Sparkles} title="What motivates you?">
            {/* Motivation */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                What's your main motivation for getting fit?
              </Label>
              <OptionGrid
                options={[
                  { value: "health", label: "Better Health", icon: "❤️" },
                  { value: "appearance", label: "Look Better", icon: "✨" },
                  { value: "energy", label: "More Energy", icon: "⚡" },
                  {
                    value: "confidence",
                    label: "Boost Confidence",
                    icon: "💪",
                  },
                  { value: "sport", label: "Sports Performance", icon: "🏆" },
                  { value: "social", label: "Social Activity", icon: "👥" },
                ]}
                selected={formData.motivation}
                onSelect={(value) => handleInputChange("motivation", value)}
              />
            </div>

            {/* Current Habits */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                What healthy habits do you already have?
              </Label>
              <OptionGrid
                options={[
                  {
                    value: "drink-water",
                    label: "Drink enough water",
                    icon: "💧",
                  },
                  {
                    value: "regular-sleep",
                    label: "Regular sleep schedule",
                    icon: "😴",
                  },
                  {
                    value: "healthy-diet",
                    label: "Eat healthy meals",
                    icon: "🥗",
                  },
                  { value: "walk-daily", label: "Daily walks", icon: "🚶" },
                  { value: "meal-prep", label: "Meal preparation", icon: "🍱" },
                  {
                    value: "stress-management",
                    label: "Manage stress well",
                    icon: "🧘",
                  },
                ]}
                selected={formData.currentHabits}
                onSelect={(value) => handleArrayToggle("currentHabits", value)}
                multiple
              />
            </div>

            {/* Challenges */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                What are your biggest challenges?
              </Label>
              <OptionGrid
                options={[
                  { value: "time", label: "Not enough time", icon: "⏰" },
                  {
                    value: "motivation",
                    label: "Staying motivated",
                    icon: "😴",
                  },
                  {
                    value: "knowledge",
                    label: "Don't know what to do",
                    icon: "❓",
                  },
                  {
                    value: "consistency",
                    label: "Being consistent",
                    icon: "📅",
                  },
                  { value: "diet", label: "Eating healthy", icon: "🍔" },
                  { value: "energy", label: "Low energy", icon: "🔋" },
                ]}
                selected={formData.challenges}
                onSelect={(value) => handleArrayToggle("challenges", value)}
                multiple
              />
            </div>
          </QuestionCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/80 p-4">
      <div className="max-w-3xl mx-auto">
        <ProgressBar />

        <div className="mb-8">{renderStep()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="glass-card border-glass-border"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={nextStep}
            disabled={!isStepValid()}
            className="glow-accent hover:scale-105 transition-all duration-300 btn-glow-effect"
          >
            {currentStep === steps.length ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Setup
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
