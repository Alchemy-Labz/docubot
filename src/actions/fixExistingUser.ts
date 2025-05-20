'use server';

import { auth } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/lib/firebase/firebaseAdmin';
import { FIREBASE_CONFIG } from '@/lib/constants/appConstants';

/**
 * Fixes an existing user's Firestore data to ensure all required fields are present
 * This can be used to manually fix users who are stuck in loading states
 */
export async function fixExistingUser() {
  try {
    // Protect this route
    auth.protect();
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: 'User authentication failed',
      };
    }

    // Generate a fresh Firebase token
    const firebaseAuth = getAuth(adminApp);
    const tokenSettings = {
      expiresIn: FIREBASE_CONFIG.TOKEN_EXPIRY_SECONDS,
    };
    const firebaseToken = await firebaseAuth.createCustomToken(userId, tokenSettings);

    // Get existing user data
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();

    // Prepare the update data
    const updateData: Record<string, any> = {
      firebaseToken,
      lastUpdated: new Date(),
      clerkId: userId, // Explicitly include Clerk ID
    };

    // Only set these fields if they don't already exist
    if (!userDoc.exists || !userDoc.data()?.hasActiveMembership) {
      updateData.hasActiveMembership = false;
    }

    if (!userDoc.exists || !userDoc.data()?.createdAt) {
      updateData.createdAt = new Date();
    }

    // Update the user document
    await userRef.set(updateData, { merge: true });

    // Ensure 'files' collection path exists (doesn't need any documents)
    // Just accessing it is enough to ensure Firestore creates the path
    const filesRef = userRef.collection('files');

    return {
      success: true,
      message: 'User data fixed successfully',
    };
  } catch (error) {
    console.error('Error fixing user data:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
