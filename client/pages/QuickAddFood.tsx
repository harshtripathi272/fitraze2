import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plus,
  Save,
  Sparkles,
  Calculator,
  ChefHat,
  Dumbbell,
  Wheat,
  Droplet,
  Scale,
  Clock,
} from "lucide-react";
import { formatMacro, formatCalories } from "@/lib/formatters";

interface CustomFood {
  name: string;
  brand: string;
  serving: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  category: string;
  notes: string;
}

const categories = [
  "Fruits",
  "Vegetables",
  "Proteins",
  "Grains & Cereals",
  "Dairy",
  "Nuts & Seeds",
  "Beverages",
  "Snacks",
  "Desserts",
  "Condiments & Sauces",
  "Prepared Meals",
  "Other",
];

const servingUnits = [
  { value: "g", label: "grams (g)" },
  { value: "ml", label: "milliliters (ml)" },
  { value: "cup", label: "cup" },
  { value: "tbsp", label: "tablespoon" },
  { value: "tsp", label: "teaspoon" },
  { value: "piece", label: "piece" },
  { value: "slice", label: "slice" },
  { value: "oz", label: "ounce" },
  { value: "lb", label: "pound" },
];

export default function QuickAddFood() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [customFood, setCustomFood] = useState<CustomFood>({
    name: "",
    brand: "",
    serving: "",
    servingSize: 100,
    servingUnit: "g",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    category: "",
    notes: "",
  });

  const handleInputChange = (
    field: keyof CustomFood,
    value: string | number,
  ) => {
    setCustomFood((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateCaloriesFromMacros = () => {
    const proteinCals = customFood.protein * 4;
    const carbsCals = customFood.carbs * 4;
    const fatCals = customFood.fat * 9;
    const totalCalculated = proteinCals + carbsCals + fatCals;

    setCustomFood((prev) => ({
      ...prev,
      calories: Math.round(totalCalculated),
    }));

    toast({
      title: "Calories Calculated",
      description: `${Math.round(totalCalculated)} calories from macronutrients`,
      duration: 2000,
    });
  };

  const handleSave = async () => {
    // Validation
    if (!customFood.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Food name is required",
        variant: "destructive",
      });
      return;
    }

    if (
      customFood.calories === 0 &&
      customFood.protein === 0 &&
      customFood.carbs === 0 &&
      customFood.fat === 0
    ) {
      toast({
        title: "Missing Nutrition Data",
        description:
          "Please add at least calories or macronutrient information",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to local storage (in a real app, this would be saved to database)
      const existingFoods = JSON.parse(
        localStorage.getItem("customFoods") || "[]",
      );
      const newFood = {
        ...customFood,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        serving: `${customFood.servingSize} ${customFood.servingUnit}`,
      };

      existingFoods.push(newFood);
      localStorage.setItem("customFoods", JSON.stringify(existingFoods));

      toast({
        title: "Custom Food Added!",
        description: `${customFood.name} has been saved to your food database`,
        duration: 3000,
      });

      // Reset form
      setCustomFood({
        name: "",
        brand: "",
        serving: "",
        servingSize: 100,
        servingUnit: "g",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        category: "",
        notes: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save custom food. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalMacros = customFood.protein + customFood.carbs + customFood.fat;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="glass-card p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Quick Add Custom Food</h1>
        <div className="w-9" />
      </div>

      {/* Hero Section */}
      <Card className="glass-enhanced border-glass-border mb-6 glow-accent">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 glass-card rounded-full flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-primary animate-glow" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Create Your Custom Food</h2>
          <p className="text-muted-foreground text-sm">
            Add nutritional information for foods not in our database
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Basic Information */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Sparkles className="w-5 h-5 mr-2 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Food Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g., Homemade Protein Shake"
                value={customFood.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="glass-card border-glass-border mt-1"
              />
            </div>

            <div>
              <Label htmlFor="brand" className="text-sm font-medium">
                Brand (Optional)
              </Label>
              <Input
                id="brand"
                placeholder="e.g., Acme Foods"
                value={customFood.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                className="glass-card border-glass-border mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select
                value={customFood.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger className="glass-card border-glass-border mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="glass-card border-glass-border">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Serving Information */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Scale className="w-5 h-5 mr-2 text-accent" />
              Serving Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="servingSize" className="text-sm font-medium">
                  Serving Size
                </Label>
                <Input
                  id="servingSize"
                  type="number"
                  min="0"
                  step="0.1"
                  value={customFood.servingSize}
                  onChange={(e) =>
                    handleInputChange(
                      "servingSize",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  className="glass-card border-glass-border mt-1"
                />
              </div>

              <div>
                <Label htmlFor="servingUnit" className="text-sm font-medium">
                  Unit
                </Label>
                <Select
                  value={customFood.servingUnit}
                  onValueChange={(value) =>
                    handleInputChange("servingUnit", value)
                  }
                >
                  <SelectTrigger className="glass-card border-glass-border mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-glass-border">
                    {servingUnits.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="glass-card p-3 rounded-lg border border-glass-border bg-accent/5">
              <p className="text-sm text-center">
                <span className="text-muted-foreground">Serving: </span>
                <span className="font-semibold text-primary">
                  {customFood.servingSize} {customFood.servingUnit}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Information */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-green-500" />
                Nutrition Information
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={calculateCaloriesFromMacros}
                className="glass-card text-xs"
                disabled={totalMacros === 0}
              >
                <Calculator className="w-3 h-3 mr-1" />
                Auto-Calculate
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Calories */}
            <div>
              <Label htmlFor="calories" className="text-sm font-medium">
                Calories
              </Label>
              <Input
                id="calories"
                type="number"
                min="0"
                value={customFood.calories}
                onChange={(e) =>
                  handleInputChange("calories", parseFloat(e.target.value) || 0)
                }
                className="glass-card border-glass-border mt-1"
              />
            </div>

            {/* Macronutrients */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label
                  htmlFor="protein"
                  className="text-sm font-medium flex items-center"
                >
                  <Dumbbell className="w-3 h-3 mr-1 text-blue-400" />
                  Protein (g)
                </Label>
                <Input
                  id="protein"
                  type="number"
                  min="0"
                  step="0.1"
                  value={customFood.protein}
                  onChange={(e) =>
                    handleInputChange(
                      "protein",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  className="glass-card border-glass-border mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="carbs"
                  className="text-sm font-medium flex items-center"
                >
                  <Wheat className="w-3 h-3 mr-1 text-yellow-400" />
                  Carbs (g)
                </Label>
                <Input
                  id="carbs"
                  type="number"
                  min="0"
                  step="0.1"
                  value={customFood.carbs}
                  onChange={(e) =>
                    handleInputChange("carbs", parseFloat(e.target.value) || 0)
                  }
                  className="glass-card border-glass-border mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="fat"
                  className="text-sm font-medium flex items-center"
                >
                  <Droplet className="w-3 h-3 mr-1 text-pink-400" />
                  Fat (g)
                </Label>
                <Input
                  id="fat"
                  type="number"
                  min="0"
                  step="0.1"
                  value={customFood.fat}
                  onChange={(e) =>
                    handleInputChange("fat", parseFloat(e.target.value) || 0)
                  }
                  className="glass-card border-glass-border mt-1"
                />
              </div>
            </div>

            {/* Additional nutrients */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fiber" className="text-sm font-medium">
                  Fiber (g)
                </Label>
                <Input
                  id="fiber"
                  type="number"
                  min="0"
                  step="0.1"
                  value={customFood.fiber}
                  onChange={(e) =>
                    handleInputChange("fiber", parseFloat(e.target.value) || 0)
                  }
                  className="glass-card border-glass-border mt-1"
                />
              </div>

              <div>
                <Label htmlFor="sugar" className="text-sm font-medium">
                  Sugar (g)
                </Label>
                <Input
                  id="sugar"
                  type="number"
                  min="0"
                  step="0.1"
                  value={customFood.sugar}
                  onChange={(e) =>
                    handleInputChange("sugar", parseFloat(e.target.value) || 0)
                  }
                  className="glass-card border-glass-border mt-1"
                />
              </div>

              <div>
                <Label htmlFor="sodium" className="text-sm font-medium">
                  Sodium (mg)
                </Label>
                <Input
                  id="sodium"
                  type="number"
                  min="0"
                  value={customFood.sodium}
                  onChange={(e) =>
                    handleInputChange("sodium", parseFloat(e.target.value) || 0)
                  }
                  className="glass-card border-glass-border mt-1"
                />
              </div>
            </div>

            {/* Macro visualization */}
            {totalMacros > 0 && (
              <div className="glass-card p-4 rounded-lg border border-glass-border">
                <h4 className="text-sm font-medium mb-3">
                  Macronutrient Breakdown
                </h4>
                <div className="space-y-2">
                  {customFood.protein > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-400 flex items-center">
                        <Dumbbell className="w-3 h-3 mr-1" />
                        Protein
                      </span>
                      <Badge variant="outline" className="glass text-xs">
                        {formatMacro(customFood.protein)}g (
                        {Math.round((customFood.protein / totalMacros) * 100)}%)
                      </Badge>
                    </div>
                  )}
                  {customFood.carbs > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-yellow-400 flex items-center">
                        <Wheat className="w-3 h-3 mr-1" />
                        Carbs
                      </span>
                      <Badge variant="outline" className="glass text-xs">
                        {formatMacro(customFood.carbs)}g (
                        {Math.round((customFood.carbs / totalMacros) * 100)}%)
                      </Badge>
                    </div>
                  )}
                  {customFood.fat > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-pink-400 flex items-center">
                        <Droplet className="w-3 h-3 mr-1" />
                        Fat
                      </span>
                      <Badge variant="outline" className="glass text-xs">
                        {formatMacro(customFood.fat)}g (
                        {Math.round((customFood.fat / totalMacros) * 100)}%)
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Clock className="w-5 h-5 mr-2 text-purple-400" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any additional information about this food..."
                value={customFood.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="glass-card border-glass-border mt-1 resize-none"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="pb-6">
          <Button
            onClick={handleSave}
            disabled={isLoading || !customFood.name.trim()}
            className="w-full h-12 glow-accent hover:scale-105 transition-all duration-300 btn-glow-effect text-lg"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="w-5 h-5 mr-2" />
                Save Custom Food
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
