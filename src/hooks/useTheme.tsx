'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type ThemeMode = 'dark' | 'green' | 'yellow' | 'blue' | 'sky';

export interface ThemeConfig {
  key: ThemeMode;
  label: string;
  emoji: string;
  previewColor: string;
}

export const THEMES: ThemeConfig[] = [
  { key: 'dark', label: 'Dark', emoji: '🌑', previewColor: '#6366f1' },
  { key: 'green', label: 'Green', emoji: '🌿', previewColor: '#10b981' },
  { key: 'yellow', label: 'Yellow', emoji: '🌻', previewColor: '#f59e0b' },
  { key: 'blue', label: 'Blue', emoji: '🌊', previewColor: '#3b82f6' },
  { key: 'sky', label: 'Sky', emoji: '☁️', previewColor: '#06b6d4' },
];

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  themeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('iitb-theme') as ThemeMode | null;
    if (stored && THEMES.some((t) => t.key === stored)) {
      setThemeState(stored);
    }
    setMounted(true);
  }, []);

  // Apply theme attribute to html element
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('iitb-theme', newTheme);
  }, []);

  const themeConfig = useMemo(
    () => THEMES.find((t) => t.key === theme) || THEMES[0],
    [theme],
  );

  const value = useMemo(
    () => ({ theme, setTheme, themeConfig }),
    [theme, setTheme, themeConfig],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
