// src/lib/firebase/firebase.ts - Enhanced version with better error handling
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAuth, Auth } from 'firebase/auth';

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
function initFirebase(): FirebaseApp {
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
let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;
let auth: Auth;

try {
  app = initFirebase();
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);

  // Connect to emulator in development if available
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true'
  ) {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
    } catch (error) {
      console.log('Could not connect to Firestore emulator:', error);
    }
  }
} catch (error) {
  console.error('Failed to initialize Firebase services:', error);
  throw error;
}

// Export initialized services
export { app, db, storage, auth };
export default app;

// Export types for better TypeScript support
export type { FirebaseApp, Firestore, FirebaseStorage, Auth };
