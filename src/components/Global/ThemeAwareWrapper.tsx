'use client';

import React from 'react';
import { useThemeManager } from '@/hooks/useThemeManager';
import { cn } from '@/util/utils';

interface ThemeAwareWrapperProps {
  children: React.ReactNode;
  className?: string;
  businessClassName?: string;
  neonClassName?: string;
  lightClassName?: string;
  darkClassName?: string;
  businessLightClassName?: string;
  businessDarkClassName?: string;
  neonLightClassName?: string;
  neonDarkClassName?: string;
}

/**
 * A wrapper component that applies theme-specific classes based on current theme
 */
export function ThemeAwareWrapper({
  children,
  className,
  businessClassName,
  neonClassName,
  lightClassName,
  darkClassName,
  businessLightClassName,
  businessDarkClassName,
  neonLightClassName,
  neonDarkClassName,
}: ThemeAwareWrapperProps) {
  const { themeType, themeMode, isBusinessTheme, isNeonTheme, isDarkMode, isLightMode, mounted } = useThemeManager();

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  const themeClasses = cn(
    className,
    // Theme type classes
    isBusinessTheme && businessClassName,
    isNeonTheme && neonClassName,
    // Mode classes
    isLightMode && lightClassName,
    isDarkMode && darkClassName,
    // Specific combination classes
    isBusinessTheme && isLightMode && businessLightClassName,
    isBusinessTheme && isDarkMode && businessDarkClassName,
    isNeonTheme && isLightMode && neonLightClassName,
    isNeonTheme && isDarkMode && neonDarkClassName
  );

  return <div className={themeClasses}>{children}</div>;
}

/**
 * Hook to get theme-specific classes
 */
export function useThemeClasses() {
  const { themeType, themeMode, isBusinessTheme, isNeonTheme, isDarkMode, isLightMode, mounted } = useThemeManager();

  const getClasses = (options: {
    base?: string;
    business?: string;
    neon?: string;
    light?: string;
    dark?: string;
    businessLight?: string;
    businessDark?: string;
    neonLight?: string;
    neonDark?: string;
  }) => {
    if (!mounted) return options.base || '';

    return cn(
      options.base,
      isBusinessTheme && options.business,
      isNeonTheme && options.neon,
      isLightMode && options.light,
      isDarkMode && options.dark,
      isBusinessTheme && isLightMode && options.businessLight,
      isBusinessTheme && isDarkMode && options.businessDark,
      isNeonTheme && isLightMode && options.neonLight,
      isNeonTheme && isDarkMode && options.neonDark
    );
  };

  return {
    themeType,
    themeMode,
    isBusinessTheme,
    isNeonTheme,
    isDarkMode,
    isLightMode,
    mounted,
    getClasses,
  };
}
