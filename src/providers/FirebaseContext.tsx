// src/providers/FirebaseContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import {
  User,
  signInWithCustomToken,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { useUser } from '@clerk/nextjs';

interface FirebaseAuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  tokenExpiry: Date | null;
}

interface FirebaseAuthContextProps extends FirebaseAuthState {
  authenticate: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseAuthContextProps | undefined>(undefined);

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseProvider');
  }
  return context;
};

interface FirebaseProviderProps {
  children: React.ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const authenticationAttempted = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to fetch Firebase token from API
  const fetchFirebaseToken = async (): Promise<string | null> => {
    try {
      console.log('🔄 Fetching Firebase token from API...');
      const response = await fetch('/api/firebase-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Firebase token received');
      return data.firebaseToken;
    } catch (err) {
      console.error('❌ Error fetching Firebase token:', err);
      throw err;
    }
  };

  // Function to authenticate with Firebase using custom token
  const authenticate = useCallback(async (): Promise<void> => {
    if (!clerkUser) {
      throw new Error('No Clerk user available');
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log(`🔐 Authenticating Firebase for user: ${clerkUser.id}`);

      const firebaseToken = await fetchFirebaseToken();
      if (!firebaseToken) {
        throw new Error('Failed to get Firebase token');
      }

      // Sign in with the custom token
      await signInWithCustomToken(auth, firebaseToken);

      setToken(firebaseToken);
      setTokenExpiry(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days from now

      console.log('✅ Firebase authentication successful');
    } catch (err) {
      console.error('❌ Firebase authentication failed:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [clerkUser]);

  // Function to sign out
  const signOut = useCallback(async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      setToken(null);
      setTokenExpiry(null);
      setError(null);
      authenticationAttempted.current = false;
      console.log('✅ Firebase sign out successful');
    } catch (err) {
      console.error('❌ Firebase sign out failed:', err);
      setError(err instanceof Error ? err.message : 'Sign out failed');
      throw err;
    }
  }, []);

  // Function to refresh token if needed
  const refreshToken = useCallback(async (): Promise<void> => {
    if (!clerkUser) return;

    try {
      console.log('🔄 Refreshing Firebase token...');
      await authenticate();
    } catch (err) {
      console.error('❌ Token refresh failed:', err);
      setError(err instanceof Error ? err.message : 'Token refresh failed');
    }
  }, [clerkUser, authenticate]);

  // Set up Firebase auth state listener
  useEffect(() => {
    if (!mounted) return;

    // Prevent multiple listeners
    if (unsubscribeRef.current) {
      return;
    }

    console.log('Setting up Firebase auth state listener');

    const unsubscribe = onAuthStateChanged(
      auth,
      (authUser) => {
        console.log('Firebase auth state updated: User is', authUser ? 'signed in' : 'signed out');
        setFirebaseUser(authUser);

        // If we have a Clerk user but no Firebase user, and we haven't tried to authenticate yet
        if (clerkUser && !authUser && !authenticationAttempted.current) {
          console.log(
            '🔄 Clerk user exists but Firebase user missing, attempting authentication...'
          );
          authenticationAttempted.current = true;
          authenticate().catch((err) => {
            console.error('Auto-authentication failed:', err);
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      },
      (err) => {
        console.error('Firebase auth error:', err);
        setFirebaseUser(null);
        setError(err.message);
        setIsLoading(false);
      }
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        console.log('Cleaning up Firebase auth state listener');
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [mounted, clerkUser]);

  // Reset authentication flag when Clerk user changes
  useEffect(() => {
    if (!mounted || !clerkLoaded) return;

    if (!clerkUser) {
      // Reset authentication flag when Clerk user is cleared
      authenticationAttempted.current = false;
      setIsLoading(false);
    }
  }, [clerkUser, clerkLoaded, mounted]);

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <FirebaseContext.Provider
        value={{
          user: null,
          isAuthenticated: false,
          isLoading: true,
          error: null,
          token: null,
          tokenExpiry: null,
          authenticate: async () => {},
          signOut: async () => {},
          refreshToken: async () => {},
        }}
      >
        <div suppressHydrationWarning>{children}</div>
      </FirebaseContext.Provider>
    );
  }

  const value: FirebaseAuthContextProps = {
    user: firebaseUser,
    isAuthenticated: !!firebaseUser,
    isLoading: isLoading || !clerkLoaded,
    error,
    token,
    tokenExpiry,
    authenticate,
    signOut,
    refreshToken,
  };

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};
