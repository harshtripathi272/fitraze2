import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ADDED: Import axios for API calls
import axios from 'axios';
import { ProgressRing } from "@/components/ProgressRing";
import { Header } from "@/components/Header";
import { FoodLogDialog } from "@/components/FoodLogDialog";
import { WorkoutLogDialog } from "@/components/WorkoutLogDialog";
import { WaterLogDialog } from "@/components/WaterLogDialog";
import { SleepLogDialog } from "@/components/SleepLogDialog";
import { MealScanModal } from "@/components/MealScanModal";
import { StreakCelebration } from "@/components/StreakCelebration";
import { StepsWidget } from "@/components/StepsWidget";
import { TodaysActivities } from "@/components/TodaysActivities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Flame,
  Droplet,
  Moon,
  Target,
  TrendingUp,
  Zap,
  Plus,
  PieChart as PieChartIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";


// =================================================================
// --- API LOGIC (Required for this page to function) ---
// =================================================================
const API_URL = 'http://127.0.0.1:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const getTodaysWater = () => {
  return apiClient.get('/water/today');
};
// =================================================================
// --- REACT COMPONENT ---
// =================================================================

// ... (Your existing interfaces for Food, SleepData, IndexProps remain the same)
interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

interface SleepData {
  bedTime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  notes?: string;
}

interface IndexProps {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onLogout?: () => void;
}


