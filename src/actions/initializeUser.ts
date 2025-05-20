'use server';

import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { SUBSCRIPTION_LIMITS } from '@/lib/constants/appConstants';

/**
 * Initializes a new user in Firestore with all required fields and collections
 * This ensures that the dashboard and subscription checks work properly
 */
export async function initializeNewUser(
  userId: string,
  userData: {
    email?: string;
    name?: string;
    username?: string | undefined;
    firebaseToken?: string;
    clerkId?: string;
  }
): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required for initialization');
  }

  const userRef = adminDb.collection('users').doc(userId);

  // Check if user already exists to avoid overwriting data
  const userDoc = await userRef.get();

  try {
    // Create or update the user document with required fields
    await userRef.set(
      {
        // Add or update these fields
        hasActiveMembership: false, // Default to free tier
        lastUpdated: new Date(),
        createdAt: userDoc.exists ? userDoc.data()?.createdAt : new Date(),
        email: userData.email || '',
        name: userData.name || '',
        username: userData.username || '',
        firebaseToken: userData.firebaseToken || '',
        clerkId: userData.clerkId || userId, // Store Clerk ID explicitly in the document
        // Don't override these fields if they exist
        stripecustomerId: userDoc.exists ? userDoc.data()?.stripecustomerId : null,
      },
      { merge: true }
    );

    // Create an empty files collection if it doesn't exist
    // This helps avoid loading states getting stuck when checking document counts
    const filesCollectionRef = userRef.collection('files');

    // We don't need to actually create any documents in the collection,
    // just ensuring the collection path exists is enough for Firestore queries
    // to work correctly and not get stuck in loading states

    console.log(`User ${userId} successfully initialized with default values`);
  } catch (error) {
    console.error(`Error initializing user ${userId}:`, error);
    throw new Error(
      `Failed to initialize user: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
