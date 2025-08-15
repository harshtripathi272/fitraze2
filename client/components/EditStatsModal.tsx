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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Scale, 
  Ruler, 
  Calendar, 
  Activity, 
  Target, 
  Trophy,
  Save,
  X,
  Calculator
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserStats {
  currentWeight: number;
  goalWeight: number;
  height: number;
  age: number;
  bodyFat: number;
  muscleMass: number;
}

interface EditStatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStats: UserStats;
  onSave: (stats: UserStats) => void;
}

export function EditStatsModal({ 
  open, 
  onOpenChange, 
  initialStats, 
  onSave 
}: EditStatsModalProps) {
  const [stats, setStats] = useState<UserStats>(initialStats);
  const [errors, setErrors] = useState<Partial<UserStats>>({});

  useEffect(() => {
    setStats(initialStats);
    setErrors({});
  }, [initialStats, open]);

  // Auto-calculate BMI
  const calculateBMI = (weight: number, height: number) => {
    if (weight > 0 && height > 0) {
      return (weight / Math.pow(height / 100, 2)).toFixed(1);
    }
    return "0.0";
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: "Underweight", color: "text-blue-400" };
    if (bmi < 25) return { status: "Normal", color: "text-green-400" };
    if (bmi < 30) return { status: "Overweight", color: "text-yellow-400" };
    return { status: "Obese", color: "text-red-400" };
  };

  const handleInputChange = (field: keyof UserStats, value: string) => {
    const numValue = parseFloat(value) || 0;
    setStats(prev => ({ ...prev, [field]: numValue }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStats = () => {
    const newErrors: Partial<UserStats> = {};
    
    if (stats.currentWeight <= 0 || stats.currentWeight > 300) {
      newErrors.currentWeight = stats.currentWeight;
    }
    if (stats.goalWeight <= 0 || stats.goalWeight > 300) {
      newErrors.goalWeight = stats.goalWeight;
    }
    if (stats.height <= 0 || stats.height > 250) {
      newErrors.height = stats.height;
    }
    if (stats.age <= 0 || stats.age > 120) {
      newErrors.age = stats.age;
    }
    if (stats.bodyFat < 0 || stats.bodyFat > 50) {
      newErrors.bodyFat = stats.bodyFat;
    }
    if (stats.muscleMass <= 0 || stats.muscleMass > 150) {
      newErrors.muscleMass = stats.muscleMass;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateStats()) {
      onSave(stats);
      onOpenChange(false);
    }
  };

  const currentBMI = parseFloat(calculateBMI(stats.currentWeight, stats.height));
  const bmiStatus = getBMIStatus(currentBMI);

  const statFields = [
    {
      key: 'currentWeight' as keyof UserStats,
      label: 'Current Weight',
      icon: Scale,
      unit: 'kg',
      placeholder: '75.0',
      min: 30,
      max: 300,
      step: 0.1
    },
    {
      key: 'goalWeight' as keyof UserStats,
      label: 'Goal Weight',
      icon: Target,
      unit: 'kg',
      placeholder: '70.0',
      min: 30,
      max: 300,
      step: 0.1
    },
    {
      key: 'height' as keyof UserStats,
      label: 'Height',
      icon: Ruler,
      unit: 'cm',
      placeholder: '175',
      min: 100,
      max: 250,
      step: 1
    },
    {
      key: 'age' as keyof UserStats,
      label: 'Age',
      icon: Calendar,
      unit: 'years',
      placeholder: '28',
      min: 13,
      max: 120,
      step: 1
    },
    {
      key: 'bodyFat' as keyof UserStats,
      label: 'Body Fat',
      icon: Activity,
      unit: '%',
      placeholder: '15',
      min: 5,
      max: 50,
      step: 0.1
    },
    {
      key: 'muscleMass' as keyof UserStats,
      label: 'Muscle Mass',
      icon: Trophy,
      unit: 'kg',
      placeholder: '65',
      min: 20,
      max: 150,
      step: 0.1
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-enhanced border-glass-border max-w-2xl mx-auto max-h-[90vh] overflow-hidden modal-content">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center text-xl font-bold">
            <Calculator className="w-6 h-6 mr-3 text-primary animate-glow" />
            Edit Health Stats
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Update your health metrics for accurate tracking and recommendations
          </p>
        </DialogHeader>

        <div className="space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto pr-2">
          {/* BMI Calculation Card */}
          <Card className="glass-card border-glass-border glow-accent">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Calculator className="w-5 h-5 mr-2 text-accent animate-glow-pulse" />
                Auto-Calculated BMI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-primary">{calculateBMI(stats.currentWeight, stats.height)}</div>
                  <div className="text-sm text-muted-foreground">Body Mass Index</div>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn("glass text-sm", bmiStatus.color)}
                >
                  {bmiStatus.status}
                </Badge>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Calculated from weight and height • Updates automatically
              </div>
            </CardContent>
          </Card>

          {/* Stats Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statFields.map((field, index) => {
              const Icon = field.icon;
              const hasError = errors[field.key] !== undefined;
              
              return (
                <Card 
                  key={field.key}
                  className={cn(
                    "glass-card border-glass-border transition-all duration-300",
                    hasError ? "border-red-500/50 glow" : "hover:glow-accent",
                    "animate-scale-in"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Icon className={cn(
                        "w-5 h-5 animate-glow",
                        hasError ? "text-red-400" : "text-primary"
                      )} />
                      <Label 
                        htmlFor={field.key}
                        className="font-medium"
                      >
                        {field.label}
                      </Label>
                    </div>
                    
                    <div className="relative">
                      <Input
                        id={field.key}
                        type="number"
                        value={stats[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        className={cn(
                          "glass-card border-glass-border text-right pr-12",
                          hasError && "border-red-500/50"
                        )}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {field.unit}
                      </span>
                    </div>
                    
                    {hasError && (
                      <p className="text-xs text-red-400 mt-2 animate-slide-from-left">
                        Please enter a valid {field.label.toLowerCase()} ({field.min}-{field.max} {field.unit})
                      </p>
                    )}
                    
                    <div className="text-xs text-muted-foreground mt-2">
                      Range: {field.min}-{field.max} {field.unit}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Progress Indicators */}
          <Card className="glass-card border-glass-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Target className="w-5 h-5 mr-2 text-green-400 animate-glow" />
                Weight Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span>Current: {stats.currentWeight}kg</span>
                <span>Goal: {stats.goalWeight}kg</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-green-400 progress-fill"
                  style={{ 
                    '--progress-width': `${Math.min(Math.max((stats.currentWeight / stats.goalWeight) * 100, 10), 100)}%`
                  } as React.CSSProperties}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats.currentWeight > stats.goalWeight ? 
                  `${(stats.currentWeight - stats.goalWeight).toFixed(1)}kg to lose` :
                  `${(stats.goalWeight - stats.currentWeight).toFixed(1)}kg to goal`}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-glass-border">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 glass-card border-glass-border"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="flex-1 glow-accent hover:scale-105 transition-all duration-300 btn-glow-effect"
            disabled={Object.keys(errors).length > 0}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
