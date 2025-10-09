import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExerciseDetailsModal } from "@/components/ExerciseDetailsModal";
import { CustomWorkoutBuilder } from "@/components/CustomWorkoutBuilder";
import { cn } from "@/lib/utils";
import {
  Dumbbell,
  Play,
  Info,
  TrendingUp,
  CheckCircle2,
  Target,
  Zap,
  Brain,
  Plus,
  Minus,
  Clock,
  Trophy,
  Settings,
} from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  muscle: string;
  sets: number;
  reps: string;
  weight: number;
  completed: boolean;
  videoId?: string;
  tips: string;
  lastWeight?: number;
  lastReps?: number;
  description: string;
  precautions: string[];
  targetMuscles: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  equipment: string[];
}

interface WorkoutPlan {
  id: string;
  name: string;
  type: string;
  duration: string;
  exercises: Exercise[];
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Custom";
}

interface WorkoutLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkoutCompleted: (workout: any) => void;
}

const workoutSplits = [
  { id: "push-pull-legs", name: "Push/Pull/Legs", icon: "🔀" },
  { id: "full-body", name: "Full Body", icon: "💪" },
  { id: "upper-lower", name: "Upper/Lower", icon: "⬆️" },
  { id: "custom", name: "Custom Split", icon: "⚙️" },
];

const muscleGroups = {
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  arms: "Arms",
  legs: "Legs",
  core: "Core",
};

const sampleExercises: Exercise[] = [
  {
    id: "1",
    name: "Bench Press",
    muscle: "chest",
    sets: 4,
    reps: "8-10",
    weight: 80,
    completed: false,
    videoId: "rT7DgCr-3pg",
    tips: "Keep your core tight, lower the bar to your chest, and drive through your heels.",
    lastWeight: 75,
    lastReps: 8,
    description:
      "The bench press is a compound upper body exercise that primarily targets the chest muscles. Lie on a bench with your feet flat on the floor, grip the barbell with hands slightly wider than shoulder-width, and press the weight up and down in a controlled motion.",
    precautions: [
      "Always use a spotter when lifting heavy weights",
      "Don't bounce the bar off your chest",
      "Keep your feet planted on the floor throughout the movement",
      "Maintain a slight arch in your lower back",
    ],
    targetMuscles: ["Pectoralis Major", "Anterior Deltoids", "Triceps"],
    difficulty: "Intermediate",
    equipment: ["Barbell", "Bench", "Weight Plates"],
  },
  {
    id: "2",
    name: "Incline Dumbbell Press",
    muscle: "chest",
    sets: 3,
    reps: "10-12",
    weight: 30,
    completed: false,
    tips: "Set the bench to 30-45 degrees. Focus on squeezing your chest at the top.",
    lastWeight: 28,
    lastReps: 10,
    description:
      "The incline dumbbell press targets the upper portion of the chest muscles. Set an adjustable bench to a 30-45 degree angle, hold dumbbells at chest level, and press them up and together while maintaining control.",
    precautions: [
      "Don't set the incline too steep (over 45 degrees)",
      "Control the weight during the lowering phase",
      "Don't let dumbbells drop at the bottom of the movement",
    ],
    targetMuscles: ["Upper Pectoralis", "Anterior Deltoids", "Triceps"],
    difficulty: "Beginner",
    equipment: ["Dumbbells", "Incline Bench"],
  },
  {
    id: "3",
    name: "Pull-ups",
    muscle: "back",
    sets: 4,
    reps: "6-8",
    weight: 0,
    completed: false,
    videoId: "eGo4IYlbE5g",
    tips: "Pull your chest to the bar, not your chin. Engage your lats throughout the movement.",
    lastWeight: 0,
    lastReps: 6,
    description:
      "Pull-ups are a compound bodyweight exercise that primarily targets the back muscles. Hang from a pull-up bar with an overhand grip, engage your lats, and pull your body up until your chest reaches the bar level.",
    precautions: [
      "Avoid swinging or using momentum",
      "Don't drop down quickly - control the descent",
      "If you can't do full pull-ups, use assistance bands or start with negatives",
    ],
    targetMuscles: ["Latissimus Dorsi", "Rhomboids", "Biceps", "Rear Deltoids"],
    difficulty: "Intermediate",
    equipment: ["Pull-up Bar"],
  },
  {
    id: "4",
    name: "Barbell Rows",
    muscle: "back",
    sets: 4,
    reps: "8-10",
    weight: 70,
    completed: false,
    tips: "Keep your back straight, pull to your lower chest, squeeze your shoulder blades.",
    lastWeight: 65,
    lastReps: 8,
    description:
      "Barbell rows are an excellent compound exercise for building back thickness and strength. Bend at the hips with a slight knee bend, maintain a neutral spine, and pull the barbell to your lower chest while squeezing your shoulder blades together.",
    precautions: [
      "Keep your back straight throughout the movement",
      "Don't row too high (aim for lower chest/upper abdomen)",
      "Avoid using too much momentum",
      "Start with lighter weight to master the form",
    ],
    targetMuscles: [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Traps",
      "Rear Deltoids",
      "Biceps",
    ],
    difficulty: "Intermediate",
    equipment: ["Barbell", "Weight Plates"],
  },
  {
    id: "5",
    name: "Squats",
    muscle: "legs",
    sets: 4,
    reps: "8-12",
    weight: 100,
    completed: false,
    videoId: "ultWZbUMPL8",
    tips: "Keep your knees in line with your toes, go to parallel or below.",
    lastWeight: 95,
    lastReps: 10,
    description:
      "Squats are the king of leg exercises, working multiple muscle groups simultaneously. Stand with feet shoulder-width apart, lower your body by bending at the hips and knees until your thighs are parallel to the floor, then drive through your heels to return to standing.",
    precautions: [
      "Never let your knees cave inward",
      "Keep your chest up and back straight",
      "Don't let your heels come off the ground",
      "Start with bodyweight before adding external load",
    ],
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Calves", "Core"],
    difficulty: "Beginner",
    equipment: ["Barbell", "Squat Rack", "Weight Plates"],
  },
  {
    id: "6",
    name: "Romanian Deadlifts",
    muscle: "legs",
    sets: 3,
    reps: "10-12",
    weight: 80,
    completed: false,
    tips: "Keep the bar close to your body, hinge at the hips, feel the stretch in your hamstrings.",
    lastWeight: 75,
    lastReps: 10,
    description:
      "Romanian deadlifts primarily target the hamstrings and glutes through a hip-hinge movement. Start standing with the barbell, hinge at the hips while keeping a slight knee bend, lower the bar until you feel a stretch in your hamstrings, then drive your hips forward to return to standing.",
    precautions: [
      "Keep the bar close to your body throughout",
      "Don't round your back",
      "Focus on hip hinge, not knee bend",
      "Don't lower the bar too far if you lack flexibility",
    ],
    targetMuscles: ["Hamstrings", "Glutes", "Erector Spinae", "Traps"],
    difficulty: "Intermediate",
    equipment: ["Barbell", "Weight Plates"],
  },
];

