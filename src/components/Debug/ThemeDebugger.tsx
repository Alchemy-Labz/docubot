'use client';

import React from 'react';
import { useThemeManager } from '@/hooks/useThemeManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Debug component to test and visualize all theme combinations
 * This component helps verify that the theming system works correctly
 */
export function ThemeDebugger() {
  const {
    themeType,
    themeMode,
    currentTheme,
    setThemeType,
    setThemeMode,
    setTheme,
    toggleMode,
    isBusinessTheme,
    isNeonTheme,
    isDarkMode,
    isLightMode,
    mounted,
  } = useThemeManager();

  if (!mounted) {
    return <div>Loading theme debugger...</div>;
  }

  const allThemes = ['business-light', 'business-dark', 'neon-light', 'neon-dark'] as const;

  return (
    <div className='p-6 space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Theme System Debugger</CardTitle>
          <CardDescription>
            Test and visualize all theme combinations. Current theme: {currentTheme}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Current Theme Info */}
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <strong>Theme Type:</strong> {themeType}
            </div>
            <div>
              <strong>Theme Mode:</strong> {themeMode}
            </div>
            <div>
              <strong>Is Business:</strong> {isBusinessTheme ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Is Neon:</strong> {isNeonTheme ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Is Dark:</strong> {isDarkMode ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Is Light:</strong> {isLightMode ? 'Yes' : 'No'}
            </div>
          </div>

          {/* Theme Controls */}
          <div className='space-y-4'>
            <div>
              <h4 className='font-medium mb-2'>Quick Theme Switch</h4>
              <div className='flex flex-wrap gap-2'>
                {allThemes.map((theme) => (
                  <Button
                    key={theme}
                    variant={currentTheme === theme ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setTheme(theme)}
                  >
                    {theme}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className='font-medium mb-2'>Individual Controls</h4>
              <div className='flex flex-wrap gap-2'>
                <Button
                  variant={isBusinessTheme ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setThemeType('business')}
                >
                  Business
                </Button>
                <Button
                  variant={isNeonTheme ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setThemeType('neon')}
                >
                  Neon
                </Button>
                <Button
                  variant={isLightMode ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setThemeMode('light')}
                >
                  Light
                </Button>
                <Button
                  variant={isDarkMode ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setThemeMode('dark')}
                >
                  Dark
                </Button>
                <Button
                  variant='secondary'
                  size='sm'
                  onClick={toggleMode}
                >
                  Toggle Mode
                </Button>
              </div>
            </div>
          </div>

          {/* Color Swatches */}
          <div>
            <h4 className='font-medium mb-2'>Current Theme Colors</h4>
            <div className='grid grid-cols-4 gap-2 text-xs'>
              <div className='p-3 rounded bg-background border text-foreground'>
                Background
              </div>
              <div className='p-3 rounded bg-card border text-card-foreground'>
                Card
              </div>
              <div className='p-3 rounded bg-primary text-primary-foreground'>
                Primary
              </div>
              <div className='p-3 rounded bg-secondary text-secondary-foreground'>
                Secondary
              </div>
              <div className='p-3 rounded bg-muted text-muted-foreground'>
                Muted
              </div>
              <div className='p-3 rounded bg-accent text-accent-foreground'>
                Accent
              </div>
              <div className='p-3 rounded bg-destructive text-destructive-foreground'>
                Destructive
              </div>
              <div className='p-3 rounded border-2 border-border bg-background text-foreground'>
                Border
              </div>
            </div>
          </div>

          {/* Interactive Elements Test */}
          <div>
            <h4 className='font-medium mb-2'>Interactive Elements</h4>
            <div className='flex flex-wrap gap-2'>
              <Button variant='default'>Default Button</Button>
              <Button variant='secondary'>Secondary Button</Button>
              <Button variant='outline'>Outline Button</Button>
              <Button variant='ghost'>Ghost Button</Button>
              <Button variant='destructive'>Destructive Button</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ThemeDebugger;
