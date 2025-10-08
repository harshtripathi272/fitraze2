import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type ColorPalette = 'cyan' | 'purple' | 'green' | 'orange' | 'pink' | 'blue';

interface ThemeContextType {
  theme: Theme;
  colorPalette: ColorPalette;
  setTheme: (theme: Theme) => void;
  setColorPalette: (palette: ColorPalette) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'dark';
  });

  const [colorPalette, setColorPaletteState] = useState<ColorPalette>(() => {
    const saved = localStorage.getItem('colorPalette');
    return (saved as ColorPalette) || 'cyan';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', colorPalette);
    localStorage.setItem('colorPalette', colorPalette);
  }, [colorPalette]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setColorPalette = (palette: ColorPalette) => {
    setColorPaletteState(palette);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, colorPalette, setTheme, setColorPalette, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}