import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "./ProgressRing";
import { 
  Utensils, 
  Dumbbell, 
  Plus, 
  Clock,
  Flame,
  Target,
  Trophy,
  ChevronDown,
  ChevronUp,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

interface LoggedFood {
  food: Food;
  mealType: string;
  timestamp: Date;
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight: number;
  completed: boolean;
}

interface Workout {
  name: string;
  type: string;
  duration: number;
  exercises: Exercise[];
  totalVolume: number;
}

interface TodaysActivitiesProps {
  loggedFoods: LoggedFood[];
  workoutStats: {
    completedToday: boolean;
    exercisesCompleted: number;
  };
  workoutData?: Workout;
}

export function TodaysActivities({ loggedFoods, workoutStats, workoutData }: TodaysActivitiesProps) {
  const [activeTab, setActiveTab] = useState("meals");
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [expandedWorkout, setExpandedWorkout] = useState(false);

  // Group foods by meal type
  const mealGroups = loggedFoods.reduce((groups, entry) => {
    const mealType = entry.mealType;
    if (!groups[mealType]) {
      groups[mealType] = [];
    }
    groups[mealType].push(entry);
    return groups;
  }, {} as Record<string, LoggedFood[]>);

  const getMealTotals = (meals: LoggedFood[]) => {
    return meals.reduce((totals, entry) => ({
      calories: totals.calories + entry.food.calories,
      protein: totals.protein + entry.food.protein,
      carbs: totals.carbs + entry.food.carbs,
      fat: totals.fat + entry.food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const getMacroPercentages = (protein: number, carbs: number, fat: number) => {
    const totalCals = (protein * 4) + (carbs * 4) + (fat * 9);
    if (totalCals === 0) return { protein: 0, carbs: 0, fat: 0 };
    
    return {
      protein: Math.round((protein * 4 / totalCals) * 100),
      carbs: Math.round((carbs * 4 / totalCals) * 100),
      fat: Math.round((fat * 9 / totalCals) * 100)
    };
  };

  const MacroBar = ({ protein, carbs, fat }: { protein: number; carbs: number; fat: number }) => {
    const percentages = getMacroPercentages(protein, carbs, fat);
    
    return (
      <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-blue-400 transition-all duration-500"
          style={{ width: `${percentages.protein}%` }}
        />
        <div 
          className="h-full bg-yellow-400 transition-all duration-500"
          style={{ width: `${percentages.carbs}%` }}
        />
        <div 
          className="h-full bg-pink-400 transition-all duration-500"
          style={{ width: `${percentages.fat}%` }}
        />
      </div>
    );
  };

  const mealIcons = {
    breakfast: "🌅",
    lunch: "☀️", 
    dinner: "🌙",
    snack: "🍎"
  };

  // Mock workout data if not provided
  const defaultWorkout: Workout = {
    name: "Push Day",
    type: "Upper Body",
    duration: 65,
    totalVolume: 1250,
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10", weight: 80, completed: true },
      { name: "Incline DB Press", sets: 3, reps: "10-12", weight: 30, completed: true },
      { name: "Push-ups", sets: 3, reps: "15", weight: 0, completed: false }
    ]
  };

  const workout = workoutData || defaultWorkout;

  if (loggedFoods.length === 0 && !workoutStats.completedToday) {
    return null;
  }

  return (
    <div className="px-1 sm:px-4 mb-6">
      <Card className="glass-card border-glass-border glow-accent">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg font-semibold">Today's Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 glass-card h-10 mb-4">
              <TabsTrigger 
                value="meals" 
                className="data-[state=active]:glow-accent transition-all duration-300"
              >
                <Utensils className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Meals</span>
              </TabsTrigger>
              <TabsTrigger 
                value="workout"
                className="data-[state=active]:glow-accent transition-all duration-300"
              >
                <Dumbbell className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Workout</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="meals" className="space-y-4 animate-slide-from-left">
              {Object.keys(mealGroups).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Utensils className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No meals logged today</p>
                  <p className="text-xs">Start tracking your nutrition!</p>
                </div>
              ) : (
                Object.entries(mealGroups).map(([mealType, meals]) => {
                  const totals = getMealTotals(meals);
                  const isExpanded = expandedMeal === mealType;
                  
                  return (
                    <Card 
                      key={mealType}
                      className="glass-card border-glass-border cursor-pointer hover:glow transition-all duration-300"
                      onClick={() => setExpandedMeal(isExpanded ? null : mealType)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{mealIcons[mealType as keyof typeof mealIcons] || "🍽️"}</span>
                            <div>
                              <h4 className="font-semibold capitalize">{mealType}</h4>
                              <p className="text-xs text-muted-foreground">
                                {meals.length} item{meals.length !== 1 ? 's' : ''} • {totals.calories} cal
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-right">
                              <div className="text-sm font-bold">{totals.calories}</div>
                              <div className="text-xs text-muted-foreground">calories</div>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>

                        {/* Macro Bar */}
                        <div className="mb-3">
                          <MacroBar protein={totals.protein} carbs={totals.carbs} fat={totals.fat} />
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-blue-400">P: {totals.protein}g</span>
                            <span className="text-yellow-400">C: {totals.carbs}g</span>
                            <span className="text-pink-400">F: {totals.fat}g</span>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        <div className={cn(
                          "overflow-hidden transition-all duration-500 ease-in-out",
                          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        )}>
                          <div className="pt-3 border-t border-glass-border space-y-2">
                            {meals.map((entry, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <div>
                                  <span className="text-sm font-medium">{entry.food.name}</span>
                                  <p className="text-xs text-muted-foreground">{entry.food.serving}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold">{entry.food.calories} cal</div>
                                  <div className="text-xs text-muted-foreground">
                                    P:{entry.food.protein}g C:{entry.food.carbs}g F:{entry.food.fat}g
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="workout" className="space-y-4 animate-slide-from-right">
              {!workoutStats.completedToday ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Dumbbell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No workouts logged today</p>
                  <p className="text-xs">Time to get moving!</p>
                </div>
              ) : (
                <Card className="glass-card border-glass-border cursor-pointer hover:glow transition-all duration-300"
                      onClick={() => setExpandedWorkout(!expandedWorkout)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Zap className="w-6 h-6 text-accent animate-glow" />
                        <div>
                          <h4 className="font-semibold">{workout.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {workout.type} • {workout.duration} min
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <ProgressRing 
                          progress={(workout.exercises.filter(e => e.completed).length / workout.exercises.length) * 100} 
                          size={50} 
                          color="accent"
                        >
                          <span className="text-xs font-bold">
                            {workout.exercises.filter(e => e.completed).length}/{workout.exercises.length}
                          </span>
                        </ProgressRing>
                        {expandedWorkout ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Workout Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-sm font-bold text-accent">{workout.exercises.length}</div>
                        <div className="text-xs text-muted-foreground">exercises</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-orange-400">{workout.totalVolume}</div>
                        <div className="text-xs text-muted-foreground">volume (kg)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-green-400">{workout.duration}</div>
                        <div className="text-xs text-muted-foreground">minutes</div>
                      </div>
                    </div>

                    {/* Expanded Exercise List */}
                    <div className={cn(
                      "overflow-hidden transition-all duration-500 ease-in-out",
                      expandedWorkout ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}>
                      <div className="pt-3 border-t border-glass-border space-y-3">
                        {workout.exercises.map((exercise, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                exercise.completed ? "bg-green-400 animate-pulse" : "bg-gray-500"
                              )} />
                              <span className="text-sm font-medium">{exercise.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold">
                                {exercise.sets} × {exercise.reps}
                              </div>
                              {exercise.weight > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  @ {exercise.weight}kg
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
