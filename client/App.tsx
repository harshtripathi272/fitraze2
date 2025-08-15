import React, { useState, useEffect } from "react";
import "./global.css";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MobileNavigation } from "./components/MobileNavigation";
import { StartupSplash } from "./components/StartupSplash";
import Login from "./pages/Login";
import HealthQuestionnaire from "./pages/HealthQuestionnaire";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import MealPlanning from "./pages/MealPlanning";
import AccountInfo from "./pages/AccountInfo";
import ProgressTracking from "./pages/ProgressTracking";
import FitnessGoals from "./pages/FitnessGoals";
import HealthMetrics from "./pages/HealthMetrics";
import Analytics from "./pages/Analytics";
import DailyLog from "./pages/DailyLog";
import Chat from "./pages/Chat";
import QuickAddFood from "./pages/QuickAddFood";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  isNewUser: boolean;
  hasCompletedQuestionnaire?: boolean;
}

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] =
    useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash) {
      setShowSplash(false);
      setIsFirstLoad(false);
    }

    const savedUser = localStorage.getItem("fitRazeUser");
    const token = localStorage.getItem("access_token");

    if (savedUser && token) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
      setHasCompletedQuestionnaire(userData.hasCompletedQuestionnaire || false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("hasSeenSplash", "true");
    setShowSplash(false);
    setIsFirstLoad(false);
  };

  const handleLogin = (loginData: any, isNewUser: boolean) => {
    const updatedUser: User = {
      userId: loginData.user_id, // Use the key from the API response
      firstName: loginData.firstName,
      lastName: loginData.lastName,
      email: loginData.email,
      isNewUser: isNewUser,
      hasCompletedQuestionnaire: !isNewUser,
    };
    setUser(updatedUser);
    setIsAuthenticated(true);
    localStorage.setItem("fitRazeUser", JSON.stringify(updatedUser)); // <-- Saves the complete user object
    localStorage.setItem("access_token", loginData.access_token); // <-- Save the token
    
    if (!isNewUser) {
      navigate("/");
    }
  };
  const handleQuestionnaireComplete = () => {
    setHasCompletedQuestionnaire(true);
    if (user) {
      const updatedUser = { ...user, hasCompletedQuestionnaire: true, isNewUser: false };
      setUser(updatedUser);
      localStorage.setItem("fitRazeUser", JSON.stringify(updatedUser));
    }
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setHasCompletedQuestionnaire(false);
    localStorage.clear();
    navigate("/");
  };

  if (showSplash && isFirstLoad) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <StartupSplash onComplete={handleSplashComplete} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Login onLogin={handleLogin} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  if (user?.isNewUser && !hasCompletedQuestionnaire) {
    // FIX: The 'token' variable is now defined here before being used.
    const token = localStorage.getItem("access_token");
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HealthQuestionnaire
            onComplete={handleQuestionnaireComplete}
            userName={user.firstName}
            userId={user.userId} // <-- Add this prop
            token={token!}      // <-- Add this prop
          />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background text-foreground pb-14 sm:pb-16">
          <Routes>
            <Route
              path="/"
              element={<Index user={user} onLogout={handleLogout} />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/meal-planning" element={<MealPlanning />} />
            <Route path="/account-info" element={<AccountInfo />} />
            <Route path="/progress-tracking" element={<ProgressTracking />} />
            <Route path="/fitness-goals" element={<FitnessGoals />} />
            <Route path="/health-metrics" element={<HealthMetrics />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/daily-log" element={<DailyLog />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/quick-add-food" element={<QuickAddFood />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MobileNavigation />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Wrap App in BrowserRouter to provide routing context


export default App;
