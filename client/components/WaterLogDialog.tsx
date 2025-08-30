import { useState, useEffect } from "react";
// ADDED: Import axios to handle API requests directly in this file
import axios from 'axios';
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Droplet,
  Plus,
  Target,
  Bell,
  Snowflake,
  Trophy,
  Info,
  Zap,
  Heart
} from "lucide-react";
import { useNavigate } from "react-router-dom";


// =================================================================
// --- API LOGIC (Moved from api.ts into this file) ---
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

// This function sends a POST request
const logWater = (amount_ml: number) => {
  return apiClient.post('/water', { amount_ml });
};

const getTodaysWater = () => {
  return apiClient.get('/water/today');
};

// =================================================================
// --- REACT COMPONENT ---
// =================================================================


interface WaterLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataChange: () => void; // <-- ADD THIS LINE
}

const hydrationBenefits = [
  "Boosts energy and brain function",
  "Helps maintain healthy skin",
  "Aids in digestion and nutrient absorption",
  "Regulates body temperature",
  "Supports kidney function",
  "Improves physical performance"
];

const quickAddAmounts = [
  { amount: 250, label: "Glass", icon: "🥛" },
  { amount: 500, label: "Bottle", icon: "🍶" },
  { amount: 1000, label: "Large", icon: "🥤" },
];

