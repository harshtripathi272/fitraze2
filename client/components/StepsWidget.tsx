import React, { useState,useEffect} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "./ProgressRing";
import { 
  Activity, 
  Target, 
  Flame,
  MapPin,
  Clock,
  TrendingUp,
  Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";


interface StepsWidgetProps {
  className?: string;
}

export function StepsWidget({ className }: StepsWidgetProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [stepData, setStepData]=useState<any | null>(null);

  
  useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const accessTokenFromURL = params.get("access_token");

      if (accessTokenFromURL) {
        localStorage.setItem("access_token", accessTokenFromURL);
        window.history.replaceState({}, document.title, window.location.pathname); // clean URL
      }

      const token = accessTokenFromURL || localStorage.getItem("access_token");
      if (!token) return;

      const fetchData = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/fit/summary?access_token=${token}`);
          setStepData(res.data);
          setIsConnected(true);
        } catch (err) {
          console.error("Error fetching step data:", err);
          setStepData(null);
          setIsConnected(false);
        }
     };

    fetchData();
  }, []);
  
  const steps = stepData?.steps ?? 0;
  const goal = stepData?.goal ?? 0;
  const calories = stepData?.calories ?? 0;
  const distance = stepData?.distance ?? 0;

  const progress = goal > 0 ? Math.min((steps / goal) * 100, 100) : 0;

  const handleConnect = () => {
    window.location.href = "http://localhost:8000/auth/google";
  };

  // Running character animation positions
  const getRunnerPosition = () => {
    const progressPercent = Math.min(progress, 100);
    return `${progressPercent}%`;
  };
  

  return (
  <Card className={cn("glass-card border-glass-border glow-accent", className)}>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center text-base sm:text-lg">
        <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-accent animate-glow" />
        Today's Steps
      </CardTitle>
    </CardHeader>
    <CardContent>
      {!isConnected || !stepData ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted/20 flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h4 className="font-medium mb-2">Track Your Steps</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Connect Google Fit to see your daily step count and activity
            </p>
            <Button
              onClick={handleConnect}
              className="w-full btn-glow-effect"
              variant="outline"
            >
              <Activity className="w-4 h-4 mr-2" />
              Connect Google Fit
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Main Stats */}
          <div className="flex items-center justify-between">
            <ProgressRing
              progress={progress}
              size={90}
              color="accent"
              className="glow-accent"
            >
              <div className="text-center">
                <div className="text-lg font-bold text-accent">
                  {(stepData.steps ?? 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">steps</div>
              </div>
            </ProgressRing>

            <div className="flex-1 ml-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Goal:</span>
                <span className="font-medium">{(goal ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining:</span>
                <span className="font-medium text-primary">
                  {Math.max((goal ?? 0) - (stepData.steps ?? 0), 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <Badge variant="outline" className="glass text-xs">
                  {Math.round(progress)}%
                </Badge>
              </div>
            </div>
          </div>

          {/* Running Track */}
          <div className="relative">
            <div className="h-8 bg-muted/20 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-muted/10 to-muted/30"></div>

              <div
                className="h-full bg-gradient-to-r from-accent to-primary progress-fill"
                style={
                  { "--progress-width": `${Math.min(progress, 100)}%` } as React.CSSProperties
                }
              />

              <div
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
                style={{
                  left: getRunnerPosition(),
                  transform: "translateY(-50%) translateX(-50%)",
                }}
              >
                <div className="w-6 h-6 flex items-center justify-center text-lg animate-bounce">
                  🏃‍♂️
                </div>
              </div>

              <div className="absolute top-1/2 right-2 -translate-y-1/2">
                <div className="text-sm">🏁</div>
              </div>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>0</span>
              <span>{Math.round((goal ?? 0) / 2).toLocaleString()}</span>
              <span>{(goal ?? 0).toLocaleString()}</span>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Flame className="w-4 h-4 text-orange-400 animate-glow" />
              </div>
              <div className="text-sm font-bold">{stepData.calories ?? 0}</div>
              <div className="text-xs text-muted-foreground">calories</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <MapPin className="w-4 h-4 text-green-400 animate-glow-pulse" />
              </div>
              <div className="text-sm font-bold">{stepData.distance ?? 0} km</div>
              <div className="text-xs text-muted-foreground">distance</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="w-4 h-4 text-blue-400 animate-glow" />
              </div>
              <div className="text-sm font-bold">{stepData.activeMinutes ?? 0}m</div>
              <div className="text-xs text-muted-foreground">active</div>
            </div>
          </div>

          {/* Goal Achieved */}
          {progress >= 100 && (
            <div className="glass-card p-3 rounded-lg border border-glass-border glow animate-scale-in">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-400 animate-glow" />
                <span className="text-sm font-medium text-green-400">
                  Goal Achieved! 🎉
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Great job! You've hit your daily step goal.
              </p>
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {(stepData.steps ?? 0) >= 5000 && (
              <Badge variant="outline" className="glass text-xs animate-scale-in">
                🚶 5K Steps
              </Badge>
            )}
            {(stepData.steps ?? 0) >= 10000 && (
              <Badge variant="outline" className="glass text-xs animate-scale-in">
                🏃 10K Steps
              </Badge>
            )}
            {(stepData.floors ?? 0) >= 10 && (
              <Badge variant="outline" className="glass text-xs animate-scale-in">
                🏢 Climber
              </Badge>
            )}
            {(stepData.activeMinutes ?? 0) >= 60 && (
              <Badge variant="outline" className="glass text-xs animate-scale-in">
                ⏰ Active Hour
              </Badge>
            )}
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);
}