const presetWorkouts: WorkoutPlan[] = [
  {
    id: "beginner-full",
    name: "Beginner Full Body",
    type: "full-body",
    duration: "45-60 min",
    difficulty: "Beginner",
    exercises: sampleExercises.slice(0, 4),
  },
  {
    id: "hypertrophy-push",
    name: "Hypertrophy Push Day",
    type: "push-pull-legs",
    duration: "60-75 min",
    difficulty: "Intermediate",
    exercises: sampleExercises
      .filter((e) => e.muscle === "chest")
      .concat([
        {
          id: "7",
          name: "Overhead Press",
          muscle: "shoulders",
          sets: 4,
          reps: "8-10",
          weight: 50,
          completed: false,
          tips: "Keep your core tight, press straight up, avoid arching your back.",
          lastWeight: 45,
          lastReps: 8,
          description:
            "The overhead press is a fundamental shoulder exercise that builds strength and stability. Stand with feet shoulder-width apart, press the barbell from shoulder height straight up overhead, then lower with control.",
          precautions: [
            "Keep your core engaged throughout",
            "Don't arch your back excessively",
            "Press straight up, not forward",
            "Use a spotter for heavy weights",
          ],
          targetMuscles: [
            "Anterior Deltoids",
            "Medial Deltoids",
            "Triceps",
            "Upper Traps",
          ],
          difficulty: "Intermediate",
          equipment: ["Barbell", "Weight Plates"],
        },
      ]),
  },
  {
    id: "fat-burn",
    name: "Fat Burn Circuit",
    type: "full-body",
    duration: "30-40 min",
    difficulty: "Intermediate",
    exercises: sampleExercises.slice(0, 3),
  },
];

const mindMuscleTips = [
  "Focus on the muscle you're working - visualize it contracting and lengthening.",
  "Quality over quantity - perfect form beats heavy weight every time.",
  "Breathe properly - exhale on the exertion, inhale on the release.",
  "Control the negative - the lowering phase is just as important as the lift.",
  "Progressive overload - aim to do slightly better than your last session.",
];

