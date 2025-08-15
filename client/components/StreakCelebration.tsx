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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-enhanced border-glass-border max-w-md mx-auto overflow-hidden modal-content">
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
            className="absolute top-4 right-4 h-8 w-8 p-0 z-10"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        <div className="space-y-6 p-2">
          {/* Main Celebration */}
          <div className="text-center space-y-4">
            {/* Avatar Animation */}
            <div className="relative mx-auto w-24 h-24 mb-4">
              <div
                className={cn(
                  "w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold text-white shadow-lg",
                  avatarAnimation === "celebrate" && "animate-bounce-soft",
                )}
              >
                🎉
              </div>

              {/* High-five animation effect */}
              <div
                className={cn(
                  "absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center transform transition-all duration-500",
                  avatarAnimation === "celebrate"
                    ? "scale-110 animate-pulse"
                    : "scale-0",
                )}
              >
                ✋
              </div>
            </div>

            {/* Streak Number */}
            <div className="space-y-2">
              <div className="text-6xl font-bold text-primary animate-glow-pulse">
                {streakData.currentStreak}
              </div>
              <div className="text-xl font-semibold flex items-center justify-center space-x-2">
                <Flame className="w-6 h-6 text-orange-400 animate-glow" />
                <span>Day Streak!</span>
                <Flame className="w-6 h-6 text-orange-400 animate-glow" />
              </div>
              <p className="text-lg font-medium text-accent">
                {getStreakMessage()}
              </p>
            </div>

            {/* Motivational Quote */}
            <Card className="glass-card border-glass-border glow-accent">
              <CardContent className="p-4 text-center">
                <Sparkles className="w-5 h-5 text-yellow-400 mx-auto mb-2 animate-pulse" />
                <p className="text-sm font-medium text-shimmer">
                  {getMotivationalQuote()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Streak Stats */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">
              This Streak Journey
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <Card className="glass-card border-glass-border hover:glow-accent transition-all duration-300">
                <CardContent className="p-3 text-center">
                  <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2 animate-glow" />
                  <div className="text-lg font-bold">
                    {streakData.longestStreak}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Longest Streak
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-glass-border hover:glow-accent transition-all duration-300">
                <CardContent className="p-3 text-center">
                  <Zap className="w-6 h-6 text-orange-400 mx-auto mb-2 animate-glow-pulse" />
                  <div className="text-lg font-bold">
                    {streakData.caloriesBurned.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Calories Burned
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-glass-border hover:glow-accent transition-all duration-300">
                <CardContent className="p-3 text-center">
                  <Target className="w-6 h-6 text-green-400 mx-auto mb-2 animate-glow" />
                  <div className="text-lg font-bold">
                    {streakData.mealsLogged}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Meals Logged
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-glass-border hover:glow-accent transition-all duration-300">
                <CardContent className="p-3 text-center">
                  <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2 animate-glow-pulse" />
                  <div className="text-lg font-bold">
                    {streakData.workoutsCompleted}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Workouts Done
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-center text-muted-foreground">
              Recent Achievements
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {streakData.currentStreak >= 7 && (
                <Badge
                  variant="outline"
                  className="glass text-xs animate-scale-in"
                  style={{ animationDelay: "200ms" }}
                >
                  🔥 Week Warrior
                </Badge>
              )}
              {streakData.currentStreak >= 14 && (
                <Badge
                  variant="outline"
                  className="glass text-xs animate-scale-in"
                  style={{ animationDelay: "400ms" }}
                >
                  ⚡ Consistency King
                </Badge>
              )}
              {streakData.mealsLogged >= 50 && (
                <Badge
                  variant="outline"
                  className="glass text-xs animate-scale-in"
                  style={{ animationDelay: "600ms" }}
                >
                  🍽️ Nutrition Master
                </Badge>
              )}
              {streakData.workoutsCompleted >= 10 && (
                <Badge
                  variant="outline"
                  className="glass text-xs animate-scale-in"
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
              className="w-full glow-accent hover:scale-105 transition-all duration-300 btn-glow-effect"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Keep the Streak Going!
            </Button>
          )}

          {/* Auto-close indicator for launch celebration */}
          {isLaunchCelebration && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Tap anywhere to dismiss
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
