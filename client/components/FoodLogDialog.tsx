import { useState, useEffect } from "react";
import { searchFoods } from "./lib/usda";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FoodItemModal } from "@/components/FoodItemModal";
import { formatMacro, formatCalories } from "@/lib/formatters";
import {
  Search,
  Plus,
  Coffee,
  Sun,
  Sunset,
  Moon,
  Apple,
  ChefHat,
  Cookie,
  Camera,
  ScanLine,
  Dumbbell,
  Wheat,
  Droplet,
  Settings,
} from "lucide-react";

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

interface FoodLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFoodAdded: (food: Food, mealType: string) => void;
  onScanMeal?: () => void;
  onNavigateToCustomFood?: () => void;
}

const mealTypes = [
  { id: "breakfast", name: "Breakfast", icon: Coffee, color: "text-orange-400" },
  { id: "lunch", name: "Lunch", icon: Sun, color: "text-yellow-400" },
  { id: "dinner", name: "Dinner", icon: Sunset, color: "text-purple-400" },
  { id: "snack", name: "Snack", icon: Cookie, color: "text-green-400" },
];

export function FoodLogDialog({ 
  open, 
  onOpenChange, 
  onFoodAdded, 
  onScanMeal,
  onNavigateToCustomFood 
}: FoodLogDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("breakfast");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!searchTerm) {
      setFoods([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchFoods(searchTerm);
        setFoods(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleAddFood = (food: Food, mealType: string, quantity: number, unit: string) => {
    onFoodAdded(food, mealType);
    setShowFoodModal(false);
  };

  const handleQuickAdd = (food: Food) => {
    onFoodAdded(food, selectedMealType);
    onOpenChange(false);
  };

  const handleCustomizeFood = (food: Food) => {
    setSelectedFood(food);
    setShowFoodModal(true);
  };

  const FoodItem = ({ food }: { food: Food }) => (
    <Card className="glass-card border-glass-border mb-3 hover:glow-accent transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">{food.name}</h4>
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => handleCustomizeFood(food)}
              className="glow h-8 w-8 p-0"
              variant="outline"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-3">
          {food.serving} • {formatCalories(food.calories)} cal
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center space-x-2 px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            <Dumbbell className="w-3 h-3 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-xs text-blue-400 font-medium">Protein</span>
              <span className="text-xs font-bold text-blue-400">{formatMacro(food.protein)}g</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
            <Wheat className="w-3 h-3 text-yellow-400" />
            <div className="flex flex-col">
              <span className="text-xs text-yellow-400 font-medium">Carbs</span>
              <span className="text-xs font-bold text-yellow-400">{formatMacro(food.carbs)}g</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 px-2 py-1 rounded-full bg-pink-500/10 border border-pink-500/20">
            <Droplet className="w-3 h-3 text-pink-400" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">Fats</span>
              <span className="text-xs font-bold text-pink-400">{formatMacro(food.fat)}g</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-glass-border max-w-sm mx-auto max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg">
            <ChefHat className="w-5 h-5 mr-2 text-primary" />
            Log Food
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Tabs value={selectedMealType} onValueChange={setSelectedMealType} className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass-card h-12">
              {mealTypes.map((meal) => (
                <TabsTrigger
                  key={meal.id}
                  value={meal.id}
                  className="data-[state=active]:glow-accent flex flex-col py-1"
                >
                  <meal.icon className={`w-4 h-4 ${meal.color}`} />
                  <span className="text-xs mt-1">{meal.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="space-y-3">
              {onScanMeal && (
                <Button
                  variant="outline"
                  className="w-full glass-card border-glass-border btn-glow-effect ripple-effect"
                  onClick={() => {
                    onOpenChange(false);
                    onScanMeal();
                  }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="relative">
                      <Camera className="w-4 h-4 text-accent animate-glow" />
                      <ScanLine className="w-3 h-3 absolute -top-1 -right-1 text-primary animate-pulse" />
                    </div>
                    <span>Scan Meal with Camera</span>
                  </div>
                </Button>
              )}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search foods..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-card border-glass-border"
                />
              </div>
            </div>

            {mealTypes.map((meal) => (
              <TabsContent key={meal.id} value={meal.id} className="mt-4">
                <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                  {loading && <p className="text-center text-muted-foreground">Loading...</p>}

                  {!loading && foods.length > 0 ? (
                    foods.map((food) => <FoodItem key={food.id} food={food} />)
                  ) : !loading && searchTerm ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Apple className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No foods found</p>
                      <p className="text-xs">Try a different search term</p>
                    </div>
                  ) : null}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              className="w-full glass-card glow"
              onClick={() => {
                const customFood: Food = {
                  id: Date.now().toString(),
                  name: "Custom Food",
                  calories: 200,
                  protein: 10,
                  carbs: 20,
                  fat: 8,
                  serving: "1 serving",
                };
                handleQuickAdd(customFood);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Quick Add Custom Food
            </Button>

            <Button
              variant="outline"
              className="w-full glass-card border-glass-border hover:glow-accent transition-all duration-300"
              onClick={() => {
                onOpenChange(false);
                onNavigateToCustomFood?.(); // Safe call
              }}>
              <Settings className="w-4 h-4 mr-2" />
              Create Custom Food
            </Button>
          </div>
        </div>

        <FoodItemModal
          open={showFoodModal}
          onOpenChange={setShowFoodModal}
          food={selectedFood}
          onFoodAdded={handleAddFood}
          mealType={selectedMealType}
        />
      </DialogContent>
    </Dialog>
  );
}