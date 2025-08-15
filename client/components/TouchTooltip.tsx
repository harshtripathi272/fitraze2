import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCalories, formatWeight, formatDecimal } from "@/lib/formatters";

interface TouchTooltipProps {
  isVisible: boolean;
  onClose: () => void;
  data: {
    date: string | Date;
    value: number;
    label: string;
    unit: string;
    trend?: "up" | "down" | "stable";
    goal?: number;
    type: "calorie" | "weight" | "macro";
    color?: string;
  };
  position?: { x: number; y: number };
}

export function TouchTooltip({
  isVisible,
  onClose,
  data,
  position,
}: TouchTooltipProps) {
  const formatValue = (value: number, type: string) => {
    switch (type) {
      case "calorie":
        return formatCalories(value);
      case "weight":
        return formatWeight(value);
      default:
        return formatDecimal(value);
    }
  };

  const getTrendIcon = () => {
    switch (data.trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getProgressPercentage = () => {
    if (!data.goal) return null;
    return Math.round((data.value / data.goal) * 100);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-50"
            onClick={onClose}
          />

          {/* Tooltip Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed z-50"
            style={{
              left: position?.x
                ? `${Math.min(position.x - 150, window.innerWidth - 320)}px`
                : "50%",
              top: position?.y ? `${Math.max(position.y - 100, 20)}px` : "50%",
              transform: !position ? "translate(-50%, -50%)" : undefined,
            }}
          >
            <Card className="glass-card border-glass-border w-80 shadow-2xl">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      {format(new Date(data.date), "MMM d, yyyy")}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Main Value */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: data.color || "#3b82f6" }}
                    >
                      {formatValue(data.value, data.type)}
                    </span>
                    <span className="text-lg text-muted-foreground">
                      {data.unit}
                    </span>
                    {getTrendIcon()}
                  </div>
                  <p className="text-sm text-muted-foreground">{data.label}</p>
                </div>

                {/* Goal Progress */}
                {data.goal && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Goal Progress
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "glass",
                          getProgressPercentage()! >= 100
                            ? "text-green-500 border-green-500/30"
                            : "text-primary border-primary/30",
                        )}
                      >
                        {getProgressPercentage()}%
                      </Badge>
                    </div>

                    <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(getProgressPercentage()!, 100)}%`,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Current: {formatValue(data.value, data.type)}{" "}
                        {data.unit}
                      </span>
                      <span>
                        Goal: {formatValue(data.goal, data.type)} {data.unit}
                      </span>
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="mt-4 pt-3 border-t border-glass-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Tap anywhere to close</span>
                    {data.trend && (
                      <span className="flex items-center space-x-1">
                        <span>Trend:</span>
                        {getTrendIcon()}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Touch-friendly chart wrapper
export function TouchChart({
  children,
  onDataPointClick,
}: {
  children: React.ReactNode;
  onDataPointClick?: (data: any, event: any) => void;
}) {
  const [touchTimeout, setTouchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleTouchStart = (event: React.TouchEvent) => {
    const timeout = setTimeout(() => {
      // Long press detected - simulate click
      const touch = event.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);

      if (element && onDataPointClick) {
        // Extract data from element or trigger click
        element.dispatchEvent(
          new MouseEvent("click", {
            clientX: touch.clientX,
            clientY: touch.clientY,
            bubbles: true,
          }),
        );
      }
    }, 200); // 200ms long press

    setTouchTimeout(timeout);
  };

  const handleTouchEnd = () => {
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      setTouchTimeout(null);
    }
  };

  return (
    <div
      className="touch-chart-wrapper"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {children}
    </div>
  );
}

// Custom hook for touch-optimized chart interactions
export function useTouchChart() {
  const [activeTooltip, setActiveTooltip] = useState<{
    data: any;
    position: { x: number; y: number };
  } | null>(null);

  const showTooltip = (data: any, event: any) => {
    const rect = event.currentTarget?.getBoundingClientRect();
    const x = event.clientX || rect?.left + rect?.width / 2;
    const y = event.clientY || rect?.top + rect?.height / 2;

    setActiveTooltip({
      data,
      position: { x, y },
    });
  };

  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  return {
    activeTooltip,
    showTooltip,
    hideTooltip,
  };
}
