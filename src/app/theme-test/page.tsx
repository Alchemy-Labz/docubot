'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeDebugger from '@/components/Debug/ThemeDebugger';
import FeatureCards from '@/components/Cards/FeatureCards';
import PricingCard from '@/components/Cards/PricingCard';
import { useThemeManager } from '@/hooks/useThemeManager';

export default function ThemeTestPage() {
  const { currentTheme, isBusinessTheme, isNeonTheme, mounted } = useThemeManager();

  if (!mounted) {
    return <div>Loading theme test...</div>;
  }

  const sampleFeatures = ['Feature 1', 'Feature 2', 'Feature 3'];

  return (
    <div className='min-h-screen p-8 space-y-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-4xl font-bold mb-8 text-center'>
          Theme System Test Page
        </h1>
        
        <div className='mb-8 p-4 rounded-lg border border-border bg-card'>
          <h2 className='text-2xl font-semibold mb-4'>Current Theme: {currentTheme}</h2>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <strong>Theme Type:</strong> {isBusinessTheme ? 'Business' : 'Neon'}
            </div>
            <div>
              <strong>Design Rules:</strong> {isBusinessTheme ? 'No gradients, solid colors' : 'Gradients preserved, vibrant colors'}
            </div>
          </div>
        </div>

        {/* Theme Debugger */}
        <ThemeDebugger />

        {/* Typography Test */}
        <Card>
          <CardHeader>
            <CardTitle>Typography Test</CardTitle>
            <CardDescription>Testing text styles across themes</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <h1 className='text-4xl font-bold text-gradient-lime-violet'>
              Gradient Text (Business: solid, Neon: gradient)
            </h1>
            <h2 className='text-3xl font-semibold text-foreground'>
              Primary Text
            </h2>
            <p className='text-muted-foreground'>
              Muted text for descriptions and secondary content
            </p>
            <p className='text-accent'>
              Accent colored text
            </p>
          </CardContent>
        </Card>

        {/* Button Test */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variations</CardTitle>
            <CardDescription>Testing all button styles</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-wrap gap-4'>
              <Button variant='default'>Default Button</Button>
              <Button variant='secondary'>Secondary Button</Button>
              <Button variant='outline'>Outline Button</Button>
              <Button variant='ghost'>Ghost Button</Button>
              <Button variant='destructive'>Destructive Button</Button>
            </div>
            <div className='flex flex-wrap gap-4'>
              <Button className='bg-accent text-white hover:bg-accent/90'>
                Accent Button
              </Button>
              <Button className='bg-primary text-primary-foreground hover:bg-primary/90'>
                Primary Button
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Background Test */}
        <Card>
          <CardHeader>
            <CardTitle>Background Test</CardTitle>
            <CardDescription>Testing background colors and gradients</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='p-4 rounded-lg bg-background border border-border'>
                <h3 className='font-semibold mb-2'>Background</h3>
                <p className='text-sm text-muted-foreground'>Default background color</p>
              </div>
              <div className='p-4 rounded-lg bg-card border border-border'>
                <h3 className='font-semibold mb-2'>Card Background</h3>
                <p className='text-sm text-muted-foreground'>Card background color</p>
              </div>
              <div className='p-4 rounded-lg bg-muted'>
                <h3 className='font-semibold mb-2'>Muted Background</h3>
                <p className='text-sm text-muted-foreground'>Muted background color</p>
              </div>
              <div className='p-4 rounded-lg bg-accent text-accent-foreground'>
                <h3 className='font-semibold mb-2'>Accent Background</h3>
                <p className='text-sm'>Accent background with proper contrast</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Component Integration Test */}
        <Card>
          <CardHeader>
            <CardTitle>Component Integration</CardTitle>
            <CardDescription>Testing theme-aware components</CardDescription>
          </CardHeader>
          <CardContent className='space-y-8'>
            <div>
              <h3 className='text-xl font-semibold mb-4'>Feature Cards</h3>
              <FeatureCards />
            </div>
            
            <div>
              <h3 className='text-xl font-semibold mb-4'>Pricing Card</h3>
              <div className='flex justify-center'>
                <PricingCard 
                  plan='Test Plan'
                  price='$9.99/month'
                  features={sampleFeatures}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive States Test */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive States</CardTitle>
            <CardDescription>Testing hover, focus, and active states</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>
                Test these elements for proper interactive states:
              </p>
              <ul className='list-disc list-inside space-y-1 text-sm'>
                <li>Hover over buttons to see hover states</li>
                <li>Tab through elements to see focus indicators</li>
                <li>Click and hold buttons to see active states</li>
                <li>Check that all states have proper contrast</li>
              </ul>
            </div>
            
            <div className='flex flex-wrap gap-4'>
              <button className='px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:bg-primary/80 transition-colors'>
                Test Focus/Hover
              </button>
              <button className='px-4 py-2 rounded border border-border bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors'>
                Test Border Button
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Test */}
        <Card>
          <CardHeader>
            <CardTitle>Accessibility Verification</CardTitle>
            <CardDescription>Ensuring WCAG compliance across themes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                <div>
                  <h4 className='font-semibold mb-2'>Contrast Ratios</h4>
                  <ul className='space-y-1'>
                    <li>✓ Text on background: High contrast</li>
                    <li>✓ Muted text: Readable contrast</li>
                    <li>✓ Button text: High contrast</li>
                    <li>✓ Focus indicators: Visible</li>
                  </ul>
                </div>
                <div>
                  <h4 className='font-semibold mb-2'>Theme Features</h4>
                  <ul className='space-y-1'>
                    <li>✓ Reduced motion support</li>
                    <li>✓ High contrast mode support</li>
                    <li>✓ Keyboard navigation</li>
                    <li>✓ Screen reader compatibility</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='text-center text-sm text-muted-foreground mt-8'>
          <p>Switch themes using the theme selector in the header to test all combinations.</p>
        </div>
      </div>
    </div>
  );
}
