import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

const colorPalettes = [
  { name: 'Cyan', value: 'cyan', color: 'bg-cyan-500' },
  { name: 'Purple', value: 'purple', color: 'bg-purple-500' },
  { name: 'Green', value: 'green', color: 'bg-green-500' },
  { name: 'Orange', value: 'orange', color: 'bg-orange-500' },
  { name: 'Pink', value: 'pink', color: 'bg-pink-500' },
  { name: 'Blue', value: 'blue', color: 'bg-blue-500' },
] as const;

export function ThemeToggler() {
  const { theme, colorPalette, toggleTheme, setColorPalette } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      {/* Theme Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="glass-card hover:glow-soft transition-all duration-300"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-primary animate-glow" />
        ) : (
          <Moon className="w-5 h-5 text-primary animate-glow" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Color Palette Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="glass-card hover:glow-soft transition-all duration-300"
          >
            <Palette className="w-5 h-5 text-primary animate-glow" />
            <span className="sr-only">Choose color palette</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass-card border-glass-border w-48">
          <DropdownMenuLabel className="text-sm font-semibold">
            Color Palette
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-glass-border" />
          {colorPalettes.map((palette) => (
            <DropdownMenuItem
              key={palette.value}
              onClick={() => setColorPalette(palette.value)}
              className={cn(
                "cursor-pointer flex items-center space-x-3 py-2",
                colorPalette === palette.value && "bg-primary/20"
              )}
            >
              <div className={cn("w-4 h-4 rounded-full", palette.color)} />
              <span className="flex-1">{palette.name}</span>
              {colorPalette === palette.value && (
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}