export function WaterLogDialog({ 
  open, 
  onOpenChange,
  onDataChange
}: WaterLogDialogProps) {
  // State for data from the backend
  const [totalIntake, setTotalIntake] = useState(0);
  const [goal, setGoal] = useState(3000); 

  // State for API communication status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Your original UI state remains untouched
  const [customAmount, setCustomAmount] = useState(250);
  const [isIceMode, setIsIceMode] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderInterval, setReminderInterval] = useState(2);
  const [currentBenefit] = useState(
    hydrationBenefits[Math.floor(Math.random() * hydrationBenefits.length)]
  );
  
  const progress = goal > 0 ? Math.min((totalIntake / goal) * 100, 100) : 0;
  const isGoalReached = totalIntake >= goal;

  const fetchTodaysData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTodaysWater();
      setTotalIntake(response.data.total_ml);
    } catch (err) {
      setError("Failed to fetch water data.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTodaysData();
    }
  }, [open]);

  useEffect(() => {
    if (isGoalReached && !showCelebration) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [totalIntake, isGoalReached, showCelebration]);

  const handleAddWater = async (amount: number) => {
    if (amount <= 0 || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await logWater(amount); // This function now lives at the top of this file
      await fetchTodaysData();
      onDataChange();
    } catch (err) {
      setError("Failed to log water. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const navigate = useNavigate();


  const incrementCustomAmount = () => {
    setCustomAmount((prev) => Math.min(prev + 50, 1500));
  };

  // Your full WaterBottleAnimation component and the rest of the JSX
  // ... (All your original JSX from the 380-line file goes here)
  const WaterBottleAnimation = () => {
    const bottleHeight = 200;
    const fillHeight = (progress / 100) * (bottleHeight - 40);

    return (
      <div className="relative mx-auto" style={{ width: '80px', height: `${bottleHeight}px` }}>
        {/* Bottle Outline */}
        <div className="absolute inset-0 border-2 border-primary rounded-lg bg-glass-bg/20 backdrop-blur-sm">
          {/* Bottle Cap */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-primary rounded-t-lg"></div>
          
          {/* Water Fill */}
          <div 
            className={`absolute bottom-0 left-0 right-0 rounded-b-lg transition-all duration-1000 ease-out ${
              isIceMode ? 'bg-blue-300/80' : 'bg-blue-400/80'
            }`}
            style={{ height: `${fillHeight}px` }}
          >
            {/* Bubbles Animation */}
            {progress > 0 && (
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1 h-1 ${isIceMode ? 'bg-white' : 'bg-blue-200'} rounded-full animate-float`}
                    style={{
                      left: `${20 + i * 15}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: '2s'
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Ice Cubes Effect */}
            {isIceMode && progress > 20 && (
              <div className="absolute inset-0">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white/60 transform rotate-45"
                    style={{
                      left: `${25 + i * 20}%`,
                      top: `${10 + i * 30}%`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Progress Percentage */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-center">
              <div className="text-sm font-bold text-primary">{Math.round(progress)}%</div>
              <div className="text-xs text-muted-foreground">
                {(totalIntake / 1000).toFixed(1)}L
              </div>
            </div>
          </div>
        </div>

        {/* Goal Reached Celebration */}
        {showCelebration && (
          <div className="absolute -inset-4 pointer-events-none">
            <div className="text-2xl animate-bounce">🎉</div>
            <div className="absolute top-0 right-0 text-xl animate-pulse">⭐</div>
            <div className="absolute bottom-0 left-0 text-lg animate-ping">✨</div>
          </div>
        )}

        {/* Ice Theme Snowflakes */}
        {isIceMode && (
          <div className="absolute -inset-2 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <Snowflake
                key={i}
                className="absolute w-3 h-3 text-blue-300 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        {/* Your custom scrollbar style tag */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(128, 128, 128, 0.5);
            border-radius: 10px;
            border: 3px solid transparent;
            background-clip: content-box;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(128, 128, 128, 0.7);
          }
        `}</style>
        <DialogContent className="glass-card border-glass-border max-w-sm mx-auto max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="flex items-center text-lg">
              <Droplet className="w-5 h-5 mr-2 text-primary" />
              Add Water
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Water Bottle Animation */}
            <div className="text-center py-4">
              <WaterBottleAnimation />
              
              {/* Goal Status */}
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-1">Daily Progress</p>
                <p className="font-semibold">
                  {(totalIntake / 1000).toFixed(1)}L of {(goal / 1000).toFixed(1)}L
                </p>
                {isGoalReached && (
                  <Badge className="mt-2 glow-accent animate-pulse">
                    <Trophy className="w-3 h-3 mr-1" />
                    Goal Reached! 🎉
                  </Badge>
                )}
                {isLoading && <p className="text-xs text-primary mt-2 animate-pulse">Syncing...</p>}
                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
              </div>
            </div>

            {/* Ice Mode Toggle */}
            <Card className="glass-card border-glass-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Snowflake className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">Ice Mode</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Cold water can boost metabolism!</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Switch 
                    checked={isIceMode} 
                    onCheckedChange={setIsIceMode}
                    className="data-[state=checked]:bg-blue-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Add Buttons */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Quick Add</h3>
              <div className="grid grid-cols-3 gap-3">
                {quickAddAmounts.map((item) => (
                  <Button
                    key={item.amount}
                    variant="outline"
                    className="glass-card h-16 flex-col space-y-1 glow"
                    onClick={() => handleAddWater(item.amount)}
                    disabled={isLoading}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-xs">{item.amount}ml</span>
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Custom Amount</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(parseInt(e.target.value) || 0)}
                    className="glass-card border-glass-border text-center w-full"
                    placeholder="250"
                  />
                  <span className="text-sm text-muted-foreground">ml</span>
                  <Button 
                    onClick={incrementCustomAmount}
                    className="glow-accent"
                    disabled={customAmount >= 1500}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Hydration Benefits */}
            <Card className="glass-card border-glass-border glow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <Heart className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-accent mb-1">Did you know?</h4>
                    <p className="text-xs text-muted-foreground">{currentBenefit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reminder Settings */}
            <Card className="glass-card border-glass-border">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Hydration Reminders</span>
                    </div>
                    <Switch 
                      checked={reminderEnabled} 
                      onCheckedChange={setReminderEnabled}
                    />
                  </div>
                  
                  {reminderEnabled && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Every {reminderInterval} hours</span>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Setup
                        </Button>
                      </div>
                      <Slider
                        value={[reminderInterval]}
                        onValueChange={(value) => setReminderInterval(value[0])}
                        max={6}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hydration Streak */}
            <div className="text-center">
              <Badge variant="outline" className="glass glow">
                <Zap className="w-3 h-3 mr-1" />
                7-day hydration streak! 🔥
              </Badge>
            </div>
            <div className="pt-4">
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                
                onClick={() => navigate("/daily-log")} // <-- Use React Router navigation
              >
                <Droplet className="w-5 h-5 mr-2" />
                Update Water Log
              </Button>
            </div>

            {/* Main Log Water Button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="w-full glow-accent"
                onClick={() => handleAddWater(customAmount)}
                disabled={customAmount <= 0 || isLoading}
              >
                {isLoading ? (
                  "Logging..."
                ) : (
                  <>
                    <Droplet className="w-5 h-5 mr-2" />
                    Log {customAmount}ml Water
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </TooltipProvider>
    </Dialog>
  );
}