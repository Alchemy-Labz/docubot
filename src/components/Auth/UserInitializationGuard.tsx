'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUserInitialization } from '@/hooks/useUserInitialization';

interface UserInitializationGuardProps {
  children: React.ReactNode;
}

/**
 * Component wrapper that ensures user is initialized before rendering children
 */
export function UserInitializationGuard({ children }: UserInitializationGuardProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Always call hooks in the same order - before any conditional returns
  const { isInitialized, needsOnboarding, isLoading } = useUserInitialization();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className='flex min-h-screen items-center justify-center' suppressHydrationWarning>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-accent'></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Allow onboarding page to render
  if (pathname === '/onboarding') {
    return <>{children}</>;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center' suppressHydrationWarning>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-accent'></div>
          <p>Checking user status...</p>
        </div>
      </div>
    );
  }

  // If user needs onboarding, don't render protected content
  if (needsOnboarding) {
    return (
      <div className='flex min-h-screen items-center justify-center' suppressHydrationWarning>
        <div className='text-center'>
          <p>Redirecting to complete setup...</p>
        </div>
      </div>
    );
  }

  // User is initialized, render children
  return <>{children}</>;
}
