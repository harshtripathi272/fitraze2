import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplet, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

interface WaterAnimationProps {
  current: number;
  goal: number;
  className?: string;
  isAnimating?: boolean;
}

export function WaterAnimation({
  current,
  goal,
  className,
  isAnimating = false,
}: WaterAnimationProps) {
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; delay: number }>
  >([]);
  const percentage = Math.min((current / goal) * 100, 100);

  useEffect(() => {
    if (isAnimating) {
      // Create ripple effect when water is added
      const newRipples = Array.from({ length: 3 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 80 + 10, // Random position between 10% and 90%
        delay: i * 200,
      }));
      setRipples(newRipples);

      // Clear ripples after animation
      setTimeout(() => setRipples([]), 2000);
    }
  }, [isAnimating]);

  return (
    <div className={cn("relative w-32 h-40 mx-auto", className)}>
      {/* Water Container */}
      <div className="relative w-full h-full bg-gradient-to-t from-blue-950/20 to-blue-900/10 rounded-2xl border border-blue-500/30 overflow-hidden backdrop-blur-sm">
        {/* Water Fill */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 via-blue-400 to-cyan-300"
          initial={{ height: "0%" }}
          animate={{ height: `${percentage}%` }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            type: "spring",
            damping: 20,
          }}
          style={{
            borderRadius: percentage > 90 ? "0.75rem 0.75rem 0 0" : "0",
          }}
        >
          {/* Wave Animation */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/20 to-transparent"
              animate={{
                transform: [
                  "translateX(-100%) scaleY(0.8)",
                  "translateX(100%) scaleY(1.2)",
                  "translateX(-100%) scaleY(0.8)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                clipPath:
                  "polygon(0 50%, 25% 0%, 50% 50%, 75% 100%, 100% 50%, 100% 100%, 0 100%)",
              }}
            />

            {/* Secondary wave */}
            <motion.div
              className="absolute inset-x-0 top-2 h-6 bg-gradient-to-b from-white/10 to-transparent"
              animate={{
                transform: [
                  "translateX(100%) scaleY(1.2)",
                  "translateX(-100%) scaleY(0.8)",
                  "translateX(100%) scaleY(1.2)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              style={{
                clipPath:
                  "polygon(0 50%, 20% 100%, 40% 0%, 60% 80%, 80% 20%, 100% 60%, 100% 100%, 0 100%)",
              }}
            />
          </div>

          {/* Bubbles */}
          <AnimatePresence>
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: "100%",
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  y: "-20%",
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeOut",
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Ripple Effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              className="absolute border-2 border-white/30 rounded-full"
              style={{
                left: `${ripple.x}%`,
                top: `${100 - percentage}%`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ width: 0, height: 0, opacity: 0.8 }}
              animate={{
                width: 60,
                height: 60,
                opacity: 0,
                borderWidth: 0,
              }}
              transition={{
                duration: 1.5,
                delay: ripple.delay / 1000,
                ease: "easeOut",
              }}
              exit={{ opacity: 0 }}
            />
          ))}
        </AnimatePresence>

        {/* Measurement Lines */}
        <div className="absolute inset-y-0 left-0 w-full pointer-events-none">
          {[25, 50, 75].map((mark) => (
            <div
              key={mark}
              className="absolute left-0 w-3 h-px bg-white/20"
              style={{ bottom: `${mark}%` }}
            >
              <div className="absolute left-4 -top-2 text-xs text-white/60 font-mono">
                {((goal * mark) / 100).toFixed(1)}L
              </div>
            </div>
          ))}
        </div>

        {/* Overflow Indicator */}
        {percentage >= 100 && (
          <motion.div
            className="absolute -top-2 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              <Droplet className="w-3 h-3" />
              <span>Goal Achieved!</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Water Level Display */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center"
        animate={{ scale: isAnimating ? 1.1 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-lg font-bold text-primary">
          {current.toFixed(1)}L
        </div>
        <div className="text-xs text-muted-foreground">
          of {goal.toFixed(1)}L
        </div>
      </motion.div>

      {/* Add Water Droplet Effect */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="absolute top-4 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, scale: 0, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Droplet className="w-6 h-6 text-blue-400 drop-shadow-lg animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Modern Water Glass Component for Logging
export function WaterGlass({
  fillPercentage = 0,
  isActive = false,
  onClick,
  className,
}: {
  fillPercentage?: number;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(
        "relative w-16 h-20 cursor-pointer transition-all duration-300",
        isActive && "scale-110",
        className,
      )}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glass Container */}
      <div className="relative w-full h-full bg-gradient-to-t from-gray-800/20 to-gray-700/10 rounded-lg border border-gray-500/30 overflow-hidden">
        {/* Water Fill */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-cyan-400"
          initial={{ height: "0%" }}
          animate={{ height: `${Math.min(fillPercentage, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Mini wave effect */}
          <motion.div
            className="absolute inset-x-0 top-0 h-2 bg-white/20"
            animate={{
              transform: [
                "translateX(-50%)",
                "translateX(50%)",
                "translateX(-50%)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              clipPath: "polygon(0 50%, 50% 100%, 100% 50%, 100% 100%, 0 100%)",
            }}
          />
        </motion.div>

        {/* Glass Shine */}
        <div className="absolute top-2 left-2 w-1 h-6 bg-gradient-to-b from-white/40 to-transparent rounded-full" />
      </div>

      {/* Selection Ring */}
      {isActive && (
        <motion.div
          className="absolute -inset-1 border-2 border-blue-400 rounded-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
