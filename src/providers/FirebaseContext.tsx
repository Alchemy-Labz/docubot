// src/contexts/FirebaseContext.tsx - Improved version
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  signInWithCustomToken,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from '@firebase/auth';
import { useUser } from '@clerk/nextjs';
import { auth } from '@/lib/firebase/firebase';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import type {
  FirebaseAuthContextProps,
  FirebaseAuthState,
  FirebaseProviderProps,
} from '@/models/types/firebaseTypes';
import toast from 'react-hot-toast';
import { FIREBASE_CONFIG } from '@/lib/constants/appConstants';

const FirebaseAuthContext = createContext<FirebaseAuthContextProps | null>(null);

const INITIAL_STATE: FirebaseAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  token: null,
  tokenExpiry: null,
};

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const [state, setState] = useState<FirebaseAuthState>(INITIAL_STATE);

  // Token refresh mechanism
  const refreshToken = useCallback(async (): Promise<void> => {
    if (!clerkUser?.id) {
      setState((prev) => ({ ...prev, error: 'No Clerk user available', isLoading: false }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Check if user exists in Firestore first
      const userDocRef = doc(db, 'users', clerkUser.id);
      const userDoc = await getDoc(userDocRef);

      // If user doesn't exist in Firestore yet, we need to set up minimal data
      // This acts as a fallback in case the webhook didn't trigger properly
      if (!userDoc.exists()) {
        console.log('User document not found in Firestore, creating minimal initialization');
        // Set minimal data to prevent loading issues
        await setDoc(
          userDocRef,
          {
            hasActiveMembership: false,
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            name: clerkUser.fullName || '',
            username: clerkUser.username || undefined, // Convert null to undefined
            clerkId: clerkUser.id, // Explicitly include Clerk ID
            createdAt: new Date(),
            lastUpdated: new Date(),
          },
          { merge: true }
        );
      }

      const response = await fetch('/api/firebase-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: clerkUser.id }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data.firebaseToken) {
        throw new Error('No Firebase token received');
      }

      const credential = await signInWithCustomToken(auth, data.firebaseToken);

      // Calculate token expiry using app constants
      const tokenExpiry = new Date(Date.now() + FIREBASE_CONFIG.TOKEN_SAFETY_MARGIN);

      setState((prev) => ({
        ...prev,
        user: credential.user,
        isAuthenticated: true,
        isLoading: false,
        token: data.firebaseToken,
        tokenExpiry,
        error: null,
      }));

      console.log('🔥 Firebase authentication successful');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        user: null,
        token: null,
        tokenExpiry: null,
      }));
      console.error('🔥 Firebase authentication error:', error);

      // Show a toast to the user so they know something went wrong
      toast.error('Authentication error. Please refresh the page or try again later.');
    }
  }, [
    clerkUser?.id,
    clerkUser?.primaryEmailAddress?.emailAddress,
    clerkUser?.fullName,
    clerkUser?.username,
  ]);

  // Initial authentication
  const authenticate = useCallback(async (): Promise<void> => {
    await refreshToken();
  }, [refreshToken]);

  // Sign out
  const signOut = useCallback(async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      setState({
        ...INITIAL_STATE,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  }, []);

  // Auto-authenticate when Clerk user becomes available
  useEffect(() => {
    // Only proceed if Clerk has finished loading
    if (!isClerkLoaded) return;

    if (clerkUser?.id && !state.isAuthenticated && !state.isLoading) {
      // Add a small delay to ensure webhook has time to process
      const timer = setTimeout(() => {
        authenticate();
      }, 500);
      return () => clearTimeout(timer);
    } else if (!clerkUser?.id && state.isAuthenticated) {
      // Clerk user logged out, clear Firebase state
      setState({
        ...INITIAL_STATE,
        isLoading: false,
      });
    } else if (!clerkUser?.id && !state.isAuthenticated) {
      // No user at all
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [clerkUser?.id, state.isAuthenticated, state.isLoading, authenticate, isClerkLoaded]);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser && state.isAuthenticated) {
        // Firebase user signed out but our state thinks we're authenticated
        setState((prev) => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          token: null,
          tokenExpiry: null,
        }));
      }
    });

    return unsubscribe;
  }, [state.isAuthenticated]);

  // Auto token refresh
  useEffect(() => {
    if (!state.tokenExpiry || !state.isAuthenticated) return;

    const timeUntilRefresh =
      state.tokenExpiry.getTime() - Date.now() - FIREBASE_CONFIG.TOKEN_REFRESH_BUFFER;

    if (timeUntilRefresh <= 0) {
      refreshToken();
      return;
    }

    const refreshTimer = setTimeout(() => {
      refreshToken();
    }, timeUntilRefresh);

    return () => clearTimeout(refreshTimer);
  }, [state.tokenExpiry, state.isAuthenticated, refreshToken]);

  const contextValue: FirebaseAuthContextProps = {
    ...state,
    authenticate,
    signOut,
    refreshToken,
  };

  return (
    <FirebaseAuthContext.Provider value={contextValue}>{children}</FirebaseAuthContext.Provider>
  );
};

export const useFirebaseAuth = (): FirebaseAuthContextProps => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within a FirebaseProvider');
  }
  return context;
};

export default FirebaseProvider;
