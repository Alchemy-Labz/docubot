/* eslint-disable @typescript-eslint/no-var-requires */
import { getStorage } from 'firebase-admin/storage';
import { initializeApp, getApps, App, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { ERROR_MESSAGES } from '@/lib/constants/appConstants';

// const serviceKey = JSON.parse(process.env.FIREBASE_SERVICE_KEY as string);

let serviceKey;
try {
  serviceKey = JSON.parse(process.env.FIREBASE_SERVICE_KEY as string);
} catch (error) {
  console.error('Error parsing Firebase service key:', error);
  throw new Error(ERROR_MESSAGES.INVALID_FIREBASE_SERVICE_KEY);
}

if (!serviceKey) {
  throw new Error(ERROR_MESSAGES.FIREBASE_SERVICE_KEY_NOT_DEFINED);
}

let app: App;

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceKey),
  });
} else {
  app = getApp();
}

const adminDb = getFirestore(app);
const adminStorage = getStorage(app);
const adminAuth = getAuth(app);

export { app as adminApp, adminDb, adminStorage, adminAuth };
