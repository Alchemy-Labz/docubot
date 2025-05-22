// src/providers/ThemeProvider.tsx
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a div with no theme classes to prevent hydration mismatch
    return <div suppressHydrationWarning>{children}</div>;
  }

  return (
    <NextThemesProvider {...props} >
      {children}
    </NextThemesProvider>
  );
}
