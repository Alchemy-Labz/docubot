// src/providers/FirebaseContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
});

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        setUser(authUser);
        setLoading(false);
      },
      (error) => {
        console.error('Firebase auth error:', error);
        setUser(null);
        setLoading(false);
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
  }, [mounted]);

  // Don't render the auth-dependent content until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <FirebaseContext.Provider value={{ user: null, loading: true }}>
        <div suppressHydrationWarning>{children}</div>
      </FirebaseContext.Provider>
    );
  }

  const value: FirebaseContextType = {
    user,
    loading,
  };

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};
