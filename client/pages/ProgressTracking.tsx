import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Trophy,
  Star,
  Award,
  Target,
  TrendingUp,
  Calendar,
  Flame,
  Zap,
  Medal,
  Crown,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, subDays } from "date-fns";

export default function ProgressTracking() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const achievements = [
    {
      id: "first-workout",
      title: "First Steps",
      description: "Complete your first workout",
      icon: Trophy,
      color: "text-yellow-500",
      earned: true,
      earnedDate: "2024-01-15",
      xp: 50,
    },
    {
      id: "week-streak",
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: Flame,
      color: "text-orange-500",
      earned: true,
      earnedDate: "2024-01-22",
      xp: 100,
    },
    {
      id: "calorie-master",
      title: "Calorie Master",
      description: "Log 1000 calories accurately",
      icon: Target,
      color: "text-blue-500",
      earned: true,
      earnedDate: "2024-01-28",
      xp: 75,
    },
    {
      id: "month-champion",
      title: "Month Champion",
      description: "Complete 30 days of tracking",
      icon: Crown,
      color: "text-purple-500",
      earned: false,
      progress: 23,
      total: 30,
      xp: 250,
    },
    {
      id: "strength-legend",
      title: "Strength Legend",
      description: "Lift 10,000kg total volume",
      icon: Medal,
      color: "text-red-500",
      earned: false,
      progress: 7500,
      total: 10000,
      xp: 200,
    },
    {
      id: "hydration-hero",
      title: "Hydration Hero",
      description: "Drink 8 glasses for 14 days straight",
      icon: Zap,
      color: "text-cyan-500",
      earned: false,
      progress: 9,
      total: 14,
      xp: 150,
    },
  ];

  const milestones = [
    {
      title: "100 Workouts Completed",
      progress: 87,
      total: 100,
      reward: "Premium Badge",
      color: "bg-gradient-to-r from-blue-500 to-purple-500",
    },
    {
      title: "50kg Weight Lost/Gained",
      progress: 12.5,
      total: 50,
      reward: "Transformation Master",
      color: "bg-gradient-to-r from-green-500 to-teal-500",
    },
    {
      title: "365 Day Streak",
      progress: 45,
      total: 365,
      reward: "Consistency Crown",
      color: "bg-gradient-to-r from-yellow-500 to-orange-500",
    },
  ];

  const weeklyProgress = [
    { day: "Mon", workouts: 1, calories: 2100, water: 8 },
    { day: "Tue", workouts: 1, calories: 1950, water: 7 },
    { day: "Wed", workouts: 0, calories: 2200, water: 6 },
    { day: "Thu", workouts: 1, calories: 2050, water: 8 },
    { day: "Fri", workouts: 1, calories: 1900, water: 9 },
    { day: "Sat", workouts: 2, calories: 2300, water: 7 },
    { day: "Sun", workouts: 1, calories: 2150, water: 8 },
  ];

  const stats = {
    totalXP: 1850,
    level: 12,
    nextLevelXP: 2000,
    achievementsEarned: achievements.filter((a) => a.earned).length,
    totalAchievements: achievements.length,
    currentStreak: 12,
    longestStreak: 23,
  };

  const AchievementCard = ({ achievement }: { achievement: any }) => {
    const Icon = achievement.icon;
    const isEarned = achievement.earned;
    const progressPercentage = achievement.progress
      ? (achievement.progress / achievement.total) * 100
      : 0;

    return (
      <Card
        className={`glass-card border-glass-border transition-all duration-300 ${
          isEarned ? "glow-accent" : "opacity-75"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-lg ${isEarned ? "bg-primary/20" : "bg-muted/20"}`}
            >
              <Icon
                className={`w-6 h-6 ${isEarned ? achievement.color : "text-muted-foreground"}`}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4
                  className={`font-semibold ${isEarned ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {achievement.title}
                </h4>
                {isEarned ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {achievement.description}
              </p>

              {isEarned ? (
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="glass text-xs">
                    <Star className="w-3 h-3 mr-1" />+{achievement.xp} XP
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(achievement.earnedDate), "MMM d")}
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {achievement.progress?.toLocaleString()} /{" "}
                      {achievement.total?.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/profile")}
          className="h-10 w-10 p-0 glass-card"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-primary" />
            Progress & Achievements
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your fitness journey
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Level & XP Card */}
        <Card className="glass-card border-glass-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Level {stats.level}</h3>
                <p className="text-sm text-muted-foreground">
                  {stats.nextLevelXP - stats.totalXP} XP to next level
                </p>
              </div>
              <Badge variant="secondary" className="glass text-primary">
                <Star className="w-3 h-3 mr-1" />
                {stats.totalXP.toLocaleString()} XP
              </Badge>
            </div>
            <Progress
              value={(stats.totalXP / stats.nextLevelXP) * 100}
              className="h-3 mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{stats.totalXP}</span>
              <span>{stats.nextLevelXP}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card border-glass-border">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-lg font-bold">
                {stats.achievementsEarned}/{stats.totalAchievements}
              </div>
              <div className="text-xs text-muted-foreground">Achievements</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border">
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-lg font-bold">{stats.currentStreak}</div>
              <div className="text-xs text-muted-foreground">
                Current Streak
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-lg font-bold">{stats.longestStreak}</div>
              <div className="text-xs text-muted-foreground">
                Longest Streak
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-lg font-bold">89%</div>
              <div className="text-xs text-muted-foreground">Goal Rate</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="achievements" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 glass-card">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="progress">Weekly Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid gap-4">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4">
            {milestones.map((milestone, index) => (
              <Card key={index} className="glass-card border-glass-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">{milestone.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Reward: {milestone.reward}
                      </p>
                    </div>
                    <Badge variant="outline" className="glass">
                      {milestone.progress}/{milestone.total}
                    </Badge>
                  </div>
                  <Progress
                    value={(milestone.progress / milestone.total) * 100}
                    className="h-3"
                  />
                  <div className="mt-2 text-xs text-muted-foreground">
                    {Math.round((milestone.progress / milestone.total) * 100)}%
                    Complete
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card className="glass-card border-glass-border">
              <CardHeader>
                <CardTitle>This Week's Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyProgress.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 glass-card rounded-lg"
                    >
                      <div className="font-medium">{day.day}</div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Award className="w-4 h-4 mr-1 text-primary" />
                          {day.workouts}
                        </div>
                        <div className="flex items-center">
                          <Flame className="w-4 h-4 mr-1 text-orange-500" />
                          {day.calories}
                        </div>
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 mr-1 text-blue-500" />
                          {day.water}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