export function WorkoutLogDialog({
  open,
  onOpenChange,
  onWorkoutCompleted,
}: WorkoutLogDialogProps) {
  const [selectedSplit, setSelectedSplit] = useState("full-body");
  const [currentExercises, setCurrentExercises] =
    useState<Exercise[]>(sampleExercises);
  const [selectedPreset, setSelectedPreset] = useState<WorkoutPlan | null>(
    null,
  );
  const [currentTip] = useState(
    mindMuscleTips[Math.floor(Math.random() * mindMuscleTips.length)],
  );
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [showExerciseDetails, setShowExerciseDetails] = useState(false);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [customWorkouts, setCustomWorkouts] = useState<WorkoutPlan[]>([]);
  const [activeTab, setActiveTab] = useState("exercises");

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    setCurrentExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)),
    );
  };

  const toggleExerciseComplete = (id: string) => {
    setCurrentExercises((prev) =>
      prev.map((ex) =>
        ex.id === id ? { ...ex, completed: !ex.completed } : ex,
      ),
    );
  };

  const addSet = (id: string) => {
    setCurrentExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, sets: ex.sets + 1 } : ex)),
    );
  };

  const removeSet = (id: string) => {
    setCurrentExercises((prev) =>
      prev.map((ex) =>
        ex.id === id ? { ...ex, sets: Math.max(1, ex.sets - 1) } : ex,
      ),
    );
  };

  const getProgressIndicator = (exercise: Exercise) => {
    if (!exercise.lastWeight) return null;

    const weightProgress = exercise.weight > exercise.lastWeight!;
    const repsProgress = parseInt(exercise.reps) > exercise.lastReps!;

    if (weightProgress || repsProgress) {
      return (
        <Badge variant="secondary" className="glass text-green-400 text-xs">
          <TrendingUp className="w-3 h-3 mr-1" />
          Progress!
        </Badge>
      );
    }
    return null;
  };

  const ExerciseCard = ({ exercise }: { exercise: Exercise }) => (
    <Card
      className={`glass-card border-glass-border mb-4 ${exercise.completed ? "opacity-75" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div
            className="flex-1 cursor-pointer hover:text-primary transition-colors duration-300"
            onClick={() => {
              setSelectedExercise(exercise);
              setShowExerciseDetails(true);
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold hover:underline">{exercise.name}</h4>
              {getProgressIndicator(exercise)}
            </div>
            <Badge variant="outline" className="glass text-xs">
              {muscleGroups[exercise.muscle as keyof typeof muscleGroups]}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:scale-110 transition-all duration-300"
                  onClick={() => {
                    setSelectedExercise(exercise);
                    setShowExerciseDetails(true);
                  }}
                >
                  <Info className="w-4 h-4 text-primary animate-glow" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View exercise details</p>
              </TooltipContent>
            </Tooltip>

            <Checkbox
              checked={exercise.completed}
              onCheckedChange={() => toggleExerciseComplete(exercise.id)}
              className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Sets */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Sets
            </label>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={() => removeSet(exercise.id)}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-center min-w-[2rem] text-sm font-medium">
                {exercise.sets}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={() => addSet(exercise.id)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Reps */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Reps
            </label>
            <Input
              value={exercise.reps}
              onChange={(e) =>
                updateExercise(exercise.id, "reps", e.target.value)
              }
              className="h-8 text-center glass-card border-glass-border"
              placeholder="8-12"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Weight (kg)
            </label>
            <Input
              type="number"
              value={exercise.weight}
              onChange={(e) =>
                updateExercise(
                  exercise.id,
                  "weight",
                  parseFloat(e.target.value) || 0,
                )
              }
              className="h-8 text-center glass-card border-glass-border"
              placeholder="0"
            />
          </div>
        </div>

        {exercise.lastWeight && (
          <div className="mt-2 text-xs text-muted-foreground">
            Last session: {exercise.lastWeight}kg × {exercise.lastReps} reps
          </div>
        )}
      </CardContent>
    </Card>
  );

  const handleCustomWorkoutCreated = (workout: {
    name: string;
    exercises: any[];
  }) => {
    const newWorkout: WorkoutPlan = {
      id: `custom-${Date.now()}`,
      name: workout.name,
      type: "custom",
      duration: `${workout.exercises.length * 3}-${workout.exercises.length * 4} min`,
      difficulty: "Custom",
      exercises: workout.exercises.map((ex) => ({
        ...ex,
        completed: false,
        tips: ex.tips || "",
        description: ex.description || "",
        precautions: ex.precautions || [],
        targetMuscles: ex.targetMuscles || [],
        difficulty: ex.difficulty || "Beginner",
        equipment: ex.equipment || [],
      })),
    };
    setCustomWorkouts((prev) => [...prev, newWorkout]);
    setCurrentExercises(newWorkout.exercises);
    setSelectedPreset(newWorkout);
    setActiveTab("exercises"); // Switch to exercises tab after creating
  };

  const completedCount = currentExercises.filter((ex) => ex.completed).length;
  const totalExercises = currentExercises.length;

  const allPresets = [...presetWorkouts, ...customWorkouts];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-glass-border max-w-md mx-auto max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg">
            <Dumbbell className="w-5 h-5 mr-2 text-primary" />
            Log Workout
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Indicator */}
          <div className="glass-card p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedCount}/{totalExercises}
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(completedCount / totalExercises) * 100}%` }}
              />
            </div>
          </div>

          {/* Mind-Muscle Tip */}
          <div className="glass-card p-3 rounded-lg glow">
            <div className="flex items-start gap-2">
              <Brain className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-accent mb-1">
                  Mind-Muscle Tip
                </p>
                <p className="text-xs text-muted-foreground">{currentTip}</p>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 glass-card h-10">
              <TabsTrigger value="exercises" className="text-xs">
                Exercises
              </TabsTrigger>
              <TabsTrigger value="presets" className="text-xs">
                Presets
              </TabsTrigger>
            </TabsList>

            <TabsContent value="exercises" className="space-y-4">
              {/* Workout Split Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Workout Split
                </label>
                <Select value={selectedSplit} onValueChange={setSelectedSplit}>
                  <SelectTrigger className="glass-card border-glass-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-glass-border">
                    {workoutSplits.map((split) => (
                      <SelectItem key={split.id} value={split.id}>
                        {split.icon} {split.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Exercise List */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                {Object.entries(muscleGroups).map(([key, name]) => {
                  const exercises = currentExercises.filter(
                    (ex) => ex.muscle === key,
                  );
                  if (exercises.length === 0) return null;

                  return (
                    <div key={key}>
                      <h4 className="text-sm font-semibold mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-1 text-primary" />
                        {name}
                      </h4>
                      {exercises.map((exercise) => (
                        <ExerciseCard key={exercise.id} exercise={exercise} />
                      ))}
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="presets" className="space-y-4">
              {/* Custom Preset Builder Button */}
              <Button
                variant="outline"
                onClick={() => setShowCustomBuilder(true)}
                className="w-full glass-card border-dashed border-2 border-primary/30 hover:border-primary/50 hover:glow-accent transition-all duration-300"
              >
                <Settings className="w-4 h-4 mr-2 text-primary animate-pulse" />
                <span className="font-medium">Create Custom Preset</span>
              </Button>

              <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                {allPresets.map((preset) => (
                  <Card
                    key={preset.id}
                    className={cn(
                      "glass-card border-glass-border",
                      preset.type === "custom" &&
                        "border-primary/30 bg-primary/5",
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{preset.name}</h4>
                            {preset.type === "custom" && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-primary/20 text-primary"
                              >
                                Custom
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="glass text-xs">
                              {preset.difficulty}
                            </Badge>
                            <Badge variant="outline" className="glass text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {preset.duration}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            setCurrentExercises(
                              preset.exercises.map((ex) => ({
                                ...ex,
                                completed: false,
                              })),
                            );
                            setSelectedPreset(preset);
                            setActiveTab("exercises"); // Switch to exercises tab
                          }}
                          className="glow-accent"
                        >
                          Use
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {preset.exercises.length} exercises
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Complete Workout Button */}
          <div className="flex gap-2">
            <Button
              className="flex-1 glow"
              onClick={() => {
                onWorkoutCompleted({
                  exercises: currentExercises,
                  completedCount,
                  totalExercises,
                  split: selectedSplit,
                });
                onOpenChange(false);
              }}
              disabled={completedCount === 0}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Complete Workout
            </Button>
          </div>
        </div>

        {/* Exercise Details Modal */}
        <ExerciseDetailsModal
          open={showExerciseDetails}
          onOpenChange={setShowExerciseDetails}
          exercise={selectedExercise}
          onMarkComplete={() => {
            if (selectedExercise) {
              toggleExerciseComplete(selectedExercise.id);
            }
          }}
        />

        {/* Custom Workout Builder */}
        <CustomWorkoutBuilder
          open={showCustomBuilder}
          onOpenChange={setShowCustomBuilder}
          onWorkoutCreated={handleCustomWorkoutCreated}
        />
      </DialogContent>
    </Dialog>
  );
}
