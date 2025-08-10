/* eslint-disable import/prefer-default-export */
// app/actions/tokenActions.ts

'use server';

import jwt from 'jsonwebtoken';
import { getAuth } from 'firebase-admin/auth';
import { adminDb } from '@/lib/firebase/firebaseAdmin'; // Adjust this import based on your project structure
import { FIREBASE_CONFIG } from '@/lib/constants/appConstants';

export async function generateFirebaseToken(userId: string): Promise<string> {
  try {
    console.log(`Token generate: Creating new token for ${userId}`);

    // Check if Firebase Admin is properly initialized
    try {
      const firebaseAuth = getAuth();
      console.log(`Token generate: Firebase Auth initialized for project`);

      const newFirebaseToken = await firebaseAuth.createCustomToken(userId);
      console.log(`Token generate: Custom token created successfully for ${userId}`);

      // Try to update the last token refresh timestamp, but don't fail if user doc doesn't exist
      try {
        await adminDb.collection('users').doc(userId).set(
          {
            lastTokenRefresh: new Date(),
          },
          { merge: true }
        );
        console.log(`Token generate: Updated lastTokenRefresh for ${userId}`);
      } catch (updateError) {
        console.warn(
          `Token generate: Could not update lastTokenRefresh for ${userId}:`,
          updateError
        );
        // Don't throw here - the token was created successfully
      }

      console.log(`Token generate: Successfully created new token for ${userId}`);
      return newFirebaseToken;
    } catch (authError) {
      console.error(`Token generate: Firebase Auth error for ${userId}:`, authError);
      throw new Error(
        `Firebase Auth initialization failed: ${authError instanceof Error ? authError.message : 'Unknown error'}`
      );
    }
  } catch (error) {
    console.error(`Token generate: Failed to generate token for ${userId}:`, error);
    throw error;
  }
}

/**
 * @deprecated This function is deprecated as we no longer store tokens in the database
 * Use generateFirebaseToken instead
 */
export async function isTokenExpiredAction(userId: string): Promise<boolean> {
  console.warn('isTokenExpiredAction is deprecated. Use generateFirebaseToken instead.');
  try {
    await generateFirebaseToken(userId);
    return true; // Always return true to indicate a new token was generated
  } catch (error) {
    console.error(`Error generating token for ${userId}:`, error);
    return true;
  }
}
