import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AnimatedLogoProps {
  className?: string;
  showStartupAnimation?: boolean;
}

export function AnimatedLogo({ className, showStartupAnimation = false }: AnimatedLogoProps) {
  const [hasAnimated, setHasAnimated] = useState(!showStartupAnimation);

  useEffect(() => {
    if (showStartupAnimation && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showStartupAnimation, hasAnimated]);

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Logo Background Glow */}
      <div className="absolute inset-0 logo-glow opacity-30 blur-xl animate-gradient-shift" />
      
      {/* Main Logo */}
      <div 
        className={cn(
          "relative z-10 font-bold bg-gradient-to-r from-primary via-accent to-glow-tertiary bg-clip-text text-transparent",
          showStartupAnimation && !hasAnimated ? "logo-startup" : "animate-glow-pulse",
          "transition-all duration-500"
        )}
        style={{
          backgroundSize: "200% 200%",
          animation: showStartupAnimation && !hasAnimated 
            ? "logo-entrance 2s ease-out forwards" 
            : "gradient-shift 4s ease-in-out infinite, glow-pulse 3s ease-in-out infinite"
        }}
      >
        FitRaze
      </div>

      {/* Floating Particles */}
      {hasAnimated && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-1 h-1 rounded-full opacity-60",
                i % 3 === 0 ? "bg-primary" : i % 3 === 1 ? "bg-accent" : "bg-glow-tertiary"
              )}
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${10 + (i * 10)}%`,
                animation: `float 3s ease-in-out infinite ${i * 0.5}s`,
                filter: "blur(0.5px)"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
