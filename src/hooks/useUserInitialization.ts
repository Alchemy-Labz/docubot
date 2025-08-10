'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
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

    // Enhanced retry logic for migration scenarios
    let retryCount = 0;
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second base delay

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
          // User document doesn't exist - potential migration scenario
          console.log('❌ User document does not exist - potential migration scenario');

          // This might be a migration scenario - wait a bit for webhook to process
          if (retryCount < maxRetries) {
            console.log(
              `⏳ Retrying user check in ${baseDelay * Math.pow(2, retryCount)}ms (attempt ${retryCount + 1}/${maxRetries + 1})`
            );

            // Don't set final state yet, we're retrying
            setState((prev) => ({
              ...prev,
              isLoading: true,
              error: null,
            }));

            setTimeout(
              () => {
                retryCount++;
                // Force a re-check by updating the listener
                const newUserDocRef = doc(db, 'users', user.id);
                getDoc(newUserDocRef)
                  .then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                      // Document now exists, process normally
                      const userData = docSnapshot.data();
                      const isInitialized = userData?.isUserInitialized === true;
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

                      if (needsOnboarding && pathname !== '/onboarding') {
                        console.log(
                          '✅ User document found after retry, redirecting to onboarding...'
                        );
                        router.push('/onboarding');
                      }
                    } else if (retryCount >= maxRetries) {
                      // Final retry failed, proceed with onboarding
                      console.log('🔄 Max retries reached, assuming user needs initialization');
                      setState({
                        isInitialized: false,
                        needsOnboarding: true,
                        isLoading: false,
                        error: null,
                      });

                      if (pathname !== '/onboarding') {
                        console.log('🚀 Redirecting to onboarding after retry exhaustion...');
                        router.push('/onboarding');
                      }
                    }
                  })
                  .catch((error) => {
                    console.error('❌ Error during retry:', error);
                    if (retryCount >= maxRetries) {
                      setState({
                        isInitialized: false,
                        needsOnboarding: true,
                        isLoading: false,
                        error: `Failed to check user status: ${error.message}`,
                      });

                      if (pathname !== '/onboarding') {
                        router.push('/onboarding');
                      }
                    }
                  });
              },
              baseDelay * Math.pow(2, retryCount)
            ); // Exponential backoff

            return; // Don't proceed with immediate redirect
          }

          // After max retries, assume user needs initialization
          console.log('🔄 Max retries reached, assuming user needs initialization');
          setState({
            isInitialized: false,
            needsOnboarding: true,
            isLoading: false,
            error: null,
          });

          if (pathname !== '/onboarding') {
            console.log('🚀 Redirecting to onboarding after retry exhaustion...');
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
