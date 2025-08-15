import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  Plus,
  Clock,
  Users,
  ChefHat,
  Coffee,
  Sun,
  Sunset,
  Moon,
  Flame,
  Target,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, addDays, startOfWeek } from "date-fns";

export default function MealPlanning() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(0);

  const mealTypes = [
    {
      id: "breakfast",
      name: "Breakfast",
      icon: Coffee,
      color: "text-orange-400",
    },
    { id: "lunch", name: "Lunch", icon: Sun, color: "text-yellow-400" },
    { id: "dinner", name: "Dinner", icon: Sunset, color: "text-purple-400" },
    { id: "snacks", name: "Snacks", icon: Moon, color: "text-blue-400" },
  ];

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeek(new Date()), i);
    return {
      date,
      dayName: format(date, "EEE"),
      dayNumber: format(date, "d"),
      isToday: i === new Date().getDay(),
    };
  });

  const mealPlans = {
    0: {
      // Sunday
      breakfast: {
        name: "Protein Pancakes",
        calories: 320,
        protein: 25,
        carbs: 35,
        fat: 8,
        prepTime: "15 min",
      },
      lunch: {
        name: "Grilled Chicken Salad",
        calories: 450,
        protein: 35,
        carbs: 20,
        fat: 25,
        prepTime: "20 min",
      },
      dinner: {
        name: "Salmon with Quinoa",
        calories: 520,
        protein: 40,
        carbs: 45,
        fat: 20,
        prepTime: "25 min",
      },
      snacks: {
        name: "Greek Yogurt with Berries",
        calories: 180,
        protein: 15,
        carbs: 20,
        fat: 6,
        prepTime: "5 min",
      },
    },
  };

  const getCurrentMealPlan = () => {
    return (
      mealPlans[selectedDay] || {
        breakfast: null,
        lunch: null,
        dinner: null,
        snacks: null,
      }
    );
  };

  const getTotalNutrition = () => {
    const plan = getCurrentMealPlan();
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    Object.values(plan).forEach((meal) => {
      if (meal) {
        totalCalories += meal.calories;
        totalProtein += meal.protein;
        totalCarbs += meal.carbs;
        totalFat += meal.fat;
      }
    });

    return { totalCalories, totalProtein, totalCarbs, totalFat };
  };

  const nutrition = getTotalNutrition();

  const quickMealTemplates = [
    {
      name: "High Protein",
      description: "Perfect for muscle building",
      calories: "2200-2400",
      protein: "140g+",
      color: "border-blue-500/30 bg-blue-500/5",
    },
    {
      name: "Weight Loss",
      description: "Balanced deficit meals",
      calories: "1600-1800",
      protein: "120g+",
      color: "border-green-500/30 bg-green-500/5",
    },
    {
      name: "Maintenance",
      description: "Balanced nutrition",
      calories: "2000-2200",
      protein: "100g+",
      color: "border-purple-500/30 bg-purple-500/5",
    },
  ];

  const MealCard = ({ mealType, meal }: { mealType: any; meal: any }) => {
    const Icon = mealType.icon;

    return (
      <Card className="glass-card border-glass-border hover:glow-accent transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Icon className={`w-5 h-5 ${mealType.color}`} />
              <h4 className="font-semibold">{mealType.name}</h4>
            </div>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {meal ? (
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-sm">{meal.name}</h5>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="glass text-xs">
                    <Flame className="w-3 h-3 mr-1" />
                    {meal.calories} cal
                  </Badge>
                  <Badge variant="outline" className="glass text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {meal.prepTime}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 glass-card rounded">
                  <div className="font-bold text-blue-400">{meal.protein}g</div>
                  <div className="text-muted-foreground">Protein</div>
                </div>
                <div className="text-center p-2 glass-card rounded">
                  <div className="font-bold text-yellow-400">{meal.carbs}g</div>
                  <div className="text-muted-foreground">Carbs</div>
                </div>
                <div className="text-center p-2 glass-card rounded">
                  <div className="font-bold text-pink-400">{meal.fat}g</div>
                  <div className="text-muted-foreground">Fat</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <ChefHat className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No meal planned</p>
              <Button size="sm" variant="outline" className="mt-2 glass-card">
                Add Meal
              </Button>
            </div>
          )}
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
            <Calendar className="w-6 h-6 mr-2 text-primary" />
            Meal Planning
          </h1>
          <p className="text-sm text-muted-foreground">
            Plan your weekly nutrition
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/quick-add-food")}
            className="glass-card border-glass-border hover:glow-accent transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Custom Food
          </Button>
          <Button size="sm" className="glow-accent">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Shopping List
          </Button>
        </div>
      </div>

      <Tabs defaultValue="weekly" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 glass-card">
          <TabsTrigger value="weekly">Weekly Plan</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6">
          {/* Day Selector */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {weekDays.map((day, index) => (
              <Button
                key={index}
                variant={selectedDay === index ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDay(index)}
                className={`min-w-[70px] flex-col space-y-1 h-16 transition-all duration-300 ${
                  selectedDay === index
                    ? "glow-accent scale-110"
                    : "glass-card hover:scale-105"
                } ${day.isToday && selectedDay !== index ? "border-primary text-primary" : ""}`}
              >
                <span className="text-xs font-medium">{day.dayName}</span>
                <span className="text-lg font-bold">{day.dayNumber}</span>
                {day.isToday && (
                  <div className="w-1 h-1 bg-accent rounded-full" />
                )}
              </Button>
            ))}
          </div>

          {/* Daily Nutrition Overview */}
          <Card className="glass-card border-glass-border">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Target className="w-5 h-5 mr-2 text-primary" />
                Daily Nutrition Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {nutrition.totalCalories}
                  </div>
                  <div className="text-sm text-muted-foreground">Calories</div>
                  <div className="text-xs text-green-400">Goal: 2200</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {nutrition.totalProtein}g
                  </div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                  <div className="text-xs text-green-400">Goal: 140g</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {nutrition.totalCarbs}g
                  </div>
                  <div className="text-sm text-muted-foreground">Carbs</div>
                  <div className="text-xs text-green-400">Goal: 220g</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">
                    {nutrition.totalFat}g
                  </div>
                  <div className="text-sm text-muted-foreground">Fat</div>
                  <div className="text-xs text-green-400">Goal: 75g</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mealTypes.map((mealType) => (
              <MealCard
                key={mealType.id}
                mealType={mealType}
                meal={getCurrentMealPlan()[mealType.id]}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-4">
            {quickMealTemplates.map((template) => (
              <Card
                key={template.name}
                className={`glass-card border-glass-border ${template.color}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline" className="glass text-xs">
                          {template.calories} cal/day
                        </Badge>
                        <Badge variant="outline" className="glass text-xs">
                          {template.protein} protein
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" className="glow-accent">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="glass-card border-glass-border">
            <CardContent className="p-6 text-center">
              <ChefHat className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">
                Create Custom Template
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Build your own meal plan template based on your preferences
              </p>
              <Button className="glow-accent">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
