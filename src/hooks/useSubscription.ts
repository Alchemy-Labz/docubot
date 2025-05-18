// useSubscription.ts
'use client';

import { db, auth } from '@/lib/firebase/firebase'; // Client SDK
import { useUser } from '@clerk/nextjs';
import { collection, doc, onSnapshot } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { signInWithCustomToken } from '@firebase/auth';

const FREE_DOC_LIMIT = 2;
const PRO_DOC_LIMIT = 52;

function useSubscription() {
  const [hasActiveMembership, setHasActiveMembership] = useState<boolean | null>(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [docsLoading, setDocsLoading] = useState(true);
  const [docsError, setDocsError] = useState<Error | null>(null);
  const [docsCount, setDocsCount] = useState(0);

  const { user } = useUser();

  // Use direct subscriptions rather than hooks
  useEffect(() => {
    if (!user) {
      setLoading(false);
      setDocsLoading(false);
      return;
    }

    // Firebase authentication
    const authenticateWithFirebase = async () => {
      try {
        const response = await fetch('/api/firebase-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch Firebase token: ${response.status}`);
        }

        const data = await response.json();
        if (!data.firebaseToken) {
          throw new Error('No Firebase token received');
        }

        await signInWithCustomToken(auth, data.firebaseToken);
        console.log('🔥 Firebase authentication successful');
      } catch (err) {
        console.error('🔥 Firebase authentication error:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    authenticateWithFirebase();

    // Set up user document subscription
    const userDocRef = doc(db, 'users', user.id);
    const unsubscribeUserDoc = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setHasActiveMembership(userData?.hasActiveMembership ?? false);
        } else {
          setHasActiveMembership(false);
        }
        setLoading(false);
      },
      (err) => {
        console.error('🔥 Error fetching user document:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Set up files collection subscription
    const filesCollectionRef = collection(db, 'users', user.id, 'files');
    const unsubscribeFiles = onSnapshot(
      filesCollectionRef,
      (querySnapshot) => {
        const count = querySnapshot.size;
        setDocsCount(count);

        const userLimit = hasActiveMembership ? PRO_DOC_LIMIT : FREE_DOC_LIMIT;
        setIsOverFileLimit(count >= userLimit);

        setDocsLoading(false);
      },
      (err) => {
        console.error('🔥 Error fetching files collection:', err);
        setDocsError(err);
        setDocsLoading(false);
      }
    );

    // Clean up subscriptions
    return () => {
      unsubscribeUserDoc();
      unsubscribeFiles();
    };
  }, [user, hasActiveMembership]);

  return {
    hasActiveMembership,
    isOverFileLimit,
    loading,
    error,
    docsLoading,
    docsError,
    docsCount,
  };
}

export default useSubscription;
