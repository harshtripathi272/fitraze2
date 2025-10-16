import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { 
  TrendingUp, 
  Target, 
  Flame,
  Activity,
  Zap,
  Award
} from "lucide-react";
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = "http://localhost:8000/api/v1"; // Or your actual API URL

interface AnalyticsData {
  weekly_calories: { day: string; calories: number; goal: number }[];
  weekly_macros: {
    day: string;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  weight_progress: { week: string; weight: number }[];
}
interface JWTPayload{
  sub;string;
  exp:number;
}

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("calories");
  const [chartLoaded, setChartLoaded] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Suppress defaultProps warnings for Recharts on component mount
  useEffect(() => {
    const originalWarn = console.warn;
    const originalError = console.error;

    console.warn = (message, ...args) => {
      if (typeof message === 'string' &&
          (message.includes('defaultProps will be removed') ||
           message.includes('Support for defaultProps') ||
           message.includes('XAxis') ||
           message.includes('YAxis') ||
           message.includes('function components in a future major release'))) {
        return;
      }
      originalWarn(message, ...args);
    };

    console.error = (message, ...args) => {
      if (typeof message === 'string' &&
          (message.includes('defaultProps will be removed') ||
           message.includes('Support for defaultProps'))) {
        return;
      }
      originalError(message, ...args);
    };

    // Trigger chart animation
    const timer = setTimeout(() => setChartLoaded(true), 500);

    return () => {
      console.warn = originalWarn;
      console.error = originalError;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const token=localStorage.getItem("access_token");
        if(!token){
            setError("User not authenticated");
            return;
          
        }
        const response = await axios.get<AnalyticsData>(
          `${API_BASE_URL}/users/analytics`,
          {
            headers:{
              Authorization:`Bearer ${token}`,
            },
          }
        );
        setAnalyticsData(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch analytics data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Mock data for charts
  

  // Custom tooltip component
  const MacroTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const protein = payload.find((p: any) => p.dataKey === 'protein')?.value;
      const carbs = payload.find((p: any) => p.dataKey === 'carbs')?.value;
      const fat = payload.find((p: any) => p.dataKey === 'fat')?.value;

      // Motivational messages based on values
      const getMotivationalMessage = () => {
        if (protein >= 140) return "💪 You're consistently hitting protein goals!";
        if (carbs < 200) return "🍞 Carb intake dipped - try adjusting breakfast or pre-workout meals.";
        if (fat > 80) return "🥑 Great healthy fat intake for hormone production!";
        return "📊 Balanced macro intake for the day!";
      };

      return (
        <div className="glass-card p-3 border border-glass-border rounded-lg glow">
          <p className="font-medium text-sm mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-xs"><span style={{color: '#00BFFF'}}>●</span> Protein: {protein}g</p>
            <p className="text-xs"><span style={{color: '#FFC107'}}>●</span> Carbs: {carbs}g</p>
            <p className="text-xs"><span style={{color: '#FF6B6B'}}>●</span> Fat: {fat}g</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2 italic">{getMotivationalMessage()}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // This check prevents a crash if the API returns no data
  if (!analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No analytics data available.</p>
      </div>
    );
  }

  // --- 👇 (BONUS) CALCULATE DYNAMIC VALUES FOR SUMMARY CARDS ---
  const totalWeightLost = (analyticsData.weight_progress[0]?.weight - analyticsData.weight_progress[analyticsData.weight_progress.length - 1]?.weight).toFixed(1);
  const avgDailyCalories = (analyticsData.weekly_calories.reduce((sum, day) => sum + day.calories, 0) / analyticsData.weekly_calories.length).toFixed(0);
  const goalsHit = analyticsData.weekly_calories.filter(day => day.calories <= day.goal).length;


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-3 sm:p-4">
      {/* Header - Mobile Optimized */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl border border-glass-border mb-6 glow-intense">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 flex items-center">
          <Activity className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary animate-glow" />
          Analytics
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">Track your progress and insights</p>
        
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-primary">89%</div>
            <div className="text-xs text-muted-foreground">Avg Goal Hit</div>
          </div>
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-accent">-2.0kg</div>
            <div className="text-xs text-muted-foreground">Weight Lost</div>
          </div>
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-glow-tertiary">24</div>
            <div className="text-xs text-muted-foreground">Active Days</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 glass-card h-10 sm:h-12 glow">
          <TabsTrigger value="calories" className="text-xs sm:text-sm transition-all duration-300">Calories</TabsTrigger>
          <TabsTrigger value="macros" className="text-xs sm:text-sm transition-all duration-300">Macros</TabsTrigger>
          <TabsTrigger value="weight" className="text-xs sm:text-sm transition-all duration-300">Weight</TabsTrigger>
        </TabsList>

        <TabsContent value="calories" className="space-y-6 animate-slide-in-up">
          <Card className="glass-card border-glass-border glow">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary animate-glow" />
                Weekly Calorie Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.weekly_calories}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--glass-bg))',
                        border: '1px solid hsl(var(--glass-border))',
                        borderRadius: '8px',
                        backdropFilter: 'blur(20px)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="goal" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeDasharray="5 5"
                      dot={false}
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="calories" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5, filter: 'drop-shadow(0 0 6px hsl(var(--glow-primary)))' }}
                      animationBegin={0}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="glass-card border-glass-border glow hover:glow-intense transition-all duration-300">
              <CardContent className="p-3 sm:p-4 text-center">
                <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 animate-glow" />
                <div className="text-xl sm:text-2xl font-bold">2,180</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Avg Daily Calories</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-glass-border glow-accent hover:glow-intense transition-all duration-300">
              <CardContent className="p-3 sm:p-4 text-center">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-accent mx-auto mb-2 animate-glow-pulse" />
                <div className="text-xl sm:text-2xl font-bold">6/7</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Goals Hit This Week</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="macros" className="space-y-6 animate-slide-in-up">
          <Card className="glass-card border-glass-border glow-accent">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <div className="flex items-center">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-accent animate-glow" />
                  Weekly Macro Intake Trends
                </div>
                {/* Legend */}
                <div className="hidden sm:flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#00BFFF'}}></div>
                    <span>Protein</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#FFC107'}}></div>
                    <span>Carbs</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#FF6B6B'}}></div>
                    <span>Fat</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mobile Legend */}
              <div className="sm:hidden flex justify-center space-x-4 text-xs mb-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: '#00BFFF'}}></div>
                  <span>Protein</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: '#FFC107'}}></div>
                  <span>Carbs</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: '#FF6B6B'}}></div>
                  <span>Fat</span>
                </div>
              </div>

              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.weekly_macros}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: 'Grams', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    />
                    <Tooltip content={<MacroTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="protein"
                      stroke="#00BFFF"
                      strokeWidth={3}
                      dot={{
                        fill: '#00BFFF',
                        strokeWidth: 2,
                        r: 5,
                        filter: 'drop-shadow(0 0 6px #00BFFF)'
                      }}
                      animationBegin={0}
                      animationDuration={1800}
                    />
                    <Line
                      type="monotone"
                      dataKey="carbs"
                      stroke="#FFC107"
                      strokeWidth={3}
                      dot={{
                        fill: '#FFC107',
                        strokeWidth: 2,
                        r: 5,
                        filter: 'drop-shadow(0 0 6px #FFC107)'
                      }}
                      animationBegin={300}
                      animationDuration={1800}
                    />
                    <Line
                      type="monotone"
                      dataKey="fat"
                      stroke="#FF6B6B"
                      strokeWidth={3}
                      dot={{
                        fill: '#FF6B6B',
                        strokeWidth: 2,
                        r: 5,
                        filter: 'drop-shadow(0 0 6px #FF6B6B)'
                      }}
                      animationBegin={600}
                      animationDuration={1800}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            <Card className="glass-card border-glass-border glow hover:glow-accent transition-all duration-300">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold" style={{color: '#00BFFF'}}>142g</div>
                <div className="text-xs text-muted-foreground">Avg Protein</div>
              </CardContent>
            </Card>

            <Card className="glass-card border-glass-border glow hover:glow transition-all duration-300">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold" style={{color: '#FFC107'}}>207g</div>
                <div className="text-xs text-muted-foreground">Avg Carbs</div>
              </CardContent>
            </Card>

            <Card className="glass-card border-glass-border glow hover:glow-intense transition-all duration-300">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold" style={{color: '#FF6B6B'}}>75g</div>
                <div className="text-xs text-muted-foreground">Avg Fat</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weight" className="space-y-6 animate-slide-in-up">
          <Card className="glass-card border-glass-border glow">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-accent animate-glow" />
                Weight Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.weight_progress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="week" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      domain={['dataMin - 0.5', 'dataMax + 0.5']}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--glass-bg))',
                        border: '1px solid hsl(var(--glass-border))',
                        borderRadius: '8px',
                        backdropFilter: 'blur(20px)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      dot={{ 
                        fill: 'hsl(var(--accent))', 
                        strokeWidth: 2, 
                        r: 5, 
                        filter: 'drop-shadow(0 0 6px hsl(var(--glow-secondary)))' 
                      }}
                      animationBegin={0}
                      animationDuration={2000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="glass-card border-glass-border glow hover:glow-accent transition-all duration-300">
              <CardContent className="p-3 sm:p-4 text-center">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-accent mx-auto mb-2 animate-glow" />
                <div className="text-xl sm:text-2xl font-bold text-accent">-2.0kg</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Lost</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-glass-border glow-intense hover:glow-intense transition-all duration-300">
              <CardContent className="p-3 sm:p-4 text-center">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 animate-glow-pulse" />
                <div className="text-xl sm:text-2xl font-bold text-primary">1.5kg</div>
                <div className="text-xs sm:text-sm text-muted-foreground">To Goal</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
