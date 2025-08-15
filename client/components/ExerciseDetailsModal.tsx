import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  CheckCircle2,
  Target,
  AlertTriangle,
  Activity,
  Timer,
  Dumbbell,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: {
    id: string;
    name: string;
    muscle: string;
    description: string;
    videoId?: string;
    tips: string;
    precautions: string[];
    targetMuscles: string[];
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    equipment: string[];
  } | null;
  onMarkComplete?: () => void;
}

const muscleGroupColors = {
  chest: "bg-red-500/20 text-red-400 border-red-500/30",
  back: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  shoulders: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  arms: "bg-green-500/20 text-green-400 border-green-500/30",
  legs: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  core: "bg-orange-500/20 text-orange-400 border-orange-500/30"
};

const difficultyColors = {
  Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30"
};

export function ExerciseDetailsModal({ 
  open, 
  onOpenChange, 
  exercise, 
  onMarkComplete 
}: ExerciseDetailsModalProps) {
  if (!exercise) return null;

  const handleVideoClick = () => {
    if (exercise.videoId) {
      window.open(`https://youtube.com/watch?v=${exercise.videoId}`, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-glass-border max-w-2xl mx-auto max-h-[90vh] overflow-hidden animate-slide-up">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center text-xl font-bold">
            <Dumbbell className="w-6 h-6 mr-3 text-primary animate-glow" />
            {exercise.name}
          </DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant="outline" 
              className={cn("glass text-xs", muscleGroupColors[exercise.muscle as keyof typeof muscleGroupColors])}
            >
              <Target className="w-3 h-3 mr-1" />
              {exercise.muscle.charAt(0).toUpperCase() + exercise.muscle.slice(1)}
            </Badge>
            <Badge 
              variant="outline" 
              className={cn("glass text-xs", difficultyColors[exercise.difficulty])}
            >
              {exercise.difficulty}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto pr-2">
          {/* YouTube Video Section */}
          {exercise.videoId && (
            <Card className="glass-card border-glass-border glow-accent">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Play className="w-5 h-5 mr-2 text-accent animate-glow-pulse" />
                  Exercise Demonstration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* YouTube Thumbnail with Play Button Overlay */}
                  <div 
                    className="relative bg-black rounded-lg overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all duration-300"
                    onClick={handleVideoClick}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${exercise.videoId}/maxresdefault.jpg`}
                      alt={`${exercise.name} demonstration`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        // Fallback to high quality thumbnail if maxres doesn't exist
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${exercise.videoId}/hqdefault.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <ExternalLink className="w-4 h-4 text-white/80" />
                    </div>
                  </div>
                  <Button
                    onClick={handleVideoClick}
                    className="w-full mt-3 glow-accent"
                    variant="outline"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch on YouTube
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exercise Description */}
          <Card className="glass-card border-glass-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Activity className="w-5 h-5 mr-2 text-primary animate-glow" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {exercise.description}
              </p>
            </CardContent>
          </Card>

          {/* Target Muscles */}
          <Card className="glass-card border-glass-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Target className="w-5 h-5 mr-2 text-accent animate-glow-pulse" />
                Target Muscles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {exercise.targetMuscles.map((muscle, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="glass glow text-xs animate-slide-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {muscle}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Equipment Needed */}
          <Card className="glass-card border-glass-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Dumbbell className="w-5 h-5 mr-2 text-glow-tertiary animate-glow" />
                Equipment Needed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {exercise.equipment.map((item, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="glass text-xs animate-slide-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exercise Tips */}
          <Card className="glass-card border-glass-border glow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400 animate-glow" />
                Form Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-3">
                {exercise.tips}
              </p>
            </CardContent>
          </Card>

          {/* Precautions */}
          {exercise.precautions.length > 0 && (
            <Card className="glass-card border-glass-border border-yellow-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400 animate-pulse" />
                  Safety Precautions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {exercise.precautions.map((precaution, index) => (
                    <li 
                      key={index}
                      className="flex items-start space-x-2 text-sm text-muted-foreground animate-slide-in-up"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>{precaution}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-glass-border">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 glass-card border-glass-border"
          >
            Close
          </Button>
          {onMarkComplete && (
            <Button 
              onClick={() => {
                onMarkComplete();
                onOpenChange(false);
              }}
              className="flex-1 glow-accent hover:scale-105 transition-all duration-300"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
