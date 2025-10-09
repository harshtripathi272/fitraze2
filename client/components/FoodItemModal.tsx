import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Dumbbell, 
  Wheat, 
  Droplet,
  X,
  Plus,
  Calculator
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Food {
  
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

interface FoodItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  food: Food | null;
  onFoodAdded: (food: Food, mealType: string, quantity: number, unit: string) => void;
  mealType: string;
}

const units = [
  { value: "g", label: "grams (g)", baseGrams: 1 },
  { value: "ml", label: "milliliters (ml)", baseGrams: 1 },
  { value: "cup", label: "cups", baseGrams: 240 },
  { value: "tbsp", label: "tablespoons", baseGrams: 15 },
  { value: "tsp", label: "teaspoons", baseGrams: 5 },
  { value: "piece", label: "pieces", baseGrams: 100 },
  { value: "medium", label: "medium size", baseGrams: 120 },
  { value: "large", label: "large size", baseGrams: 180 },
  { value: "slice", label: "slices", baseGrams: 30 },
  { value: "oz", label: "ounces", baseGrams: 28.35 }
];

export function FoodItemModal({ open, onOpenChange, food, onFoodAdded, mealType }: FoodItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState("g");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (food) {
      setQuantity(1);
      setSelectedUnit("g");
    }
  }, [food]);

  if (!food) return null;

  const getMultiplier = () => {
    const unit = units.find(u => u.value === selectedUnit);
    const baseUnit = units.find(u => u.value === "g");
    
    if (!unit || !baseUnit) return 1;
    
    const servingInGrams = parseInt(food.serving) || 100;
    return (quantity * unit.baseGrams) / servingInGrams;
  };

  const multiplier = getMultiplier();
  const calculatedNutrition = {
    calories: Math.round(food.calories * multiplier),
    protein: Math.round(food.protein * multiplier * 10) / 10,
    carbs: Math.round(food.carbs * multiplier * 10) / 10,
    fat: Math.round(food.fat * multiplier * 10) / 10
  };

  const handleAddFood = async () => {
    if (!food) return;

    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("fitRazeUser") || "{}");
      const token = localStorage.getItem("access_token") || storedUser.token;
      if (!token) { alert("Please log in first."); return; }
      const response = await fetch("http://localhost:8000/api/v1/food-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          
          name: food.name,
          calories: calculatedNutrition.calories,
          protein: calculatedNutrition.protein,
          carbs: calculatedNutrition.carbs,
          fat: calculatedNutrition.fat,
          serving: `${quantity} ${selectedUnit}`,
          meal_type: mealType,
          quantity: quantity,
          unit: selectedUnit
        }),
      });

      if (response.ok) {
        const adjustedFood = {
          ...food,
          calories: calculatedNutrition.calories,
          protein: calculatedNutrition.protein,
          carbs: calculatedNutrition.carbs,
          fat: calculatedNutrition.fat,
          serving: `${quantity} ${selectedUnit}`
        };
        onFoodAdded(adjustedFood, mealType, quantity, selectedUnit);
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to save food entry:", error);
    } finally {
      setLoading(false);
    }
  };

  const MacroPill = ({ 
    icon: Icon, 
    label, 
    value, 
    unit, 
    color, 
    bgColor 
  }: { 
    icon: any; 
    label: string; 
    value: number; 
    unit: string; 
    color: string;
    bgColor: string;
  }) => (
    <div className={cn(
      "flex items-center space-x-2 px-3 py-2 rounded-full glass-card border border-glass-border transition-all duration-300 hover:scale-105 hover:glow",
      bgColor
    )}>
      <Icon className={cn("w-4 h-4", color)} />
      <div className="flex flex-col">
        <span className={cn("text-xs font-medium", color)}>{label}</span>
        <span className={cn("text-sm font-bold", color)}>{value}{unit}</span>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-enhanced border-glass-border max-w-md mx-auto max-h-[90vh] overflow-hidden modal-content">
        <DialogHeader>
          <DialogTitle className="sr-only">Food Item Details</DialogTitle>
        </DialogHeader>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 h-8 w-8 p-0 z-10"
          onClick={() => onOpenChange(false)}
        >
          <X className="w-4 h-4" />
        </Button>

        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center text-xl font-bold pr-8">
            <Calculator className="w-6 h-6 mr-3 text-primary animate-glow" />
            Customize Portion
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto pr-2">
          <div className="glass-card p-4 rounded-2xl border border-glass-border glow-accent">
            <h3 className="font-semibold text-lg mb-2">{food.name}</h3>
            <p className="text-sm text-muted-foreground">
              Base serving: {food.serving} • {food.calories} calories
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity" className="text-sm font-medium mb-2 block">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                  min="0.1"
                  step="0.1"
                  className="glass-card border-glass-border text-center"
                />
              </div>

              <div>
                <Label htmlFor="unit" className="text-sm font-medium mb-2 block">
                  Unit
                </Label>
                <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                  <SelectTrigger className="glass-card border-glass-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-glass-border">
                    {units.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="glass-card p-3 rounded-lg border border-glass-border">
              <p className="text-sm text-center">
                <span className="text-muted-foreground">Selected portion: </span>
                <span className="font-semibold text-primary">
                  {quantity} {selectedUnit} of {food.name}
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Nutrition Information</h4>
            
            <div className="glass-card p-4 rounded-2xl border border-glass-border glow text-center">
              <div className="text-3xl font-bold text-primary">{calculatedNutrition.calories}</div>
              <div className="text-sm text-muted-foreground">calories</div>
            </div>

            <div className="space-y-3">
              <MacroPill
                icon={Dumbbell}
                label="Protein"
                value={calculatedNutrition.protein}
                unit="g"
                color="text-blue-400"
                bgColor="bg-blue-500/10"
              />
              
              <MacroPill
                icon={Wheat}
                label="Carbohydrates"
                value={calculatedNutrition.carbs}
                unit="g"
                color="text-yellow-400"
                bgColor="bg-yellow-500/10"
              />
              
              <MacroPill
                icon={Droplet}
                label="Fats"
                value={calculatedNutrition.fat}
                unit="g"
                color="text-pink-400"
                bgColor="bg-pink-500/10"
              />
            </div>

            {multiplier !== 1 && (
              <div className="glass-card p-3 rounded-lg border border-glass-border bg-accent/5">
                <p className="text-xs text-center">
                  <span className="text-muted-foreground">
                    {multiplier > 1 ? "+" : ""}
                    {Math.round((multiplier - 1) * 100)}% from base serving
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-glass-border">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 glass-card border-glass-border"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddFood}
            disabled={loading}
            className="flex-1 glow-accent hover:scale-105 transition-all duration-300 btn-glow-effect"
          >
            <Plus className="w-4 h-4 mr-2" />
            {loading ? "Adding..." : `Add to ${mealType}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}