import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  User,
  Target,
  Trophy,
  Settings,
  Heart,
  Scale,
  Ruler,
  Calendar,
  ChevronRight,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    // Add a small delay for visual feedback
    setTimeout(() => {
      navigate(path);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl border border-glass-border mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="w-20 h-20 glow">
            <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
              AJ
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Alex Johnson</h1>
            <p className="text-muted-foreground">@alexfitness</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary" className="glass">
                <Trophy className="w-3 h-3 mr-1" />
                Advanced
              </Badge>
              <Badge variant="outline" className="glass-card">
                <Heart className="w-3 h-3 mr-1" />
                12 Day Streak
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="glass-card p-3 rounded-lg">
            <div className="text-lg font-bold text-primary">2.2k</div>
            <div className="text-xs text-muted-foreground">Calories Logged</div>
          </div>
          <div className="glass-card p-3 rounded-lg">
            <div className="text-lg font-bold text-accent">156</div>
            <div className="text-xs text-muted-foreground">Workouts</div>
          </div>
          <div className="glass-card p-3 rounded-lg">
            <div className="text-lg font-bold text-purple-400">89%</div>
            <div className="text-xs text-muted-foreground">Goal Rate</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="glass-card border-glass-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Scale className="w-8 h-8 text-primary" />
              <div>
                <div className="text-lg font-bold">68.5 kg</div>
                <div className="text-sm text-muted-foreground">
                  Current Weight
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-glass-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Ruler className="w-8 h-8 text-accent" />
              <div>
                <div className="text-lg font-bold">175 cm</div>
                <div className="text-sm text-muted-foreground">Height</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals */}
      <Card className="glass-card border-glass-border mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-primary" />
            Current Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Daily Calories</span>
              <span className="font-medium">2,200 kcal</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Target Weight</span>
              <span className="font-medium">65 kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Weekly Workouts</span>
              <span className="font-medium">4 sessions</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Daily Water</span>
              <span className="font-medium">8 glasses</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Actions */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full glass-card justify-between h-12 hover:glow-accent transition-all duration-300 group"
          onClick={() => handleNavigation("/settings")}
        >
          <div className="flex items-center">
            <Settings className="w-5 h-5 mr-3 text-primary" />
            Settings & Preferences
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Button>

        <Button
          variant="outline"
          className="w-full glass-card justify-between h-12 hover:glow-accent transition-all duration-300 group"
          onClick={() => handleNavigation("/meal-planning")}
        >
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-3 text-accent" />
            Meal Planning
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
        </Button>

        <Button
          variant="outline"
          className="w-full glass-card justify-between h-12 hover:glow-accent transition-all duration-300 group"
          onClick={() => handleNavigation("/account-info")}
        >
          <div className="flex items-center">
            <User className="w-5 h-5 mr-3 text-purple-400" />
            Account Information
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-400 transition-colors" />
        </Button>

        <Button
          variant="outline"
          className="w-full glass-card justify-between h-12 hover:glow-accent transition-all duration-300 group"
          onClick={() => handleNavigation("/progress-tracking")}
        >
          <div className="flex items-center">
            <Trophy className="w-5 h-5 mr-3 text-yellow-500" />
            Progress & Achievements
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
        </Button>

        <Button
          variant="outline"
          className="w-full glass-card justify-between h-12 hover:glow-accent transition-all duration-300 group"
          onClick={() => handleNavigation("/fitness-goals")}
        >
          <div className="flex items-center">
            <Target className="w-5 h-5 mr-3 text-green-500" />
            Fitness Goals
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-green-500 transition-colors" />
        </Button>

        <Button
          variant="outline"
          className="w-full glass-card justify-between h-12 hover:glow-accent transition-all duration-300 group"
          onClick={() => handleNavigation("/health-metrics")}
        >
          <div className="flex items-center">
            <Heart className="w-5 h-5 mr-3 text-red-500" />
            Health Metrics
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
        </Button>
      </div>
    </div>
  );
}
