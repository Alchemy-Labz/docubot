/* eslint-disable import/prefer-default-export */
/* eslint-disable react/function-component-definition */
'use client';

import * as React from 'react';
import { MdOutlineWbSunny } from 'react-icons/md';
import { BsMoonStars } from 'react-icons/bs';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getThemeLabel = (currentTheme: string | undefined) => {
    if (!mounted) return 'Toggle theme';

    switch (currentTheme) {
      case 'light':
        return 'Light theme active';
      case 'dark':
        return 'Dark theme active';
      case 'system':
        return 'System theme active';
      default:
        return 'Toggle theme';
    }
  };

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <Button variant='default' size='icon' aria-label='Toggle theme' suppressHydrationWarning>
        <MdOutlineWbSunny className='h-[1.2rem] w-[1.2rem]' aria-hidden='true' />
        <span className='sr-only'>Toggle theme</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='default'
          size='icon'
          aria-label={`Theme selector. ${getThemeLabel(theme)}`}
          aria-describedby='theme-description'
        >
          <MdOutlineWbSunny
            className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0'
            aria-hidden='true'
          />
          <BsMoonStars
            className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100'
            aria-hidden='true'
          />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='' aria-label='Theme options'>
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          role='menuitemradio'
          aria-checked={theme === 'light'}
          aria-describedby='light-theme-desc'
        >
          Light
          <span id='light-theme-desc' className='sr-only'>
            Switch to light theme
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          role='menuitemradio'
          aria-checked={theme === 'dark'}
          aria-describedby='dark-theme-desc'
        >
          Dark
          <span id='dark-theme-desc' className='sr-only'>
            Switch to dark theme
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          role='menuitemradio'
          aria-checked={theme === 'system'}
          aria-describedby='system-theme-desc'
        >
          System
          <span id='system-theme-desc' className='sr-only'>
            Use system theme setting
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <div id='theme-description' className='sr-only'>
        Choose between light theme, dark theme, or system theme preference
      </div>
    </DropdownMenu>
  );
}
