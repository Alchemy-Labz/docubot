/* eslint-disable import/prefer-default-export */
// app/actions/tokenActions.ts

'use server';

import jwt from 'jsonwebtoken';
import { getAuth } from 'firebase-admin/auth';
import { adminDb } from '@/lib/firebase/firebaseAdmin'; // Adjust this import based on your project structure
import { FIREBASE_CONFIG } from '@/lib/constants/appConstants';

export async function isTokenExpiredAction(userId: string): Promise<boolean> {
  try {
    console.log(`Token check: Checking token for user ${userId}`);
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();

    // If no user data or no token, consider it expired and generate a new one
    if (!userData || !userData.firebaseToken) {
      console.log(`Token check: No user data or token for ${userId}, considering expired`);
      await generateNewToken(userId);
      return true;
    }

    const token = userData.firebaseToken;

    try {
      // Try to decode the token
      const decodedToken = jwt.decode(token) as { exp?: number };

      if (!decodedToken || typeof decodedToken.exp === 'undefined') {
        console.log(`Token check: Invalid token for ${userId}, cannot decode or find expiration`);
        await generateNewToken(userId);
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const bufferTime = 60 * 60; // 1 hour buffer in seconds

      console.log(
        `Token check: Token expires at ${new Date(decodedToken.exp * 1000).toISOString()}`
      );
      console.log(`Token check: Current time is ${new Date(currentTime * 1000).toISOString()}`);

      // Check if the token is expired or will expire in the next buffer time
      if (decodedToken.exp <= currentTime + bufferTime) {
        console.log(
          `Token check: Token expired or expiring soon for ${userId}, generating new token`
        );
        await generateNewToken(userId);
        return true;
      }

      console.log(`Token check: Token still valid for ${userId}`);
      return false; // Token is still valid
    } catch (decodeError) {
      console.error(`Token check: Error decoding token for ${userId}:`, decodeError);
      await generateNewToken(userId);
      return true;
    }
  } catch (error) {
    console.error(`Token check: Error checking token expiration for ${userId}:`, error);

    // Even on error, try to generate a new token to recover
    try {
      await generateNewToken(userId);
    } catch (genError) {
      console.error(`Token check: Failed to generate recovery token for ${userId}:`, genError);
    }

    return true; // If there's an error, consider the token expired
  }
}

// Helper function to generate a new token
async function generateNewToken(userId: string): Promise<string> {
  try {
    console.log(`Token generate: Creating new token for ${userId}`);
    const firebaseAuth = getAuth();
    const tokenSettings = {
      expiresIn: FIREBASE_CONFIG.TOKEN_EXPIRY_SECONDS,
    };
    const newFirebaseToken = await firebaseAuth.createCustomToken(userId, tokenSettings);

    // Update the token in the database
    await adminDb.collection('users').doc(userId).set(
      {
        firebaseToken: newFirebaseToken,
        lastTokenRefresh: new Date(),
      },
      { merge: true }
    );

    console.log(`Token generate: Successfully created new token for ${userId}`);
    return newFirebaseToken;
  } catch (error) {
    console.error(`Token generate: Failed to generate token for ${userId}:`, error);
    throw error;
  }
}
