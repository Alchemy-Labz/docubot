// Import the functions you need from the SDKs you need

import { initializeApp, getApps, getApp } from '@firebase/app';
// import { getAnalytics } from '@firebase/analytics';
import { getFirestore } from '@firebase/firestore';
import { getStorage } from '@firebase/storage';
import { getAuth } from '@firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDgf-uSnrl0pwwDdR_htSyCY0XfpjFpWJA',
  authDomain: 'docubot-86f36.firebaseapp.com',
  projectId: 'docubot-86f36',
  storageBucket: 'docubot-86f36.appspot.com',
  messagingSenderId: '633771835594',
  appId: '1:633771835594:web:f3377145a7178ddc9d7433',
  measurementId: 'G-PFF0EGNXSE',
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export { db, storage, auth };
