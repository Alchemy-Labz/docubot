// useSubscription.ts
'use client';

import { db, auth } from '#/firebase';
import { useUser } from '@clerk/nextjs';
import { collection, doc } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { signInWithCustomToken } from '@firebase/auth';

const FREE_DOC_LIMIT = 2;
const PRO_DOC_LIMIT = 52;

function useSubscription() {
  console.log('=== DEBUG: useSubscription hook starting ===');
  const [hasActiveMembership, setHasActiveMembership] = useState<boolean | null>(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState(false);
  const { user } = useUser();

  console.log('=== DEBUG: Creating Firebase references in useSubscription ===');
  const userDocRef = user ? doc(db, 'users', user.id) : null;
  const userFilesCollectionRef = user ? collection(db, 'users', user.id, 'files') : null;

  const [snapshot, loading, error] = useDocument(userDocRef, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  console.log(
    '=== DEBUG: Setting up Firebase hooks with refs:',
    userDocRef,
    userFilesCollectionRef
  );
  const [docsSnapshot, docsLoading, docsError] = useCollection(userFilesCollectionRef);

  useEffect(() => {
    const fetchFirebaseToken = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/firebase-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch Firebase token: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        if (!data.firebaseToken) {
          throw new Error('No Firebase token received from the server');
        }

        await signInWithCustomToken(auth, data.firebaseToken);
        console.log('Signed in to Firebase successfully');
      } catch (error) {
        console.error('Error fetching Firebase token:', error);
      }
    };

    fetchFirebaseToken();
  }, [user]);

  useEffect(() => {
    if (snapshot && snapshot.exists()) {
      const data = snapshot.data();
      setHasActiveMembership(data?.hasActiveMembership ?? false);
    } else {
      setHasActiveMembership(false);
    }
  }, [snapshot]);

  useEffect(() => {
    if (!docsSnapshot || hasActiveMembership === null) return;

    const docs = docsSnapshot.docs;
    const usersLimit = hasActiveMembership ? PRO_DOC_LIMIT : FREE_DOC_LIMIT;
    setIsOverFileLimit(docs.length >= usersLimit);
  }, [docsSnapshot, hasActiveMembership]);

  return {
    hasActiveMembership,
    isOverFileLimit,
    loading,
    error,
    docsLoading,
    docsError,
  };
}

export default useSubscription;
