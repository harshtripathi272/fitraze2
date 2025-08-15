import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Target,
  Plus,
  Edit3,
  Save,
  X,
  Trophy,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";

export default function FitnessGoals() {
  const navigate = useNavigate();
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    target: 0,
    unit: "",
    deadline: "",
    priority: "medium",
  });

  const [goals, setGoals] = useState([
    {
      id: "weight-loss",
      title: "Lose 10kg",
      description:
        "Reach my target weight through consistent diet and exercise",
      target: 10,
      current: 3.5,
      unit: "kg",
      priority: "high",
      deadline: "2024-06-15",
      category: "Weight Management",
      status: "in-progress",
      createdDate: "2024-01-15",
    },
    {
      id: "workout-frequency",
      title: "Workout 5 times per week",
      description: "Maintain a consistent workout schedule",
      target: 5,
      current: 4,
      unit: "sessions/week",
      priority: "high",
      deadline: "2024-03-01",
      category: "Fitness",
      status: "in-progress",
      createdDate: "2024-01-10",
    },
    {
      id: "protein-intake",
      title: "Daily Protein Goal",
      description: "Consume 150g protein daily for muscle building",
      target: 150,
      current: 142,
      unit: "g/day",
      priority: "medium",
      deadline: "2024-04-01",
      category: "Nutrition",
      status: "in-progress",
      createdDate: "2024-01-20",
    },
    {
      id: "marathon-prep",
      title: "Complete 5K Run",
      description: "Build endurance to run 5K without stopping",
      target: 5000,
      current: 3200,
      unit: "meters",
      priority: "medium",
      deadline: "2024-05-01",
      category: "Cardio",
      status: "in-progress",
      createdDate: "2024-01-25",
    },
  ]);

  const categories = [
    "Weight Management",
    "Fitness",
    "Nutrition",
    "Cardio",
    "Strength",
    "Flexibility",
  ];
  const priorities = ["low", "medium", "high"];

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.target) {
      const goal = {
        id: Date.now().toString(),
        ...newGoal,
        current: 0,
        status: "in-progress",
        createdDate: format(new Date(), "yyyy-MM-dd"),
        category: "Fitness",
      };
      setGoals([...goals, goal]);
      setNewGoal({
        title: "",
        description: "",
        target: 0,
        unit: "",
        deadline: "",
        priority: "medium",
      });
      setIsAddingGoal(false);
    }
  };

  const updateGoalProgress = (id: string, newCurrent: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, current: newCurrent } : goal,
      ),
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 border-red-500/30";
      case "medium":
        return "text-yellow-500 border-yellow-500/30";
      case "low":
        return "text-green-500 border-green-500/30";
      default:
        return "text-gray-500 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "in-progress":
        return "text-blue-500";
      case "overdue":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const GoalCard = ({ goal }: { goal: any }) => {
    const progress = (goal.current / goal.target) * 100;
    const daysRemaining = getDaysRemaining(goal.deadline);
    const isCompleted = progress >= 100;
    const isOverdue = daysRemaining < 0 && !isCompleted;

    return (
      <Card
        className={`glass-card border-glass-border transition-all duration-300 ${
          isCompleted ? "glow-accent" : ""
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold">{goal.title}</h3>
                <Badge
                  variant="outline"
                  className={`glass text-xs ${getPriorityColor(goal.priority)}`}
                >
                  {goal.priority}
                </Badge>
                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {goal.description}
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {format(new Date(goal.deadline), "MMM d, yyyy")}
                </div>
                <div
                  className={`flex items-center ${
                    isOverdue
                      ? "text-red-500"
                      : daysRemaining <= 7
                        ? "text-yellow-500"
                        : ""
                  }`}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {isOverdue
                    ? `${Math.abs(daysRemaining)} days overdue`
                    : `${daysRemaining} days left`}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() =>
                setEditingGoal(editingGoal === goal.id ? null : goal.id)
              }
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-bold">
                {goal.current.toLocaleString()} / {goal.target.toLocaleString()}{" "}
                {goal.unit}
              </span>
            </div>

            <Progress value={Math.min(progress, 100)} className="h-3" />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{Math.round(progress)}% Complete</span>
              <span
                className={getStatusColor(
                  isCompleted
                    ? "completed"
                    : isOverdue
                      ? "overdue"
                      : "in-progress",
                )}
              >
                {isCompleted
                  ? "Completed"
                  : isOverdue
                    ? "Overdue"
                    : "In Progress"}
              </span>
            </div>

            {editingGoal === goal.id && (
              <div className="pt-3 border-t border-glass-border">
                <Label htmlFor={`progress-${goal.id}`} className="text-sm">
                  Update Progress
                </Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    id={`progress-${goal.id}`}
                    type="number"
                    value={goal.current}
                    onChange={(e) =>
                      updateGoalProgress(
                        goal.id,
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="glass-card border-glass-border h-8"
                    max={goal.target}
                    min={0}
                    step={0.1}
                  />
                  <span className="text-sm text-muted-foreground">
                    {goal.unit}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => setEditingGoal(null)}
                    className="h-8 glow-accent"
                  >
                    <Save className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const goalStats = {
    total: goals.length,
    completed: goals.filter((g) => g.current / g.target >= 1).length,
    inProgress: goals.filter((g) => g.current / g.target < 1).length,
    overdue: goals.filter(
      (g) => getDaysRemaining(g.deadline) < 0 && g.current / g.target < 1,
    ).length,
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
            <Target className="w-6 h-6 mr-2 text-primary" />
            Fitness Goals
          </h1>
          <p className="text-sm text-muted-foreground">
            Set and track your fitness objectives
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsAddingGoal(true)}
          className="glow-accent"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card border-glass-border">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-lg font-bold">{goalStats.total}</div>
              <div className="text-xs text-muted-foreground">Total Goals</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-lg font-bold">{goalStats.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-lg font-bold">{goalStats.inProgress}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass-border">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="text-lg font-bold">{goalStats.overdue}</div>
              <div className="text-xs text-muted-foreground">Overdue</div>
            </CardContent>
          </Card>
        </div>

        {/* Add New Goal Form */}
        {isAddingGoal && (
          <Card className="glass-card  border-primary/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-primary" />
                  Create New Goal
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingGoal(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goal-title">Goal Title</Label>
                  <Input
                    id="goal-title"
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, title: e.target.value })
                    }
                    placeholder="e.g., Lose 5kg"
                    className="glass-card border-glass-border mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="goal-deadline">Deadline</Label>
                  <Input
                    id="goal-deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, deadline: e.target.value })
                    }
                    className="glass-card border-glass-border mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="goal-description">Description</Label>
                <Textarea
                  id="goal-description"
                  value={newGoal.description}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, description: e.target.value })
                  }
                  placeholder="Describe your goal and motivation..."
                  className="glass-card border-glass-border mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goal-target">Target Value</Label>
                  <Input
                    id="goal-target"
                    type="number"
                    value={newGoal.target}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        target: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="e.g., 10"
                    className="glass-card border-glass-border mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="goal-unit">Unit</Label>
                  <Input
                    id="goal-unit"
                    value={newGoal.unit}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, unit: e.target.value })
                    }
                    placeholder="e.g., kg, workouts, minutes"
                    className="glass-card border-glass-border mt-1"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleAddGoal}
                  className="flex-1 glow-accent"
                  disabled={!newGoal.title || !newGoal.target}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Goal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingGoal(false)}
                  className="flex-1 glass-card"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>

        {goals.length === 0 && (
          <Card className="glass-card border-glass-border">
            <CardContent className="p-8 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Goals Set</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start your fitness journey by setting your first goal
              </p>
              <Button
                onClick={() => setIsAddingGoal(true)}
                className="glow-accent"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
