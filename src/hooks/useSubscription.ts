// src/hooks/useSubscription.ts
'use client';

import { collection, doc, onSnapshot } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { useFirebaseAuth } from '@/providers/FirebaseContext';
import { useUser } from '@clerk/nextjs';
import { db } from '@/lib/firebase/firebase';
import { SUBSCRIPTION_LIMITS } from '@/lib/constants/appConstants';

function useSubscription() {
  const { isAuthenticated, isLoading: authLoading } = useFirebaseAuth();
  const { user: clerkUser } = useUser(); // Use Clerk user for ID
  const [hasActiveMembership, setHasActiveMembership] = useState<boolean | null>(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [docsLoading, setDocsLoading] = useState(true);
  const [docsError, setDocsError] = useState<Error | null>(null);
  const [docsCount, setDocsCount] = useState(0);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !clerkUser?.id) {
      setLoading(false);
      setDocsLoading(false);
      setHasActiveMembership(false);
      setDocsCount(0);
      setIsOverFileLimit(false);
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
          setHasActiveMembership(userData?.hasActiveMembership ?? false);
        } else {
          setHasActiveMembership(false);
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

        const userLimit = hasActiveMembership
          ? SUBSCRIPTION_LIMITS.PRO.FILE_LIMIT
          : SUBSCRIPTION_LIMITS.FREE.FILE_LIMIT;
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
  }, [isAuthenticated, authLoading, clerkUser?.id, hasActiveMembership]);

  return {
    hasActiveMembership,
    isOverFileLimit,
    loading: loading || authLoading,
    error,
    docsLoading: docsLoading || authLoading,
    docsError,
    docsCount,
  };
}

export default useSubscription;
