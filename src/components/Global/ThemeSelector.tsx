'use client';

import * as React from 'react';
import { MdOutlineWbSunny, MdBusiness, MdAutoAwesome } from 'react-icons/md';
import { BsMoonStars } from 'react-icons/bs';
import { useThemeManager, type ThemeType, type ThemeMode } from '@/hooks/useThemeManager';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ThemeSelector() {
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

  const getThemeLabel = () => {
    if (!mounted) return 'Loading theme...';
    
    const typeLabel = isBusinessTheme ? 'Business' : 'Neon';
    const modeLabel = isDarkMode ? 'Dark' : 'Light';
    return `${typeLabel} ${modeLabel}`;
  };

  const getThemeDescription = () => {
    if (!mounted) return 'Theme selector';
    
    if (isBusinessTheme) {
      return isDarkMode 
        ? 'Professional dark theme for business use'
        : 'Clean light theme optimized for conversions';
    } else {
      return isDarkMode
        ? 'Creative dark theme with neon accents'
        : 'Vibrant light theme with colorful highlights';
    }
  };

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <Button variant='default' size='icon' aria-label='Loading theme selector' suppressHydrationWarning>
        <MdOutlineWbSunny className='h-[1.2rem] w-[1.2rem]' aria-hidden='true' />
        <span className='sr-only'>Loading theme selector</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='default'
          size='icon'
          aria-label={`Theme selector. Current: ${getThemeLabel()}`}
          aria-describedby='theme-description'
          className='relative'
        >
          {/* Theme type icon */}
          {isBusinessTheme ? (
            <MdBusiness
              className='absolute h-[0.8rem] w-[0.8rem] top-1 left-1 transition-all'
              aria-hidden='true'
            />
          ) : (
            <MdAutoAwesome
              className='absolute h-[0.8rem] w-[0.8rem] top-1 left-1 transition-all'
              aria-hidden='true'
            />
          )}
          
          {/* Mode icon */}
          <MdOutlineWbSunny
            className={`h-[1.2rem] w-[1.2rem] transition-all ${
              isDarkMode ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
            }`}
            aria-hidden='true'
          />
          <BsMoonStars
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
              isDarkMode ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
            }`}
            aria-hidden='true'
          />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align='end' className='w-56' aria-label='Theme options'>
        <DropdownMenuLabel className='text-sm font-medium'>
          Current: {getThemeLabel()}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Theme Type Selection */}
        <DropdownMenuLabel className='text-xs text-muted-foreground uppercase tracking-wide'>
          Theme Style
        </DropdownMenuLabel>
        
        <DropdownMenuItem
          onClick={() => setThemeType('business')}
          role='menuitemradio'
          aria-checked={isBusinessTheme}
          className='flex items-center gap-2'
        >
          <MdBusiness className='h-4 w-4' aria-hidden='true' />
          <div className='flex flex-col'>
            <span>Business</span>
            <span className='text-xs text-muted-foreground'>Professional & clean</span>
          </div>
          {isBusinessTheme && <span className='ml-auto text-xs'>✓</span>}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => setThemeType('neon')}
          role='menuitemradio'
          aria-checked={isNeonTheme}
          className='flex items-center gap-2'
        >
          <MdAutoAwesome className='h-4 w-4' aria-hidden='true' />
          <div className='flex flex-col'>
            <span>Neon</span>
            <span className='text-xs text-muted-foreground'>Creative & vibrant</span>
          </div>
          {isNeonTheme && <span className='ml-auto text-xs'>✓</span>}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Mode Selection */}
        <DropdownMenuLabel className='text-xs text-muted-foreground uppercase tracking-wide'>
          Appearance
        </DropdownMenuLabel>
        
        <DropdownMenuItem
          onClick={() => setThemeMode('light')}
          role='menuitemradio'
          aria-checked={isLightMode}
          className='flex items-center gap-2'
        >
          <MdOutlineWbSunny className='h-4 w-4' aria-hidden='true' />
          <span>Light Mode</span>
          {isLightMode && <span className='ml-auto text-xs'>✓</span>}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => setThemeMode('dark')}
          role='menuitemradio'
          aria-checked={isDarkMode}
          className='flex items-center gap-2'
        >
          <BsMoonStars className='h-4 w-4' aria-hidden='true' />
          <span>Dark Mode</span>
          {isDarkMode && <span className='ml-auto text-xs'>✓</span>}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Quick Actions */}
        <DropdownMenuItem
          onClick={toggleMode}
          className='flex items-center gap-2 font-medium'
        >
          {isDarkMode ? (
            <MdOutlineWbSunny className='h-4 w-4' aria-hidden='true' />
          ) : (
            <BsMoonStars className='h-4 w-4' aria-hidden='true' />
          )}
          <span>Switch to {isDarkMode ? 'Light' : 'Dark'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      
      <div id='theme-description' className='sr-only'>
        {getThemeDescription()}
      </div>
    </DropdownMenu>
  );
}
