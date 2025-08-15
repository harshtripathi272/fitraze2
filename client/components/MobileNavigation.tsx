import { Link, useLocation } from "react-router-dom";
import { Home, User, BarChart3, Calendar, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/daily-log", icon: Calendar, label: "Log" },
  { path: "/analytics", icon: BarChart3, label: "Stats" },
  { path: "/chat", icon: MessageCircle, label: "Chat" },
];

export function MobileNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-glass-border safe-area-inset-bottom">
      <div className="flex items-center justify-around h-14 sm:h-16 px-2 sm:px-4">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 p-1.5 sm:p-2 rounded-lg transition-all duration-300 min-w-[60px] sm:min-w-[70px]",
                isActive
                  ? "text-primary glow-accent animate-glow"
                  : "text-muted-foreground hover:text-foreground active:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", isActive && "scale-110")} />
              <span className="text-[10px] sm:text-xs font-medium leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
