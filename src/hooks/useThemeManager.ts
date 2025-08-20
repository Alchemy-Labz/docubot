'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export type ThemeType = 'business' | 'neon';
export type ThemeMode = 'light' | 'dark';
export type ThemeName = 'business-light' | 'business-dark' | 'neon-light' | 'neon-dark';

interface ThemeManagerReturn {
  // Current theme state
  themeType: ThemeType;
  themeMode: ThemeMode;
  currentTheme: ThemeName;
  
  // Theme setters
  setThemeType: (type: ThemeType) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setTheme: (theme: ThemeName) => void;
  
  // Utility functions
  toggleMode: () => void;
  isBusinessTheme: boolean;
  isNeonTheme: boolean;
  isDarkMode: boolean;
  isLightMode: boolean;
  
  // Loading state
  mounted: boolean;
}

/**
 * Custom hook for managing dual-axis theming system
 * Provides business/neon theme types with light/dark modes
 */
export function useThemeManager(): ThemeManagerReturn {
  const { theme, setTheme: setNextTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Parse current theme into type and mode
  const parseTheme = (themeName: string | undefined): { type: ThemeType; mode: ThemeMode } => {
    if (!themeName) return { type: 'business', mode: 'light' };
    
    if (themeName.startsWith('business-')) {
      return {
        type: 'business',
        mode: themeName.endsWith('-dark') ? 'dark' : 'light'
      };
    }
    
    if (themeName.startsWith('neon-')) {
      return {
        type: 'neon',
        mode: themeName.endsWith('-dark') ? 'dark' : 'light'
      };
    }
    
    // Handle legacy themes
    if (themeName === 'dark') return { type: 'neon', mode: 'dark' };
    if (themeName === 'light') return { type: 'neon', mode: 'light' };
    
    // Default fallback
    return { type: 'business', mode: 'light' };
  };

  const { type: themeType, mode: themeMode } = parseTheme(theme);
  const currentTheme: ThemeName = `${themeType}-${themeMode}`;

  // Construct theme name from type and mode
  const constructTheme = (type: ThemeType, mode: ThemeMode): ThemeName => {
    return `${type}-${mode}`;
  };

  // Set theme type while preserving mode
  const setThemeType = (type: ThemeType) => {
    const newTheme = constructTheme(type, themeMode);
    setNextTheme(newTheme);
  };

  // Set theme mode while preserving type
  const setThemeMode = (mode: ThemeMode) => {
    const newTheme = constructTheme(themeType, mode);
    setNextTheme(newTheme);
  };

  // Set complete theme
  const setTheme = (newTheme: ThemeName) => {
    setNextTheme(newTheme);
  };

  // Toggle between light and dark mode
  const toggleMode = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  // Computed properties
  const isBusinessTheme = themeType === 'business';
  const isNeonTheme = themeType === 'neon';
  const isDarkMode = themeMode === 'dark';
  const isLightMode = themeMode === 'light';

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-detect system theme preference on first load
  useEffect(() => {
    if (mounted && !theme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? 'business-dark' : 'business-light';
      setNextTheme(defaultTheme);
    }
  }, [mounted, theme, setNextTheme]);

  return {
    // Current state
    themeType,
    themeMode,
    currentTheme,
    
    // Setters
    setThemeType,
    setThemeMode,
    setTheme,
    
    // Utilities
    toggleMode,
    isBusinessTheme,
    isNeonTheme,
    isDarkMode,
    isLightMode,
    
    // Loading
    mounted,
  };
}

/**
 * Get theme-specific CSS classes for components
 */
export function getThemeClasses(themeType: ThemeType, themeMode: ThemeMode) {
  const baseClasses = {
    business: {
      light: 'bg-white text-gray-900 border-gray-200',
      dark: 'bg-gray-900 text-white border-gray-800'
    },
    neon: {
      light: 'bg-light-100 text-dark-900 border-light-300',
      dark: 'bg-dark-900 text-light-100 border-dark-700'
    }
  };

  return baseClasses[themeType][themeMode];
}

/**
 * Get theme-specific accent colors
 */
export function getAccentColor(themeType: ThemeType): string {
  return themeType === 'business' ? '#2563eb' : '#5029a6';
}