export default function Index({ user, onLogout }: IndexProps) {
  const navigate = useNavigate();
  const [showFoodDialog, setShowFoodDialog] = useState(false);
  const [showWorkoutDialog, setShowWorkoutDialog] = useState(false);
  const [showWaterDialog, setShowWaterDialog] = useState(false);
  const [showSleepDialog, setShowSleepDialog] = useState(false);

  // ... (Your existing useEffects can remain)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.warn = (message, ...args) => {
      if (
        typeof message === "string" &&
        (message.includes("defaultProps will be removed") ||
          message.includes("Support for defaultProps") ||
          message.includes("function components in a future major release"))
      ) {
        return;
      }
      originalWarn(message, ...args);
    };

    console.error = (message, ...args) => {
      if (
        typeof message === "string" &&
        (message.includes("defaultProps will be removed") ||
          message.includes("Support for defaultProps"))
      ) {
        return;
      }
      originalError(message, ...args);
    };

    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  useEffect(() => {
    const hasSeenCelebrationToday = sessionStorage.getItem(
      `celebration-${new Date().toDateString()}`,
    );
    if (!hasSeenCelebrationToday) {
      const timer = setTimeout(() => {
        setShowLaunchCelebration(true);
        sessionStorage.setItem(
          `celebration-${new Date().toDateString()}`,
          "true",
        );
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);
  const [dailyStats, setDailyStats] = useState({
    calories: { current: 0, goal: 2200 },
    protein: { current: 0, goal: 140 },
    carbs: { current: 0, goal: 220 },
    fat: { current: 0, goal: 85 },
    water: { current: 0, goal: 3000 },
    sleep: { current: 7.5, goal: 8 },
  });


  // State management for all tracking
  const getDailyNutrition = () => {
    return apiClient.get('/daily-nutrition');
  };
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [waterResponse, nutritionResponse] = await Promise.all([
          getTodaysWater(),
          getDailyNutrition()
        ]);

        setDailyStats({
          calories: nutritionResponse.data.calories,
          protein: nutritionResponse.data.protein,
          carbs: nutritionResponse.data.carbs,
          fat: nutritionResponse.data.fat,
          water: { current: waterResponse.data.total_ml, goal: 3000 },
          sleep: { current: 7.5, goal: 8 }
        });
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);


  
  const [loading, setLoading] = useState(true);

  // This function will be used to fetch and refresh water data
  const refreshWaterData = async () => {
    try {
      const waterResponse = await getTodaysWater(); // Uses the function defined above
      setDailyStats(prevStats => ({
        ...prevStats,
        water: { ...prevStats.water, current: waterResponse.data.total_ml }
      }));
    } catch (error) {
      console.error("Failed to fetch water data:", error);
    }
  };

  


  // ... (Your other state and macro data calculations can remain)
  const [loggedFoods, setLoggedFoods] = useState<
    Array<{ food: Food; mealType: string; timestamp: Date }>
  >([]);
  const [workoutStats, setWorkoutStats] = useState({
    completedToday: false,
    exercisesCompleted: 0,
  });
  const [sleepData, setSleepData] = useState<SleepData | null>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showLaunchCelebration, setShowLaunchCelebration] = useState(false);

  const macroData = [
  {
    name: "Protein",
    value: dailyStats.calories.current > 0
      ? Math.round(((dailyStats.protein.current * 4) / dailyStats.calories.current) * 100)
      : 0,
    calories: dailyStats.protein.current * 4,
    color: "#00BFFF"
  },
  {
    name: "Carbs",
    value: dailyStats.calories.current > 0
      ? Math.round(((dailyStats.carbs.current * 4) / dailyStats.calories.current) * 100)
      : 0,
    calories: dailyStats.carbs.current * 4,
    color: "#FFC107"
  },
  {
    name: "Fat",
    value: dailyStats.calories.current > 0
      ? Math.round(((dailyStats.fat.current * 9) / dailyStats.calories.current) * 100)
      : 0,
    calories: dailyStats.fat.current * 9,
    color: "#FF6B6B"
  }
];

  // ... (handleFoodAdded and handleWorkoutCompleted can remain)
  const handleFoodAdded = (food: Food, mealType: string) => {
    setLoggedFoods((prev) => [...prev, { food, mealType, timestamp: new Date() }]);
    setDailyStats((prev) => ({
      ...prev,
      calories: { ...prev.calories, current: Math.min(prev.calories.current + food.calories, prev.calories.goal + 500) },
      protein: { ...prev.protein, current: Math.min(prev.protein.current + food.protein, prev.protein.goal + 50) },
      carbs: { ...prev.carbs, current: Math.min(prev.carbs.current + food.carbs, prev.carbs.goal + 100) },
      fat: { ...prev.fat, current: Math.min(prev.fat.current + food.fat, prev.fat.goal + 30) },
    }));
  };

  const handleWorkoutCompleted = (workout: any) => {
    setWorkoutStats({ completedToday: true, exercisesCompleted: workout.completedCount });
  };
  
  // DELETED: The old handleWaterAdded function is no longer needed here.

  // ... (The rest of your functions and JSX can remain the same)
  const handleSleepLogged = (sleep: SleepData) => {
    setSleepData(sleep);
    setDailyStats((prev) => ({ ...prev, sleep: { ...prev.sleep, current: sleep.duration } }));
  };

  const handleScanMeal = () => {
    setShowScanModal(true);
  };

  const streakStats = { currentStreak: 12, longestStreak: 15, caloriesBurned: 5400, mealsLogged: 41, workoutsCompleted: 9 };
  const calorieProgress = (dailyStats.calories.current / dailyStats.calories.goal) * 100;
  const proteinProgress = (dailyStats.protein.current / dailyStats.protein.goal) * 100;
  const waterProgress = (dailyStats.water.current / dailyStats.water.goal) * 100;

  const MacroTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = data.value.toFixed(1);
      const grams = data.name === "Protein" ? dailyStats.protein.current : data.name === "Carbs" ? dailyStats.carbs.current : dailyStats.fat.current;
      return (
        <div className="glass-card p-3 border border-glass-border rounded-lg text-xs glow-accent animate-slide-in-up">
          <p className="font-medium text-sm flex items-center">
            <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: data.color }} />
            {data.name}
          </p>
          <p className="text-muted-foreground mt-1">{percentage}% of total calories</p>
          <p className="text-foreground font-medium">{grams}g • {data.calories} calories</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 px-3 sm:px-4">
      <Header userName={user?.firstName || "Alex"} streakDays={12} onScanMeal={handleScanMeal} onLogout={onLogout} />
      {/* ... The rest of your JSX remains exactly the same ... */}
      <div className="px-1 sm:px-4 mt-6">
        <div className="glass-card p-4 sm:p-6 rounded-2xl border border-glass-border glow-intense text-center">
          <p className="text-xs sm:text-sm text-muted-foreground mb-2">Today's Calorie Goal</p>
          <ProgressRing progress={calorieProgress} size={90} className="sm:scale-110 glow-intense">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-primary">{dailyStats.calories.current}</div>
              <div className="text-xs text-muted-foreground">of {dailyStats.calories.goal}</div>
            </div>
          </ProgressRing>
        </div>
      </div>
      <div className="px-1 sm:px-4 mb-6 mt-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Today's Progress</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Card className="glass-card border-glass-border glow-accent animate-glow-pulse hover:glow-intense transition-all duration-300">
            <CardContent className="p-3 sm:p-4 text-center">
              <ProgressRing progress={proteinProgress} size={70} color="accent" className="sm:scale-110">
                <div>
                  <div className="text-sm font-bold">{dailyStats.protein.current}g</div>
                  <div className="text-xs text-muted-foreground">Protein</div>
                </div>
              </ProgressRing>
            </CardContent>
          </Card>
          <Card className="glass-card border-glass-border glow-intense animate-glow hover:glow-intense transition-all duration-300">
            <CardContent className="p-3 sm:p-4 text-center">
              <ProgressRing progress={waterProgress} size={70} color="primary" className="sm:scale-110">
                <div>
                  <div className="text-sm font-bold">{(dailyStats.water.current / 1000).toFixed(1)}L</div>
                  <div className="text-xs text-muted-foreground">Water</div>
                </div>
              </ProgressRing>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-base sm:text-lg font-semibold mb-4 px-1 sm:px-4">Today's Insights</h3>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 px-1 sm:px-4" style={{ width: "fit-content" }}>
            <Card className="glass-card border-glass-border glow-accent min-w-[320px] sm:min-w-[380px] animate-slide-from-left">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-accent animate-glow" />
                  Today's Macro Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="h-32 w-32 sm:h-40 sm:w-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={macroData} cx="50%" cy="50%" innerRadius={25} outerRadius={50} paddingAngle={2} dataKey="value">
                          {macroData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 8px ${entry.color})`, opacity: 0.95, transition: "all 0.3s ease" }} className="hover:opacity-100 cursor-pointer" />
                          ))}
                        </Pie>
                        <Tooltip content={<MacroTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 ml-4 space-y-3">
                    {macroData.map((macro, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: macro.color }} />
                          <span className="text-sm font-medium">{macro.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">{macro.value}%</div>
                          <div className="text-xs text-muted-foreground">{macro.calories} cal</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <StepsWidget className="min-w-[320px] sm:min-w-[380px] animate-slide-from-right" />
          </div>
        </div>
        <div className="flex justify-center mt-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-muted rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="px-1 sm:px-4 mb-6">
        <div className="glass-card p-4 sm:p-6 rounded-2xl border border-glass-border glow">
          <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary animate-glow" />
            Daily Targets
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-3 h-3 rounded-full bg-accent animate-glow-pulse"></div>
                <span className="text-sm">Protein</span>
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-medium">{dailyStats.protein.current}g / {dailyStats.protein.goal}g</div>
                <div className="w-20 sm:w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent progress-fill glow-accent" style={{ "--progress-width": `${Math.min(proteinProgress, 100)}%`, backgroundColor: "#00BFFF" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-3 h-3 rounded-full bg-primary animate-glow"></div>
                <span className="text-sm">Carbs</span>
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-medium">{dailyStats.carbs.current}g / {dailyStats.carbs.goal}g</div>
                <div className="w-20 sm:w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full progress-fill glow" style={{ "--progress-width": `${Math.min((dailyStats.carbs.current / dailyStats.carbs.goal) * 100, 100)}%`, backgroundColor: "#FFC107" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-3 h-3 rounded-full bg-glow-tertiary animate-glow-pulse"></div>
                <span className="text-sm">Fat</span>
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-medium">{dailyStats.fat.current}g / {dailyStats.fat.goal}g</div>
                <div className="w-20 sm:w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full progress-fill" style={{ "--progress-width": `${Math.min((dailyStats.fat.current / dailyStats.fat.goal) * 100, 100)}%`, backgroundColor: "#FF6B6B", boxShadow: "0 0 10px #FF6B6B" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TodaysActivities loggedFoods={loggedFoods} workoutStats={workoutStats} />
      <div className="px-1 sm:px-4 mb-6">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button className="glass-enhanced h-14 sm:h-16 flex-col space-y-1 glow-intense hover:glow-intense btn-glow-effect ripple-effect animate-slide-from-left" variant="outline" onClick={() => setShowFoodDialog(true)} style={{ animationDelay: "0ms" }}>
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 animate-glow" />
            <span className="text-xs sm:text-sm">Log Food</span>
          </Button>
          <Button className="glass-enhanced h-14 sm:h-16 flex-col space-y-1 glow-accent hover:glow-accent btn-glow-effect ripple-effect animate-slide-from-right" variant="outline" onClick={() => setShowWaterDialog(true)} style={{ animationDelay: "100ms" }}>
            <Droplet className="w-4 h-4 sm:w-5 sm:h-5 animate-glow-pulse" />
            <span className="text-xs sm:text-sm">Add Water</span>
          </Button>
          <Button className="glass-enhanced h-14 sm:h-16 flex-col space-y-1 glow hover:glow-intense btn-glow-effect ripple-effect animate-slide-from-left" variant="outline" onClick={() => setShowWorkoutDialog(true)} style={{ animationDelay: "200ms" }}>
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 animate-glow" />
            <span className="text-xs sm:text-sm">Log Workout</span>
          </Button>
          <Button className="glass-enhanced h-14 sm:h-16 flex-col space-y-1 glow-accent hover:glow-accent btn-glow-effect ripple-effect animate-slide-from-right" variant="outline" onClick={() => setShowSleepDialog(true)} style={{ animationDelay: "300ms" }}>
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 animate-glow-pulse" />
            <span className="text-xs sm:text-sm">Log Sleep</span>
          </Button>
        </div>
      </div>
      <FoodLogDialog open={showFoodDialog} onOpenChange={setShowFoodDialog} onFoodAdded={handleFoodAdded} onScanMeal={handleScanMeal} onNavigateToCustomFood={() => navigate("/quick-add-food")} />
      <WorkoutLogDialog open={showWorkoutDialog} onOpenChange={setShowWorkoutDialog} onWorkoutCompleted={handleWorkoutCompleted} />
      {/* CHANGED: Removed the old props and added the new `onDataChange` prop */}
      <WaterLogDialog 
        open={showWaterDialog} 
        onOpenChange={setShowWaterDialog} 
        onDataChange={refreshWaterData}
      />
      <SleepLogDialog open={showSleepDialog} onOpenChange={setShowSleepDialog} onSleepLogged={handleSleepLogged} />
      <MealScanModal
        open={showScanModal}
        onOpenChange={setShowScanModal}
        onFoodAdded={(food: any, mealType: string) => {
          const convertedFood = {
            id: food.id ?? crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
            name: food.name,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            serving: food.serving ?? "",
          };
          handleFoodAdded(convertedFood, mealType);
        }}
      />
      <StreakCelebration open={showLaunchCelebration} onOpenChange={setShowLaunchCelebration} streakData={streakStats} isLaunchCelebration={true} />
    </div>
  );
}