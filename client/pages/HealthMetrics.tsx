import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Heart,
  Scale,
  Ruler,
  Activity,
  Thermometer,
  Eye,
  Droplet,
  Brain,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  Edit3,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, subDays } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function HealthMetrics() {
  const navigate = useNavigate();
  const [isAddingMetric, setIsAddingMetric] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const [metrics, setMetrics] = useState({
    weight: {
      current: 68.5,
      unit: "kg",
      target: 65,
      trend: "down",
      lastUpdated: "2024-01-28",
      history: [
        { date: "2024-01-20", value: 70.2 },
        { date: "2024-01-22", value: 69.8 },
        { date: "2024-01-24", value: 69.5 },
        { date: "2024-01-26", value: 69.1 },
        { date: "2024-01-28", value: 68.5 },
      ],
    },
    heartRate: {
      current: 72,
      unit: "bpm",
      target: 70,
      trend: "stable",
      lastUpdated: "2024-01-28",
      history: [
        { date: "2024-01-20", value: 75 },
        { date: "2024-01-22", value: 73 },
        { date: "2024-01-24", value: 74 },
        { date: "2024-01-26", value: 72 },
        { date: "2024-01-28", value: 72 },
      ],
    },
    bloodPressure: {
      current: "118/78",
      unit: "mmHg",
      target: "120/80",
      trend: "stable",
      lastUpdated: "2024-01-28",
      history: [
        { date: "2024-01-20", systolic: 122, diastolic: 82 },
        { date: "2024-01-22", systolic: 120, diastolic: 80 },
        { date: "2024-01-24", systolic: 119, diastolic: 79 },
        { date: "2024-01-26", systolic: 118, diastolic: 78 },
        { date: "2024-01-28", systolic: 118, diastolic: 78 },
      ],
    },
    bodyFat: {
      current: 18.5,
      unit: "%",
      target: 15,
      trend: "down",
      lastUpdated: "2024-01-26",
      history: [
        { date: "2024-01-15", value: 20.1 },
        { date: "2024-01-20", value: 19.5 },
        { date: "2024-01-22", value: 19.2 },
        { date: "2024-01-24", value: 18.8 },
        { date: "2024-01-26", value: 18.5 },
      ],
    },
    muscleMass: {
      current: 45.2,
      unit: "kg",
      target: 48,
      trend: "up",
      lastUpdated: "2024-01-26",
      history: [
        { date: "2024-01-15", value: 44.1 },
        { date: "2024-01-20", value: 44.5 },
        { date: "2024-01-22", value: 44.8 },
        { date: "2024-01-24", value: 45.0 },
        { date: "2024-01-26", value: 45.2 },
      ],
    },
    sleep: {
      current: 7.5,
      unit: "hours",
      target: 8,
      trend: "stable",
      lastUpdated: "2024-01-28",
      history: [
        { date: "2024-01-20", value: 7.2 },
        { date: "2024-01-22", value: 7.8 },
        { date: "2024-01-24", value: 7.5 },
        { date: "2024-01-26", value: 7.6 },
        { date: "2024-01-28", value: 7.5 },
      ],
    },
  });

  const vitalSigns = [
    {
      id: "heartRate",
      name: "Heart Rate",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      id: "bloodPressure",
      name: "Blood Pressure",
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "weight",
      name: "Weight",
      icon: Scale,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  const bodyComposition = [
    {
      id: "bodyFat",
      name: "Body Fat",
      icon: Eye,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      id: "muscleMass",
      name: "Muscle Mass",
      icon: Ruler,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      id: "sleep",
      name: "Sleep Quality",
      icon: Brain,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const updateMetric = (metricId: string, newValue: number | string) => {
    setMetrics((prev) => ({
      ...prev,
      [metricId]: {
        ...prev[metricId],
        current: newValue,
        lastUpdated: format(new Date(), "yyyy-MM-dd"),
      },
    }));
  };

  const MetricCard = ({
    metric,
    metricData,
  }: {
    metric: any;
    metricData: any;
  }) => {
    const Icon = metric.icon;
    const isEditing = selectedMetric === metric.id;

    return (
      <Card className="glass-card border-glass-border hover:glow-accent transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div>
                <h4 className="font-semibold">{metric.name}</h4>
                <p className="text-xs text-muted-foreground">
                  Updated {format(new Date(metricData.lastUpdated), "MMM d")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getTrendIcon(metricData.trend)}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setSelectedMetric(isEditing ? null : metric.id)}
              >
                <Edit3 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="text-center mb-3">
            <div className="text-2xl font-bold">
              {metricData.current} {metricData.unit}
            </div>
            <div className="text-sm text-muted-foreground">
              Target: {metricData.target} {metricData.unit}
            </div>
          </div>

          {isEditing && (
            <div className="space-y-2 pt-3 border-t border-glass-border">
              <Label htmlFor={`update-${metric.id}`} className="text-sm">
                Update Value
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id={`update-${metric.id}`}
                  type={metric.id === "bloodPressure" ? "text" : "number"}
                  defaultValue={metricData.current}
                  className="glass-card border-glass-border h-8"
                  placeholder={metric.id === "bloodPressure" ? "120/80" : "0"}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const input = document.getElementById(
                      `update-${metric.id}`,
                    ) as HTMLInputElement;
                    if (input.value) {
                      updateMetric(
                        metric.id,
                        metric.id === "bloodPressure"
                          ? input.value
                          : parseFloat(input.value),
                      );
                      setSelectedMetric(null);
                    }
                  }}
                  className="h-8 glow-accent"
                >
                  <Save className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Mini Chart */}
          {metricData.history && (
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={metricData.history}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={metric.color.replace("text-", "#")}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(0, 0, 0, 0.8)",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const healthScore = 85;
  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
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
            <Heart className="w-6 h-6 mr-2 text-primary" />
            Health Metrics
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor your vital health indicators
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Health Score */}
        <Card className="glass-card border-glass-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Overall Health Score
                </h3>
                <p className="text-sm text-muted-foreground">
                  Based on your recent metrics and trends
                </p>
              </div>
              <div className="text-center">
                <div
                  className={`text-4xl font-bold ${getHealthScoreColor(healthScore)}`}
                >
                  {healthScore}
                </div>
                <div className="text-sm text-muted-foreground">out of 100</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    healthScore >= 80
                      ? "bg-green-500"
                      : healthScore >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${healthScore}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="vitals" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 glass-card">
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="composition">Body Composition</TabsTrigger>
          </TabsList>

          <TabsContent value="vitals" className="space-y-4">
            <div className="grid gap-4">
              {vitalSigns.map((metric) => (
                <MetricCard
                  key={metric.id}
                  metric={metric}
                  metricData={metrics[metric.id]}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="composition" className="space-y-4">
            <div className="grid gap-4">
              {bodyComposition.map((metric) => (
                <MetricCard
                  key={metric.id}
                  metric={metric}
                  metricData={metrics[metric.id]}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Health Insights */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-primary" />
              Health Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 glass-card rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <div>
                  <h5 className="font-medium text-green-500">Positive Trend</h5>
                  <p className="text-sm text-muted-foreground">
                    Your weight and body fat percentage are trending downward,
                    indicating healthy progress toward your goals.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 glass-card rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                <div>
                  <h5 className="font-medium text-yellow-500">
                    Recommendation
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    Consider increasing your sleep duration by 30 minutes to
                    reach your 8-hour target for better recovery.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 glass-card rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div>
                  <h5 className="font-medium text-blue-500">Achievement</h5>
                  <p className="text-sm text-muted-foreground">
                    Your muscle mass has increased by 2.7% this month! Keep up
                    the strength training routine.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card border-glass-border">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Quick Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button variant="outline" className="glass-card justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Add Blood Test Results
              </Button>
              <Button variant="outline" className="glass-card justify-start">
                <Thermometer className="w-4 h-4 mr-2" />
                Log Body Temperature
              </Button>
              <Button variant="outline" className="glass-card justify-start">
                <Droplet className="w-4 h-4 mr-2" />
                Record Hydration Level
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
