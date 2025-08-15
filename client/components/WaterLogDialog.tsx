import { useState, useEffect } from "react";
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

interface WaterLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIntake: number;
  goal: number;
  onWaterAdded: (amount: number, isIce?: boolean) => void;
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
  currentIntake, 
  goal, 
  onWaterAdded 
}: WaterLogDialogProps) {
  const [customAmount, setCustomAmount] = useState(250);
  const [isIceMode, setIsIceMode] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderInterval, setReminderInterval] = useState(2);
  const [currentBenefit] = useState(
    hydrationBenefits[Math.floor(Math.random() * hydrationBenefits.length)]
  );

  const progress = goal > 0 ? Math.min((currentIntake / goal) * 100, 100) : 0;
  const isGoalReached = currentIntake >= goal;

  useEffect(() => {
    if (isGoalReached && !showCelebration) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isGoalReached, showCelebration]);

  const handleAddWater = (amount: number) => {
    onWaterAdded(amount, isIceMode);
  };

  const WaterBottleAnimation = () => {
    const bottleHeight = 200;
    const fillHeight = (progress / 100) * (bottleHeight - 40); // Account for bottle cap

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
                {(currentIntake / 1000).toFixed(1)}L
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
        {/* This style tag adds custom scrollbar styles.
          The 'custom-scrollbar' class is then applied to DialogContent.
        */}
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
                  {(currentIntake / 1000).toFixed(1)}L of {(goal / 1000).toFixed(1)}L
                </p>
                {isGoalReached && (
                  <Badge className="mt-2 glow-accent animate-pulse">
                    <Trophy className="w-3 h-3 mr-1" />
                    Goal Reached! 🎉
                  </Badge>
                )}
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
                </div>

                {/* Slider for custom amount */}
                <div className="space-y-2">
                  <Slider
                    value={[customAmount]}
                    onValueChange={(value) => setCustomAmount(value[0])}
                    max={1500}
                    min={50}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>50ml</span>
                    <span>{customAmount}ml</span>
                    <span>1500ml</span>
                  </div>
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

            {/* Main Log Water Button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="w-full glow-accent"
                onClick={() => handleAddWater(customAmount)}
                disabled={customAmount <= 0}
              >
                <Droplet className="w-5 h-5 mr-2" />
                Log {customAmount}ml Water
              </Button>
            </div>
          </div>
        </DialogContent>
      </TooltipProvider>
    </Dialog>
  );
}
