import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Target,
  Dumbbell,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Exercise {
  id: string;
  name: string;
  muscle: string;
  subMuscle: string;
  sets: number;
  reps: string;
  weight: number;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  equipment: string[];
}

interface BodyPart {
  id: string;
  name: string;
  emoji: string;
  color: string;
  subMuscles: {
    id: string;
    name: string;
    exercises: Exercise[];
  }[];
}

interface CustomWorkoutBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkoutCreated: (workout: { name: string; exercises: Exercise[] }) => void;
}

const bodyParts: BodyPart[] = [
  {
    id: "chest",
    name: "Chest",
    emoji: "💪",
    color: "border-red-500/30 bg-red-500/5",
    subMuscles: [
      {
        id: "upper-chest",
        name: "Upper Chest",
        exercises: [
          {
            id: "inc-bench",
            name: "Incline Barbell Press",
            muscle: "chest",
            subMuscle: "upper-chest",
            sets: 4,
            reps: "8-10",
            weight: 60,
            description: "Targets upper pectorals with incline angle",
            difficulty: "Intermediate",
            equipment: ["Barbell", "Incline Bench"],
          },
          {
            id: "inc-db",
            name: "Incline Dumbbell Press",
            muscle: "chest",
            subMuscle: "upper-chest",
            sets: 3,
            reps: "10-12",
            weight: 30,
            description: "Upper chest isolation with dumbbells",
            difficulty: "Beginner",
            equipment: ["Dumbbells", "Incline Bench"],
          },
          {
            id: "inc-fly",
            name: "Incline Dumbbell Flyes",
            muscle: "chest",
            subMuscle: "upper-chest",
            sets: 3,
            reps: "12-15",
            weight: 20,
            description: "Upper chest stretch and contraction",
            difficulty: "Intermediate",
            equipment: ["Dumbbells", "Incline Bench"],
          },
        ],
      },
      {
        id: "middle-chest",
        name: "Middle Chest",
        exercises: [
          {
            id: "flat-bench",
            name: "Flat Barbell Press",
            muscle: "chest",
            subMuscle: "middle-chest",
            sets: 4,
            reps: "8-10",
            weight: 80,
            description: "Classic compound chest movement",
            difficulty: "Intermediate",
            equipment: ["Barbell", "Flat Bench"],
          },
          {
            id: "flat-db",
            name: "Flat Dumbbell Press",
            muscle: "chest",
            subMuscle: "middle-chest",
            sets: 4,
            reps: "10-12",
            weight: 35,
            description: "Middle chest with dumbbells for range of motion",
            difficulty: "Beginner",
            equipment: ["Dumbbells", "Flat Bench"],
          },
          {
            id: "push-ups",
            name: "Push-ups",
            muscle: "chest",
            subMuscle: "middle-chest",
            sets: 3,
            reps: "15-20",
            weight: 0,
            description: "Bodyweight chest exercise",
            difficulty: "Beginner",
            equipment: ["Bodyweight"],
          },
        ],
      },
      {
        id: "lower-chest",
        name: "Lower Chest",
        exercises: [
          {
            id: "decline-bench",
            name: "Decline Barbell Press",
            muscle: "chest",
            subMuscle: "lower-chest",
            sets: 4,
            reps: "8-10",
            weight: 70,
            description: "Targets lower pectorals",
            difficulty: "Intermediate",
            equipment: ["Barbell", "Decline Bench"],
          },
          {
            id: "dips",
            name: "Chest Dips",
            muscle: "chest",
            subMuscle: "lower-chest",
            sets: 3,
            reps: "10-15",
            weight: 0,
            description: "Bodyweight lower chest exercise",
            difficulty: "Intermediate",
            equipment: ["Dip Bars"],
          },
        ],
      },
    ],
  },
  {
    id: "back",
    name: "Back",
    emoji: "🦅",
    color: "border-blue-500/30 bg-blue-500/5",
    subMuscles: [
      {
        id: "lats",
        name: "Latissimus Dorsi",
        exercises: [
          {
            id: "pull-ups",
            name: "Pull-ups",
            muscle: "back",
            subMuscle: "lats",
            sets: 4,
            reps: "6-10",
            weight: 0,
            description: "Wide grip targeting lats",
            difficulty: "Intermediate",
            equipment: ["Pull-up Bar"],
          },
          {
            id: "lat-pulldown",
            name: "Lat Pulldown",
            muscle: "back",
            subMuscle: "lats",
            sets: 4,
            reps: "10-12",
            weight: 60,
            description: "Lat isolation with cable machine",
            difficulty: "Beginner",
            equipment: ["Cable Machine"],
          },
        ],
      },
      {
        id: "rhomboids",
        name: "Rhomboids & Mid Traps",
        exercises: [
          {
            id: "rows",
            name: "Barbell Rows",
            muscle: "back",
            subMuscle: "rhomboids",
            sets: 4,
            reps: "8-10",
            weight: 70,
            description: "Middle back thickness",
            difficulty: "Intermediate",
            equipment: ["Barbell"],
          },
          {
            id: "cable-rows",
            name: "Seated Cable Rows",
            muscle: "back",
            subMuscle: "rhomboids",
            sets: 3,
            reps: "10-12",
            weight: 50,
            description: "Controlled middle back movement",
            difficulty: "Beginner",
            equipment: ["Cable Machine"],
          },
        ],
      },
    ],
  },
  {
    id: "shoulders",
    name: "Shoulders",
    emoji: "🌟",
    color: "border-yellow-500/30 bg-yellow-500/5",
    subMuscles: [
      {
        id: "anterior",
        name: "Front Delts",
        exercises: [
          {
            id: "overhead-press",
            name: "Overhead Press",
            muscle: "shoulders",
            subMuscle: "anterior",
            sets: 4,
            reps: "8-10",
            weight: 50,
            description: "Compound shoulder movement",
            difficulty: "Intermediate",
            equipment: ["Barbell"],
          },
          {
            id: "front-raises",
            name: "Front Raises",
            muscle: "shoulders",
            subMuscle: "anterior",
            sets: 3,
            reps: "12-15",
            weight: 15,
            description: "Front delt isolation",
            difficulty: "Beginner",
            equipment: ["Dumbbells"],
          },
        ],
      },
      {
        id: "medial",
        name: "Side Delts",
        exercises: [
          {
            id: "lateral-raises",
            name: "Lateral Raises",
            muscle: "shoulders",
            subMuscle: "medial",
            sets: 4,
            reps: "12-15",
            weight: 12,
            description: "Side delt isolation for width",
            difficulty: "Beginner",
            equipment: ["Dumbbells"],
          },
          {
            id: "upright-rows",
            name: "Upright Rows",
            muscle: "shoulders",
            subMuscle: "medial",
            sets: 3,
            reps: "10-12",
            weight: 40,
            description: "Compound side delt movement",
            difficulty: "Intermediate",
            equipment: ["Barbell"],
          },
        ],
      },
      {
        id: "posterior",
        name: "Rear Delts",
        exercises: [
          {
            id: "rear-flyes",
            name: "Rear Delt Flyes",
            muscle: "shoulders",
            subMuscle: "posterior",
            sets: 3,
            reps: "12-15",
            weight: 10,
            description: "Rear delt isolation",
            difficulty: "Beginner",
            equipment: ["Dumbbells"],
          },
          {
            id: "face-pulls",
            name: "Face Pulls",
            muscle: "shoulders",
            subMuscle: "posterior",
            sets: 3,
            reps: "15-20",
            weight: 30,
            description: "Rear delt and upper trap exercise",
            difficulty: "Beginner",
            equipment: ["Cable Machine"],
          },
        ],
      },
    ],
  },
  {
    id: "arms",
    name: "Arms",
    emoji: "💪",
    color: "border-purple-500/30 bg-purple-500/5",
    subMuscles: [
      {
        id: "biceps",
        name: "Biceps",
        exercises: [
          {
            id: "curls",
            name: "Barbell Curls",
            muscle: "arms",
            subMuscle: "biceps",
            sets: 4,
            reps: "10-12",
            weight: 30,
            description: "Classic bicep mass builder",
            difficulty: "Beginner",
            equipment: ["Barbell"],
          },
          {
            id: "hammer-curls",
            name: "Hammer Curls",
            muscle: "arms",
            subMuscle: "biceps",
            sets: 3,
            reps: "10-12",
            weight: 20,
            description: "Neutral grip bicep exercise",
            difficulty: "Beginner",
            equipment: ["Dumbbells"],
          },
        ],
      },
      {
        id: "triceps",
        name: "Triceps",
        exercises: [
          {
            id: "tricep-dips",
            name: "Tricep Dips",
            muscle: "arms",
            subMuscle: "triceps",
            sets: 3,
            reps: "10-15",
            weight: 0,
            description: "Bodyweight tricep exercise",
            difficulty: "Intermediate",
            equipment: ["Dip Bars"],
          },
          {
            id: "close-grip-bench",
            name: "Close Grip Bench Press",
            muscle: "arms",
            subMuscle: "triceps",
            sets: 4,
            reps: "8-10",
            weight: 60,
            description: "Compound tricep movement",
            difficulty: "Intermediate",
            equipment: ["Barbell", "Bench"],
          },
        ],
      },
    ],
  },
  {
    id: "legs",
    name: "Legs",
    emoji: "🦵",
    color: "border-green-500/30 bg-green-500/5",
    subMuscles: [
      {
        id: "quadriceps",
        name: "Quadriceps",
        exercises: [
          {
            id: "squats",
            name: "Barbell Squats",
            muscle: "legs",
            subMuscle: "quadriceps",
            sets: 4,
            reps: "8-12",
            weight: 100,
            description: "King of leg exercises",
            difficulty: "Intermediate",
            equipment: ["Barbell", "Squat Rack"],
          },
          {
            id: "leg-press",
            name: "Leg Press",
            muscle: "legs",
            subMuscle: "quadriceps",
            sets: 4,
            reps: "12-15",
            weight: 150,
            description: "Quad-focused leg exercise",
            difficulty: "Beginner",
            equipment: ["Leg Press Machine"],
          },
        ],
      },
      {
        id: "hamstrings",
        name: "Hamstrings",
        exercises: [
          {
            id: "rdl",
            name: "Romanian Deadlifts",
            muscle: "legs",
            subMuscle: "hamstrings",
            sets: 4,
            reps: "10-12",
            weight: 80,
            description: "Hip-hinge hamstring exercise",
            difficulty: "Intermediate",
            equipment: ["Barbell"],
          },
          {
            id: "leg-curls",
            name: "Leg Curls",
            muscle: "legs",
            subMuscle: "hamstrings",
            sets: 3,
            reps: "12-15",
            weight: 40,
            description: "Hamstring isolation",
            difficulty: "Beginner",
            equipment: ["Leg Curl Machine"],
          },
        ],
      },
      {
        id: "glutes",
        name: "Glutes",
        exercises: [
          {
            id: "hip-thrusts",
            name: "Hip Thrusts",
            muscle: "legs",
            subMuscle: "glutes",
            sets: 4,
            reps: "12-15",
            weight: 60,
            description: "Glute activation and strength",
            difficulty: "Beginner",
            equipment: ["Barbell", "Bench"],
          },
          {
            id: "bulgarian-split",
            name: "Bulgarian Split Squats",
            muscle: "legs",
            subMuscle: "glutes",
            sets: 3,
            reps: "10-12",
            weight: 25,
            description: "Unilateral glute and quad exercise",
            difficulty: "Intermediate",
            equipment: ["Dumbbells", "Bench"],
          },
        ],
      },
    ],
  },
  {
    id: "core",
    name: "Core",
    emoji: "🔥",
    color: "border-orange-500/30 bg-orange-500/5",
    subMuscles: [
      {
        id: "abs",
        name: "Rectus Abdominis",
        exercises: [
          {
            id: "crunches",
            name: "Crunches",
            muscle: "core",
            subMuscle: "abs",
            sets: 3,
            reps: "15-20",
            weight: 0,
            description: "Basic ab exercise",
            difficulty: "Beginner",
            equipment: ["Bodyweight"],
          },
          {
            id: "leg-raises",
            name: "Leg Raises",
            muscle: "core",
            subMuscle: "abs",
            sets: 3,
            reps: "12-15",
            weight: 0,
            description: "Lower ab focus",
            difficulty: "Intermediate",
            equipment: ["Bodyweight"],
          },
        ],
      },
      {
        id: "obliques",
        name: "Obliques",
        exercises: [
          {
            id: "russian-twists",
            name: "Russian Twists",
            muscle: "core",
            subMuscle: "obliques",
            sets: 3,
            reps: "20-30",
            weight: 10,
            description: "Rotational core movement",
            difficulty: "Beginner",
            equipment: ["Medicine Ball"],
          },
          {
            id: "side-planks",
            name: "Side Planks",
            muscle: "core",
            subMuscle: "obliques",
            sets: 3,
            reps: "30-60s",
            weight: 0,
            description: "Isometric oblique exercise",
            difficulty: "Intermediate",
            equipment: ["Bodyweight"],
          },
        ],
      },
    ],
  },
];

