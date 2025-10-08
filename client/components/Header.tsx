import React, { useState } from "react";
import { AnimatedLogo } from "./AnimatedLogo";
import { EditStatsModal } from "./EditStatsModal";
import { StreakCelebration } from "./StreakCelebration";
import { ThemeToggler } from "./ThemeToggler";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Flame,
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Target,
  Trophy,
  Activity,
  Heart,
  Scale,
  Ruler,
  Edit,
  Camera,
  ScanLine,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserStats {
  currentWeight: number;
  goalWeight: number;
  height: number;
  age: number;
  bodyFat: number;
  muscleMass: number;
}

interface HeaderProps {
  userName?: string;
  streakDays?: number;
  onScanMeal?: () => void;
  onLogout?: () => void;
}

export function Header({
  userName = "Alex",
  streakDays = 12,
  onScanMeal,
  onLogout,
}: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showEditStats, setShowEditStats] = useState(false);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);

  // Mock user data - in real app this would come from props or context
  const [userStats, setUserStats] = useState<UserStats>({
    currentWeight: 75.2,
    goalWeight: 70,
    height: 175,
    age: 28,
    bodyFat: 15,
    muscleMass: 65,
  });

  const weeklyGoal = "Lose 0.5kg/week";

  // Calculate BMI
  const calculateBMI = (weight: number, height: number) => {
    if (weight > 0 && height > 0) {
      return (weight / Math.pow(height / 100, 2)).toFixed(1);
    }
    return "0.0";
  };

  const healthMetrics = [
    {
      label: "BMI",
      value: calculateBMI(userStats.currentWeight, userStats.height),
      status: "Normal",
      icon: Activity,
    },
    {
      label: "Body Fat",
      value: `${userStats.bodyFat}%`,
      status: "Athletic",
      icon: Target,
    },
    {
      label: "Muscle Mass",
      value: `${userStats.muscleMass}kg`,
      status: "Good",
      icon: Trophy,
    },
  ];

  const handleStatsUpdate = (newStats: UserStats) => {
    setUserStats(newStats);
    // In real app, would save to backend/context
  };

  // Mock streak data - in real app would come from props or context
  const streakStats = {
    currentStreak: streakDays,
    longestStreak: Math.max(streakDays, 15),
    caloriesBurned: streakDays * 450,
    mealsLogged: streakDays * 3 + 5,
    workoutsCompleted: Math.floor(streakDays * 0.8),
  };

  const handleStreakClick = () => {
    setShowStreakCelebration(true);
  };

  return (
    <>
      {/* Header */}
      <header className="glass-enhanced mx-1 sm:mx-4 mt-4 p-4 sm:p-6 rounded-2xl border border-glass-border glow-intense animate-slide-from-bottom">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Profile Avatar/Button */}
            <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto btn-glow-effect ripple-effect animate-bounce-soft"
                  style={{ animationDelay: "200ms" }}
                >
                  <Avatar className="h-8 w-8 border-2 border-primary/30 glow-accent animate-float">
                    <AvatarImage src="/placeholder.svg" alt={userName} />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </SheetTrigger>

              {/* Profile Drawer */}
              <SheetContent
                side="left"
                className="w-80 p-0 glass-enhanced border-glass-border glow-intense modal-content"
                style={{
                  background: "rgba(0, 40, 51, 0.95)",
                  backdropFilter: "blur(25px)",
                }}
              >
                <div className="h-full flex flex-col overflow-y-auto">
                  {/* Profile Header */}
                  <div className="p-6 border-b border-glass-border">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16 border-2 border-primary/30 glow-accent">
                        <AvatarImage src="/placeholder.svg" alt={userName} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                          {userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">
                          {userName}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Fitness Enthusiast
                        </p>
                        <Badge
                          variant="secondary"
                          className="mt-2 glass glow-accent text-xs"
                        >
                          <Flame className="w-3 h-3 mr-1 animate-glow" />
                          {streakDays} day streak
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* User Stats */}
                  <div className="p-6 border-b border-glass-border">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Current Stats
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs hover:glow-accent transition-all duration-300"
                        onClick={() => setShowEditStats(true)}>
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass-card p-3 rounded-lg border border-glass-border glow-accent">
                        <div className="flex items-center space-x-2 mb-2">
                          <Scale className="w-4 h-4 text-primary animate-glow" />
                          <span className="text-xs text-muted-foreground">
                            Weight
                          </span>
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {userStats.currentWeight}kg
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Goal: {userStats.goalWeight}kg
                        </div>
                      </div>
                      <div className="glass-card p-3 rounded-lg border border-glass-border glow">
                        <div className="flex items-center space-x-2 mb-2">
                          <Ruler className="w-4 h-4 text-accent animate-glow-pulse" />
                          <span className="text-xs text-muted-foreground">
                            Height
                          </span>
                        </div>
                        <div className="text-lg font-bold text-accent">
                          {userStats.height}cm
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Age: {userStats.age}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Health Metrics */}
                  <div className="p-6 border-b border-glass-border">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                      Health Metrics
                    </h3>
                    <div className="space-y-3">
                      {healthMetrics.map((metric, index) => {
                        const Icon = metric.icon;
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className="w-4 h-4 text-primary animate-glow" />
                              <span className="text-sm">{metric.label}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold">
                                {metric.value}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {metric.status}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Current Goal */}
                  <div className="p-6 border-b border-glass-border">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                      Current Goal
                    </h3>
                    <div className="glass-card p-4 rounded-lg border border-glass-border glow-accent">
                      <div className="flex items-center space-x-3">
                        <Heart className="w-5 h-5 text-red-400 animate-glow-pulse" />
                        <div>
                          <div className="text-sm font-semibold text-foreground">
                            {weeklyGoal}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Weekly target
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-1 p-6">
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:glow-accent transition-all duration-300"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Account Settings
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:glow transition-all duration-300"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Bell className="w-4 h-4 mr-3" />
                        Notifications
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:glow-accent transition-all duration-300"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Shield className="w-4 h-4 mr-3" />
                        Privacy & Security
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:glow transition-all duration-300"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <HelpCircle className="w-4 h-4 mr-3" />
                        Help & Support
                      </Button>

                      <Separator className="my-4 bg-glass-border" />

                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                        onClick={() => {
                          setIsProfileOpen(false);
                          onLogout?.();
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Edit Stats Modal */}
            <EditStatsModal
              open={showEditStats}
              onOpenChange={setShowEditStats}
              initialStats={userStats}
              onSave={handleStatsUpdate}
            />

            {/* Streak Celebration Modal */}
            <StreakCelebration
              open={showStreakCelebration}
              onOpenChange={setShowStreakCelebration}
              streakData={streakStats}
              isLaunchCelebration={false}
            />

            {/* Logo */}
            <div
              className="animate-fade-in-delayed"
              style={{ animationDelay: "400ms" }}
            >
              <AnimatedLogo
                className="text-2xl sm:text-3xl text-shimmer"
                showStartupAnimation={false}
              />
              <p
                className="text-sm sm:text-base text-muted-foreground mt-1 animate-slide-from-left"
                style={{ animationDelay: "600ms" }}
              >
                Welcome back, {userName}!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Theme Toggler */}
            <ThemeToggler />
            
            {/* Scan Button */}
            {onScanMeal && (
              <Button
                variant="ghost"
                size="sm"
                className="btn-glow-effect ripple-effect animate-bounce-soft"
                onClick={onScanMeal}
                style={{ animationDelay: "100ms" }}
              >
                <div className="relative">
                  <Camera className="w-5 h-5 text-accent animate-glow" />
                  <ScanLine className="w-3 h-3 absolute -top-1 -right-1 text-primary animate-pulse" />
                </div>
              </Button>
            )}

            <Badge
              variant="secondary"
              className="glass glow-accent text-xs sm:text-sm animate-glow-pulse cursor-pointer hover:scale-105 transition-all duration-300 btn-glow-effect"
              onClick={handleStreakClick}
            >
              <Flame className="w-3 h-3 mr-1 animate-glow" />
              <span className="hidden xs:inline">Streak: </span>
              {streakDays}d
            </Badge>
          </div>
        </div>
      </header>
    </>
  );
}
