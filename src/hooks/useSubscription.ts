// src/hooks/useSubscription.ts
'use client';

import { collection, doc, onSnapshot } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { useFirebaseAuth } from '@/providers/FirebaseContext';
import { useUser } from '@clerk/nextjs';
import { db } from '@/lib/firebase/firebase';
import { SUBSCRIPTION_LIMITS, PLAN_TYPES } from '@/lib/constants/appConstants';

function useSubscription() {
  const { isAuthenticated, isLoading: authLoading } = useFirebaseAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser(); // Use Clerk user for ID
  const [planType, setPlanType] = useState<string>(PLAN_TYPES.STARTER);
  const [isOverFileLimit, setIsOverFileLimit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [docsLoading, setDocsLoading] = useState(true);
  const [docsError, setDocsError] = useState<Error | null>(null);
  const [docsCount, setDocsCount] = useState(0);

  useEffect(() => {
    if (authLoading) return;

    if (!clerkLoaded || !isAuthenticated || !clerkUser?.id) {
      setLoading(!clerkLoaded || authLoading);
      setDocsLoading(!clerkLoaded || authLoading);
      if (clerkLoaded && !clerkUser?.id) {
        setPlanType(PLAN_TYPES.STARTER);
        setDocsCount(0);
        setIsOverFileLimit(false);
      }
      return;
    }

    // Use Clerk user ID for Firestore operations
    const userId = clerkUser.id;
    let isMounted = true;

    // Set up user document subscription
    const userDocRef = doc(db, 'users', userId);

    const unsubscribeUserDoc = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (!isMounted) return;

        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const userPlanType = userData?.planType || PLAN_TYPES.STARTER;

          setPlanType(userPlanType);
        } else {
          setPlanType(PLAN_TYPES.STARTER);
        }
        setLoading(false);
      },
      (err) => {
        if (!isMounted) return;
        console.error('🔥 Error fetching user document:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Set up files collection subscription
    const filesCollectionRef = collection(db, 'users', userId, 'files');
    const unsubscribeFiles = onSnapshot(
      filesCollectionRef,
      (querySnapshot) => {
        if (!isMounted) return;

        const count = querySnapshot.size;
        setDocsCount(count);

        // Determine file limit based on plan type
        let userLimit: number = SUBSCRIPTION_LIMITS.FREE.FILE_LIMIT;
        if (planType === PLAN_TYPES.PRO) {
          userLimit = SUBSCRIPTION_LIMITS.PRO.FILE_LIMIT;
        } else if (planType === PLAN_TYPES.TEAM) {
          userLimit = SUBSCRIPTION_LIMITS.TEAM.FILE_LIMIT;
        }

        setIsOverFileLimit(count >= userLimit);

        setDocsLoading(false);
      },
      (err) => {
        if (!isMounted) return;
        console.error('🔥 Error fetching files collection:', err);
        setDocsError(err);
        setDocsLoading(false);
      }
    );

    // Clean up subscriptions
    return () => {
      isMounted = false;
      unsubscribeUserDoc();
      unsubscribeFiles();
    };
  }, [isAuthenticated, authLoading, clerkUser?.id, planType]);

  // Helper computed values for easier plan checking
  const isStarterPlan = planType === PLAN_TYPES.STARTER;
  const isProPlan = planType === PLAN_TYPES.PRO;
  const isTeamPlan = planType === PLAN_TYPES.TEAM;
  const hasPaidPlan = isProPlan || isTeamPlan;

  return {
    planType,
    isStarterPlan,
    isProPlan,
    isTeamPlan,
    hasPaidPlan,
    isOverFileLimit,
    loading: loading || authLoading,
    error,
    docsLoading: docsLoading || authLoading,
    docsError,
    docsCount,
  };
}

export default useSubscription;
