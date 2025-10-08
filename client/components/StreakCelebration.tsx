import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Flame,
  Trophy,
  Zap,
  Target,
  Calendar,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  caloriesBurned: number;
  mealsLogged: number;
  workoutsCompleted: number;
}

interface StreakCelebrationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  streakData: StreakStats;
  isLaunchCelebration?: boolean;
}

export function StreakCelebration({
  open,
  onOpenChange,
  streakData,
  isLaunchCelebration = false,
}: StreakCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [avatarAnimation, setAvatarAnimation] = useState("idle");

  useEffect(() => {
    if (open) {
      setShowConfetti(true);
      setAvatarAnimation("celebrate");

      // Auto-close after 5 seconds if it's a launch celebration
      if (isLaunchCelebration) {
        const timer = setTimeout(() => {
          onOpenChange(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [open, isLaunchCelebration, onOpenChange]);

  const getStreakMessage = () => {
    const streak = streakData.currentStreak;
    if (streak === 1) return "Great start! 🌟";
    if (streak < 7) return "Building momentum! 💪";
    if (streak < 14) return "You're on fire! 🔥";
    if (streak < 30) return "Absolutely crushing it! ⚡";
    return "You're a legend! 👑";
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "Consistency is power. Let's go! 💯",
      "Every day is a new victory! 🏆",
      "Your dedication is inspiring! ✨",
      "Building habits that last! 🎯",
      "Progress over perfection! 🚀",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  // Create confetti particles
  const ConfettiParticle = ({ delay = 0 }: { delay?: number }) => (
    <div
      className="absolute w-2 h-2 rounded-full animate-bounce"
      style={{
        backgroundColor: [
          "#00BFFF",
          "#FFC107",
          "#FF6B6B",
          "#10B981",
          "#8B5CF6",
        ][Math.floor(Math.random() * 5)],
        left: `${Math.random() * 100}%`,
        animationDelay: `${delay}ms`,
        animationDuration: `${800 + Math.random() * 400}ms`,
      }}
    />
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="glass-enhanced border-glass-border max-w-2xl w-[95vw] h-[70vh] mx-auto overflow-hidden flex flex-col modal-content">
        <DialogHeader>
          <DialogTitle className="sr-only">Streak Celebration</DialogTitle>
        </DialogHeader>

        {/* Confetti Effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <ConfettiParticle key={i} delay={i * 100} />
            ))}
          </div>
        )}

        {/* Close button for manual celebrations */}
        {!isLaunchCelebration && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 z-10"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        <div className="flex-1 flex flex-col justify-center space-y-3 px-4 py-2">
          {/* Main Celebration */}
          <div className="flex items-center justify-between gap-6">
            {/* Left: Avatar and Streak Number */}
            <div className="flex items-center gap-4">
              {/* Avatar Animation */}
              <div className="relative w-16 h-16 flex-shrink-0">
                <div
                  className={cn(
                    "w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white shadow-lg",
                    avatarAnimation === "celebrate" && "animate-bounce-soft",
                  )}
                >
                  🎉
                </div>

                {/* High-five animation effect */}
                <div
                  className={cn(
                    "absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center transform transition-all duration-500 text-xs",
                    avatarAnimation === "celebrate"
                      ? "scale-110 animate-pulse"
                      : "scale-0",
                  )}
                >
                  ✋
                </div>
              </div>

              {/* Streak Number */}
              <div className="text-left">
                <div className="text-4xl font-bold text-primary animate-glow-pulse">
                  {streakData.currentStreak}
                </div>
                <div className="text-base font-semibold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400 animate-glow" />
                  <span>Day Streak!</span>
                </div>
              </div>
            </div>

            {/* Right: Motivational Quote */}
            <Card className="glass-card border-glass-border glow-accent flex-1">
              <CardContent className="p-3">
                <Sparkles className="w-4 h-4 text-yellow-400 mb-1 animate-pulse" />
                <p className="text-sm font-medium text-accent">
                  {getStreakMessage()}
                </p>
                <p className="text-xs text-shimmer mt-1">
                  {getMotivationalQuote()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Streak Stats */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-center">
              This Streak Journey
            </h3>

            <div className="grid grid-cols-4 gap-2">
              <Card className="glass-card border-glass-border hover:glow-accent transition-all duration-300">
                <CardContent className="p-2 text-center">
                  <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-0.5 animate-glow" />
                  <div className="text-sm font-bold">
                    {streakData.longestStreak}
                  </div>
                  <div className="text-[9px] text-muted-foreground leading-tight">
                    Longest
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-glass-border hover:glow-accent transition-all duration-300">
                <CardContent className="p-2 text-center">
                  <Zap className="w-5 h-5 text-orange-400 mx-auto mb-0.5 animate-glow-pulse" />
                  <div className="text-sm font-bold">
                    {(streakData.caloriesBurned / 1000).toFixed(1)}k
                  </div>
                  <div className="text-[9px] text-muted-foreground leading-tight">
                    Calories
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-glass-border hover:glow-accent transition-all duration-300">
                <CardContent className="p-2 text-center">
                  <Target className="w-5 h-5 text-green-400 mx-auto mb-0.5 animate-glow" />
                  <div className="text-sm font-bold">
                    {streakData.mealsLogged}
                  </div>
                  <div className="text-[9px] text-muted-foreground leading-tight">
                    Meals
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-glass-border hover:glow-accent transition-all duration-300">
                <CardContent className="p-2 text-center">
                  <Calendar className="w-5 h-5 text-blue-400 mx-auto mb-0.5 animate-glow-pulse" />
                  <div className="text-sm font-bold">
                    {streakData.workoutsCompleted}
                  </div>
                  <div className="text-[9px] text-muted-foreground leading-tight">
                    Workouts
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-center text-muted-foreground">
              Recent Achievements
            </h4>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {streakData.currentStreak >= 7 && (
                <Badge
                  variant="outline"
                  className="glass text-[10px] px-2 py-0.5 animate-scale-in"
                  style={{ animationDelay: "200ms" }}
                >
                  🔥 Week Warrior
                </Badge>
              )}
              {streakData.currentStreak >= 14 && (
                <Badge
                  variant="outline"
                  className="glass text-[10px] px-2 py-0.5 animate-scale-in"
                  style={{ animationDelay: "400ms" }}
                >
                  ⚡ Consistency King
                </Badge>
              )}
              {streakData.mealsLogged >= 50 && (
                <Badge
                  variant="outline"
                  className="glass text-[10px] px-2 py-0.5 animate-scale-in"
                  style={{ animationDelay: "600ms" }}
                >
                  🍽️ Nutrition Master
                </Badge>
              )}
              {streakData.workoutsCompleted >= 10 && (
                <Badge
                  variant="outline"
                  className="glass text-[10px] px-2 py-0.5 animate-scale-in"
                  style={{ animationDelay: "800ms" }}
                >
                  💪 Fitness Champion
                </Badge>
              )}
            </div>
          </div>

          {/* Action Button */}
          {!isLaunchCelebration && (
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full glow-accent hover:scale-105 transition-all duration-300 btn-glow-effect py-2"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Keep the Streak Going!
            </Button>
          )}

          {/* Auto-close indicator for launch celebration */}
          {isLaunchCelebration && (
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground">
                Tap anywhere to dismiss
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