export function CustomWorkoutBuilder({
  open,
  onOpenChange,
  onWorkoutCreated,
}: CustomWorkoutBuilderProps) {
  const [currentStep, setCurrentStep] = useState<
    "body-parts" | "sub-muscles" | "exercises"
  >("body-parts");
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(
    null,
  );
  const [selectedSubMuscle, setSelectedSubMuscle] = useState<string | null>(
    null,
  );
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState("");

  const resetBuilder = () => {
    setCurrentStep("body-parts");
    setSelectedBodyPart(null);
    setSelectedSubMuscle(null);
    setSelectedExercises([]);
    setWorkoutName("");
  };

  const handleClose = () => {
    resetBuilder();
    onOpenChange(false);
  };

  const handleBodyPartSelect = (bodyPart: BodyPart) => {
    setSelectedBodyPart(bodyPart);
    setCurrentStep("sub-muscles");
  };

  const handleSubMuscleSelect = (subMuscleId: string) => {
    setSelectedSubMuscle(subMuscleId);
    setCurrentStep("exercises");
  };

  const toggleExercise = (exercise: Exercise) => {
    setSelectedExercises((prev) => {
      const exists = prev.find((ex) => ex.id === exercise.id);
      if (exists) {
        return prev.filter((ex) => ex.id !== exercise.id);
      } else {
        return [...prev, exercise];
      }
    });
  };

  const handleCreateWorkout = () => {
    if (selectedExercises.length > 0 && workoutName.trim()) {
      onWorkoutCreated({
        name: workoutName,
        exercises: selectedExercises,
      });
      handleClose();
    }
  };

  const goBack = () => {
    if (currentStep === "exercises") {
      setCurrentStep("sub-muscles");
      setSelectedSubMuscle(null);
    } else if (currentStep === "sub-muscles") {
      setCurrentStep("body-parts");
      setSelectedBodyPart(null);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "body-parts":
        return "Select Body Parts";
      case "sub-muscles":
        return `${selectedBodyPart?.name} - Select Muscle Groups`;
      case "exercises":
        return `${selectedBodyPart?.subMuscles.find((sm) => sm.id === selectedSubMuscle)?.name} - Choose Exercises`;
      default:
        return "Custom Workout Builder";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-card border-glass-border max-w-lg max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg">
            <Target className="w-5 h-5 mr-2 text-primary" />
            {getStepTitle()}
          </DialogTitle>
          <div className="flex items-center justify-end space-x-2 absolute top-4 right-4">
            {currentStep !== "body-parts" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Indicator */}
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                currentStep === "body-parts"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              1
            </div>
            <div className="flex-1 h-1 bg-muted rounded-full">
              <div
                className={cn(
                  "h-full bg-primary rounded-full transition-all duration-300",
                  currentStep === "body-parts"
                    ? "w-0"
                    : currentStep === "sub-muscles"
                      ? "w-1/2"
                      : "w-full",
                )}
              />
            </div>
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                currentStep === "sub-muscles"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              2
            </div>
            <div className="flex-1 h-1 bg-muted rounded-full">
              <div
                className={cn(
                  "h-full bg-primary rounded-full transition-all duration-300",
                  currentStep === "exercises" ? "w-full" : "w-0",
                )}
              />
            </div>
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                currentStep === "exercises"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              3
            </div>
          </div>

          <ScrollArea className="h-96">
            {/* Body Parts Selection */}
            {currentStep === "body-parts" && (
              <div className="grid grid-cols-2 gap-3">
                {bodyParts.map((bodyPart) => (
                  <Card
                    key={bodyPart.id}
                    className={cn(
                      "glass-card border-glass-border cursor-pointer transition-all duration-300 hover:scale-105 hover:glow-accent",
                      bodyPart.color,
                    )}
                    onClick={() => handleBodyPartSelect(bodyPart)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{bodyPart.emoji}</div>
                      <div className="font-semibold text-sm">
                        {bodyPart.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {bodyPart.subMuscles.length} muscle groups
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Sub-Muscles Selection */}
            {currentStep === "sub-muscles" && selectedBodyPart && (
              <div className="space-y-3">
                {selectedBodyPart.subMuscles.map((subMuscle) => (
                  <Card
                    key={subMuscle.id}
                    className="glass-card border-glass-border cursor-pointer transition-all duration-300 hover:glow-accent"
                    onClick={() => handleSubMuscleSelect(subMuscle.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{subMuscle.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {subMuscle.exercises.length} exercises available
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Exercises Selection */}
            {currentStep === "exercises" &&
              selectedBodyPart &&
              selectedSubMuscle && (
                <div className="space-y-3">
                  {selectedBodyPart.subMuscles
                    .find((sm) => sm.id === selectedSubMuscle)
                    ?.exercises.map((exercise) => (
                      <Card
                        key={exercise.id}
                        className={cn(
                          "glass-card border-glass-border cursor-pointer transition-all duration-300",
                          selectedExercises.find((ex) => ex.id === exercise.id)
                            ? "border-primary bg-primary/5 glow"
                            : "hover:glow-accent",
                        )}
                        onClick={() => toggleExercise(exercise)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold">
                                  {exercise.name}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  {exercise.difficulty}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {exercise.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs">
                                <span>{exercise.sets} sets</span>
                                <span>{exercise.reps} reps</span>
                                {exercise.weight > 0 && (
                                  <span>{exercise.weight}kg</span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {exercise.equipment.map((eq, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {eq}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Checkbox
                              checked={selectedExercises.some(
                                (ex) => ex.id === exercise.id,
                              )}
                              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
          </ScrollArea>

          {/* Selected Exercises Summary */}
          {selectedExercises.length > 0 && (
            <div className="space-y-3">
              <Separator />
              <div>
                <h4 className="font-semibold text-sm mb-2">
                  Selected Exercises ({selectedExercises.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedExercises.map((exercise) => (
                    <Badge
                      key={exercise.id}
                      variant="secondary"
                      className="text-xs cursor-pointer"
                      onClick={() => toggleExercise(exercise)}
                    >
                      {exercise.name}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Workout Name Input */}
              <div>
                <Input
                  placeholder="Enter workout name..."
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  className="glass-card border-glass-border"
                />
              </div>

              {/* Create Workout Button */}
              <Button
                onClick={handleCreateWorkout}
                disabled={!workoutName.trim() || selectedExercises.length === 0}
                className="w-full glow-accent"
              >
                <Save className="w-4 h-4 mr-2" />
                Create Custom Workout
              </Button>
            </div>
          )}

          {/* Continue Button for selecting more body parts */}
          {currentStep === "exercises" && (
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep("body-parts");
                setSelectedBodyPart(null);
                setSelectedSubMuscle(null);
              }}
              className="w-full glass-card"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add More Body Parts
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
