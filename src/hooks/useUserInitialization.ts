'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { useFirebaseAuth } from '@/providers/FirebaseContext';

interface UserInitializationState {
  isInitialized: boolean | null;
  needsOnboarding: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to check user initialization status and handle onboarding flow
 */
export function useUserInitialization(): UserInitializationState {
  const { user, isLoaded } = useUser();
  const { isAuthenticated } = useFirebaseAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = useState<UserInitializationState>({
    isInitialized: null,
    needsOnboarding: false,
    isLoading: true,
    error: null,
  });

  // Return early state if Clerk is not loaded yet, but don't return from the hook
  const shouldProcessInitialization = isLoaded;

  useEffect(() => {
    // Don't check initialization on public routes or auth routes
    const publicRoutes = ['/', '/sign-in', '/sign-up', '/onboarding'];
    const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route)
    );

    if (isPublicRoute && pathname !== '/onboarding') {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    if (!shouldProcessInitialization || !user || !isAuthenticated) {
      setState((prev) => ({ ...prev, isLoading: !shouldProcessInitialization }));
      return;
    }

    // Set up real-time listener for user document
    const userDocRef = doc(db, 'users', user.id);

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const isInitialized = userData?.isUserInitialized === true;

          // Check if user has all required fields
          const hasRequiredFields = !!(
            userData?.firstName &&
            userData?.lastName &&
            userData?.username &&
            userData?.email
          );

          const needsOnboarding = !isInitialized || !hasRequiredFields;

          setState({
            isInitialized,
            needsOnboarding,
            isLoading: false,
            error: null,
          });

          // Redirect to onboarding if needed (but not if already on onboarding page)
          if (needsOnboarding && pathname !== '/onboarding') {
            console.log('User needs onboarding, redirecting...');
            router.push('/onboarding');
          }
        } else {
          // User document doesn't exist, needs initialization
          setState({
            isInitialized: false,
            needsOnboarding: true,
            isLoading: false,
            error: null,
          });

          if (pathname !== '/onboarding') {
            console.log('User document not found, redirecting to onboarding...');
            router.push('/onboarding');
          }
        }
      },
      (error) => {
        console.error('Error checking user initialization:', error);
        setState({
          isInitialized: null,
          needsOnboarding: false,
          isLoading: false,
          error: error.message,
        });
      }
    );

    return () => unsubscribe();
  }, [user, shouldProcessInitialization, isAuthenticated, router, pathname]);

  // Return early state if not ready to process initialization
  if (!shouldProcessInitialization) {
    return {
      isInitialized: null,
      needsOnboarding: false,
      isLoading: true,
      error: null,
    };
  }

  return state;
}
