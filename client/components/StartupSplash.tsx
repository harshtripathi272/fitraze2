import { useState, useEffect } from "react";
import { AnimatedLogo } from "./AnimatedLogo";

interface StartupSplashProps {
  onComplete: () => void;
}

export function StartupSplash({ onComplete }: StartupSplashProps) {
  const [phase, setPhase] = useState<'loading' | 'logo' | 'complete'>('loading');

  useEffect(() => {
    // Loading phase
    const loadingTimer = setTimeout(() => {
      setPhase('logo');
    }, 300);

    // Logo animation phase
    const logoTimer = setTimeout(() => {
      setPhase('complete');
    }, 2300);

    // Complete and navigate
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/80 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at center, 
              hsla(var(--glow-primary), 0.1) 0%, 
              hsla(var(--glow-secondary), 0.05) 50%, 
              transparent 70%)`
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo Container */}
        <div 
          className={`transform transition-all duration-1000 ease-out ${
            phase === 'loading' 
              ? 'scale-0 opacity-0 blur-xl' 
              : phase === 'logo'
                ? 'scale-100 opacity-100 blur-0'
                : 'scale-110 opacity-90 blur-0'
          }`}
        >
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute inset-0 scale-150 opacity-60">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-primary via-accent to-glow-tertiary animate-glow-pulse" 
                   style={{ filter: 'blur(30px)' }} />
            </div>
            
            {/* Logo */}
            <div className="relative z-10 text-6xl sm:text-7xl md:text-8xl font-bold">
              <AnimatedLogo showStartupAnimation={phase === 'logo'} />
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        <div 
          className={`transform transition-all duration-700 delay-500 ${
            phase === 'loading' || phase === 'logo'
              ? 'scale-100 opacity-100' 
              : 'scale-0 opacity-0'
          }`}
        >
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-bounce glow"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Tagline */}
        <div 
          className={`transform transition-all duration-700 delay-1000 ${
            phase === 'logo'
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-4 opacity-0'
          }`}
        >
          <p className="text-muted-foreground text-sm sm:text-base font-medium tracking-wide">
            Your Fitness Journey Starts Here
          </p>
        </div>
      </div>

      {/* Exit Animation */}
      <div 
        className={`absolute inset-0 bg-background transition-opacity duration-500 ${
          phase === 'complete' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
