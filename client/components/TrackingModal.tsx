import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "./ProgressRing";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  icon: any;
  title: string;
  current: number;
  goal?: number;
  unit: string;
  color: "primary" | "accent" | "success" | "warning";
  children: React.ReactNode;
}

export function TrackingModal({
  open,
  onOpenChange,
  id,
  icon: Icon,
  title,
  current,
  goal,
  unit,
  color,
  children,
}: TrackingModalProps) {
  const progress = goal ? (current / goal) * 100 : 0;

  // Dynamic icon color based on progress
  const getIconColor = () => {
    if (progress >= 100) return "text-green-400";
    if (progress >= 75) return "text-primary";
    if (progress >= 50) return "text-yellow-400";
    return "text-gray-400";
  };

  const getProgressStatus = () => {
    if (progress >= 100)
      return { text: "Goal Achieved!", color: "text-green-400" };
    if (progress >= 90)
      return { text: "Almost there!", color: "text-yellow-400" };
    if (progress >= 50) return { text: "Good progress", color: "text-primary" };
    return { text: "Keep going!", color: "text-muted-foreground" };
  };

  const status = getProgressStatus();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="glass-enhanced border-glass-border max-w-md mx-auto max-h-[85vh] overflow-hidden animate-fade-in-up"
        style={{
          background: "rgba(0, 40, 51, 0.95)",
          backdropFilter: "blur(25px)",
          animation: "modalSlideUp 300ms ease-in-out",
        }}
      >

        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center text-xl font-bold pr-8">
            <Icon
              className={cn(
                "w-6 h-6 mr-3 animate-glow",
                getIconColor(),
                progress >= 100 && "animate-pulse",
              )}
            />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[calc(85vh-140px)] overflow-y-auto pr-2">
          {/* Progress Overview */}
          <div className="glass-card p-4 rounded-2xl border border-glass-border glow-accent">
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <ProgressRing
                  progress={progress}
                  size={80}
                  color={color}
                  className="glow-accent"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {Math.round(progress)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      progress
                    </div>
                  </div>
                </ProgressRing>
              </div>

              <div className="flex-1 ml-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Current:
                  </span>
                  <span className="text-lg font-bold">
                    {Number(current).toFixed(2)} {unit}
                  </span>
                </div>
                {goal && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Goal:</span>
                    <span className="text-sm font-medium">
                      {goal} {unit}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge
                    variant="outline"
                    className={cn("glass text-xs", status.color)}
                  >
                    {status.text}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {goal && (
              <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-1000 progress-fill",
                    color === "primary" && "bg-primary",
                    color === "accent" && "bg-accent",
                    color === "success" && "bg-green-400",
                    color === "warning" && "bg-yellow-400",
                  )}
                  style={
                    {
                      "--progress-width": `${Math.min(progress, 100)}%`,
                      filter:
                        progress >= 100
                          ? "drop-shadow(0 0 8px currentColor)"
                          : "none",
                    } as React.CSSProperties
                  }
                />
              </div>
            )}
          </div>

          {/* Detailed Content */}
          <div className="glass-card p-4 rounded-2xl border border-glass-border">
            <div className="animate-slide-in-up">{children}</div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full max-w-xs glass-card border-glass-border hover:scale-105 transition-all duration-300"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Add the modal animation keyframes to global CSS
const modalStyles = `
@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 300ms ease-in-out;
}
`;

// Inject styles if not already present
if (
  typeof document !== "undefined" &&
  !document.getElementById("tracking-modal-styles")
) {
  const style = document.createElement("style");
  style.id = "tracking-modal-styles";
  style.textContent = modalStyles;
  document.head.appendChild(style);
}
