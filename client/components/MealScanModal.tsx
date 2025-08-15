import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Camera, 
  Upload, 
  ScanLine, 
  Plus, 
  Utensils,
  Zap,
  Target,
  X,
  RefreshCw,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DetectedFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
  serving: string;
}

interface MealScanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFoodAdded?: (food: DetectedFood, mealType: string) => void;
}

export function MealScanModal({ open, onOpenChange, onFoodAdded }: MealScanModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [detectedFoods, setDetectedFoods] = useState<DetectedFood[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<string>("lunch");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mealTypes = [
    { id: "breakfast", label: "Breakfast", icon: "🌅" },
    { id: "lunch", label: "Lunch", icon: "☀️" },
    { id: "dinner", label: "Dinner", icon: "🌙" },
    { id: "snack", label: "Snack", icon: "🍎" }
  ];

  // Mock detection results - in real app would use AI/ML API
  const mockDetection = (imageFile: File): DetectedFood[] => {
    const mockFoods = [
      {
        name: "Grilled Chicken Breast",
        calories: 231,
        protein: 43.5,
        carbs: 0,
        fat: 5.0,
        confidence: 94,
        serving: "150g"
      },
      {
        name: "Brown Rice",
        calories: 143,
        protein: 2.9,
        carbs: 23,
        fat: 1.1,
        confidence: 89,
        serving: "100g"
      },
      {
        name: "Mixed Vegetables",
        calories: 65,
        protein: 3.2,
        carbs: 13,
        fat: 0.4,
        confidence: 87,
        serving: "120g"
      }
    ];
    
    return mockFoods.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsScanning(true);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setScannedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Simulate AI processing delay
      setTimeout(() => {
        const detected = mockDetection(file);
        setDetectedFoods(detected);
        setIsScanning(false);
      }, 2000);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddFood = (food: DetectedFood) => {
    if (onFoodAdded) {
      onFoodAdded(food, selectedMealType);
    }
    // Reset state
    setScannedImage(null);
    setDetectedFoods([]);
    onOpenChange(false);
  };

  const handleRescan = () => {
    setScannedImage(null);
    setDetectedFoods([]);
    setIsScanning(false);
  };

  const getTotalNutrition = () => {
    return detectedFoods.reduce((total, food) => ({
      calories: total.calories + food.calories,
      protein: total.protein + food.protein,
      carbs: total.carbs + food.carbs,
      fat: total.fat + food.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const totalNutrition = getTotalNutrition();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-enhanced border-glass-border max-w-2xl mx-auto max-h-[90vh] overflow-hidden modal-content">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center text-xl font-bold">
            <div className="relative mr-3">
              <Camera className="w-6 h-6 text-primary animate-glow" />
              <ScanLine className="w-4 h-4 absolute -top-1 -right-1 text-accent animate-pulse" />
            </div>
            Scan Your Meal
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Take a photo or upload an image to automatically detect nutrition information
          </p>
        </DialogHeader>

        <div className="space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto pr-2">
          {!scannedImage ? (
            /* Upload Interface */
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                capture="environment"
              />
              
              <div 
                className="border-2 border-dashed border-glass-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 transition-all duration-300 glass-card glow hover:glow-accent"
                onClick={handleCameraClick}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-bounce-soft">
                      <Camera className="w-8 h-8 text-primary animate-glow" />
                    </div>
                    <ScanLine className="w-6 h-6 absolute -top-2 -right-2 text-accent animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Take a Photo</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Point your camera at your meal and capture
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1 h-px bg-glass-border"></div>
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-glass-border"></div>
              </div>

              <Button
                variant="outline"
                className="w-full glass-card border-glass-border btn-glow-effect"
                onClick={handleCameraClick}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload from Gallery
              </Button>
            </div>
          ) : (
            /* Results Interface */
            <div className="space-y-6">
              {/* Image Preview */}
              <Card className="glass-card border-glass-border overflow-hidden">
                <div className="relative">
                  <img
                    src={scannedImage}
                    alt="Scanned meal"
                    className="w-full h-48 object-cover"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center space-y-3">
                        <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto" />
                        <p className="text-white font-medium">Analyzing your meal...</p>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {!isScanning && detectedFoods.length > 0 && (
                <>
                  {/* Detection Results */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Utensils className="w-5 h-5 mr-2 text-accent animate-glow-pulse" />
                      Detected Foods
                    </h3>
                    
                    {detectedFoods.map((food, index) => (
                      <Card 
                        key={index}
                        className="glass-card border-glass-border animate-scale-in"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold">{food.name}</h4>
                              <p className="text-sm text-muted-foreground">{food.serving}</p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                food.confidence >= 90 ? "text-green-400 border-green-400" :
                                food.confidence >= 80 ? "text-yellow-400 border-yellow-400" :
                                "text-orange-400 border-orange-400"
                              )}
                            >
                              {food.confidence}% match
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-3 text-center">
                            <div>
                              <div className="text-sm font-bold">{food.calories}</div>
                              <div className="text-xs text-muted-foreground">cal</div>
                            </div>
                            <div>
                              <div className="text-sm font-bold" style={{ color: '#00BFFF' }}>{food.protein}g</div>
                              <div className="text-xs text-muted-foreground">protein</div>
                            </div>
                            <div>
                              <div className="text-sm font-bold" style={{ color: '#FFC107' }}>{food.carbs}g</div>
                              <div className="text-xs text-muted-foreground">carbs</div>
                            </div>
                            <div>
                              <div className="text-sm font-bold" style={{ color: '#FF6B6B' }}>{food.fat}g</div>
                              <div className="text-xs text-muted-foreground">fat</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Total Nutrition */}
                  <Card className="glass-card border-glass-border glow-accent">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-lg">
                        <Target className="w-5 h-5 mr-2 text-accent animate-glow" />
                        Total Nutrition
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">{totalNutrition.calories}</div>
                          <div className="text-sm text-muted-foreground">calories</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold" style={{ color: '#00BFFF' }}>{totalNutrition.protein.toFixed(1)}g</div>
                          <div className="text-sm text-muted-foreground">protein</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold" style={{ color: '#FFC107' }}>{totalNutrition.carbs.toFixed(1)}g</div>
                          <div className="text-sm text-muted-foreground">carbs</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold" style={{ color: '#FF6B6B' }}>{totalNutrition.fat.toFixed(1)}g</div>
                          <div className="text-sm text-muted-foreground">fat</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Meal Type Selection */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Add to:</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {mealTypes.map((meal) => (
                        <Button
                          key={meal.id}
                          variant={selectedMealType === meal.id ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "flex-col space-y-1 h-auto py-3",
                            selectedMealType === meal.id ? "glow-accent" : "glass-card"
                          )}
                          onClick={() => setSelectedMealType(meal.id)}
                        >
                          <span className="text-lg">{meal.icon}</span>
                          <span className="text-xs">{meal.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-glass-border">
          {scannedImage && !isScanning ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleRescan}
                className="flex-1 glass-card border-glass-border"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Rescan
              </Button>
              {detectedFoods.length > 0 && (
                <Button 
                  onClick={() => {
                    // Add all detected foods
                    detectedFoods.forEach(food => handleAddFood(food));
                  }}
                  className="flex-1 glow-accent hover:scale-105 transition-all duration-300 btn-glow-effect"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to {mealTypes.find(m => m.id === selectedMealType)?.label}
                </Button>
              )}
            </>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1 glass-card border-glass-border"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
