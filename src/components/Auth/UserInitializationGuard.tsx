'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
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
  const { user } = useUser();

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
          <p className='text-lg font-medium text-gray-700 dark:text-gray-200'>Loading...</p>
          <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            Initializing your session
          </p>
        </div>
      </div>
    );
  }

  // Allow onboarding page to render
  if (pathname === '/onboarding') {
    return <>{children}</>;
  }

  // Show loading state with context-aware messaging
  if (isLoading) {
    // Determine if this is likely an existing user based on account age
    const isLikelyExistingUser =
      user?.createdAt && Date.now() - new Date(user.createdAt).getTime() > 24 * 60 * 60 * 1000; // Older than 1 day

    return (
      <div className='flex min-h-screen items-center justify-center' suppressHydrationWarning>
        <div className='mx-auto max-w-md px-4 text-center'>
          <div className='mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-b-2 border-accent'></div>

          <h2 className='mb-3 text-xl font-semibold text-gray-800 dark:text-gray-100'>
            {isLikelyExistingUser ? 'Welcome Back!' : 'Setting Up Your Account'}
          </h2>

          <p className='mb-2 text-gray-600 dark:text-gray-300'>
            {isLikelyExistingUser
              ? "We're setting up your account with our updated system..."
              : 'Preparing your personalized experience...'}
          </p>

          <p className='text-sm text-gray-500 dark:text-gray-400'>
            {isLikelyExistingUser
              ? 'This may take a moment for returning users'
              : 'This will only take a few seconds'}
          </p>

          {/* Progress indicator for accessibility */}
          <div className='mt-4' role='status' aria-live='polite'>
            <span className='sr-only'>
              {isLikelyExistingUser
                ? 'Migrating existing account...'
                : 'Setting up new account...'}
            </span>
          </div>
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
