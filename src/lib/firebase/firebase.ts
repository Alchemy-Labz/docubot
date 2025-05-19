// src/lib/firebase/firebase.ts - Compatible with existing app
import { initializeApp, getApps, getApp } from '@firebase/app';
import { getFirestore } from '@firebase/firestore';
import { getStorage } from '@firebase/storage';
import { getAuth } from '@firebase/auth';

// Firebase configuration with fallbacks
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate at runtime when actually needed
function validateConfig(): void {
  const required = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];
  const missing = required.filter((key) => !firebaseConfig[key as keyof typeof firebaseConfig]);

  if (missing.length > 0) {
    throw new Error(`Firebase configuration missing: ${missing.join(', ')}`);
  }
}

// Initialize Firebase with validation
function initFirebase() {
  try {
    validateConfig();
    return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // Return a mock app in development if needed
    if (process.env.NODE_ENV === 'development') {
      console.warn('Firebase not configured properly. Some features may not work.');
    }
    throw error;
  }
}

// Initialize Firebase
const app = initFirebase();

// Initialize services - keeping the same export pattern as original
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export { app };
export default app;
