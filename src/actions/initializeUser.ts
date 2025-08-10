'use server';

import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { PLAN_TYPES } from '@/lib/constants/appConstants';
import { validateUsername } from './validateUsername';
import type {
  UserInitializationData,
  UserInitializationResponse,
  UserDocument,
} from '@/models/types/firebaseTypes';

/**
 * Comprehensive user initialization system that runs once on first login/signup
 * Handles both new signups and existing Clerk users who haven't been initialized
 */
export async function initializeUser(
  userId: string,
  userData: UserInitializationData
): Promise<UserInitializationResponse> {
  if (!userId) {
    throw new Error('User ID is required for initialization');
  }

  const userRef = adminDb.collection('users').doc(userId);
  const userDoc = await userRef.get();
  const existingData = userDoc.exists ? userDoc.data() : null;

  // Check if user is already initialized
  if (existingData?.isUserInitialized === true) {
    console.log(`User ${userId} is already initialized`);
    return {
      success: true,
      needsOnboarding: false,
      message: 'User already initialized',
    };
  }

  try {
    // Determine what data we have and what's missing
    const email = userData.email || existingData?.email || '';
    const firstName = userData.firstName || existingData?.firstName || '';
    const lastName = userData.lastName || existingData?.lastName || '';
    const username = userData.username || existingData?.username || '';

    console.log(`Initializing user ${userId} with data:`, {
      email,
      firstName,
      lastName,
      username,
      isSignup: userData.isSignup,
    });

    // Check for missing required fields
    const missingFields: string[] = [];
    if (!email) missingFields.push('email');
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
    if (!username) missingFields.push('username');

    // If we have a username, validate it
    if (username) {
      console.log(
        `Validating username "${username}" for user ${userId}, isSignup: ${userData.isSignup}`
      );

      const usernameValidation = await validateUsername(username, {
        skipAvailabilityCheck: userData.isSignup, // Skip availability check for signups from Clerk
        excludeUserId: userId, // Allow the same user to keep their username
      });

      console.log(`Username validation result for "${username}":`, usernameValidation);

      if (!usernameValidation.isValid || !usernameValidation.isAvailable) {
        console.log(`Username "${username}" failed validation, adding to missing fields`);
        missingFields.push('username');
      }
    }

    const now = new Date();
    const needsOnboarding = missingFields.length > 0;

    // Prepare user document data
    const userDocumentData: Partial<UserDocument> = {
      // Core identification
      clerkId: userData.clerkId || userId,
      email,

      // Personal information (only set if we have the data)
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(username && { username }),

      // Computed name field
      name:
        firstName && lastName
          ? `${firstName} ${lastName}`
          : firstName || lastName || username || 'User',

      // Subscription and billing
      planType: existingData?.planType || PLAN_TYPES.STARTER,
      stripecustomerId: existingData?.stripecustomerId || null,

      // Timestamps
      registrationDate: existingData?.registrationDate || existingData?.createdAt || now,
      lastLogin: now,
      lastTokenRefresh: now,
      createdAt: existingData?.createdAt || now,
      lastUpdated: now,

      // Initialization tracking - only set to true if we have all required data
      isUserInitialized: !needsOnboarding,
    };

    // Update the user document
    await userRef.set(userDocumentData, { merge: true });

    // Create an empty files collection if it doesn't exist
    // This helps avoid loading states getting stuck when checking document counts
    const filesCollectionRef = userRef.collection('files');

    console.log(`User ${userId} initialization completed. Needs onboarding: ${needsOnboarding}`);
    console.log(`Missing fields for user ${userId}:`, missingFields);

    const result = {
      success: true,
      needsOnboarding,
      message: needsOnboarding
        ? 'User partially initialized, onboarding required'
        : 'User fully initialized',
      missingFields: needsOnboarding ? missingFields : undefined,
    };

    console.log(`Final initialization result for user ${userId}:`, result);
    return result;
  } catch (error) {
    console.error(`Error initializing user ${userId}:`, error);
    throw new Error(
      `Failed to initialize user: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Completes the user onboarding process by collecting missing information
 */
export async function completeUserOnboarding(
  userId: string,
  onboardingData: {
    firstName?: string;
    lastName?: string;
    username?: string;
  }
): Promise<UserInitializationResponse> {
  if (!userId) {
    throw new Error('User ID is required for onboarding completion');
  }

  const userRef = adminDb.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error('User document not found');
  }

  const existingData = userDoc.data();

  // Validate username if provided
  if (onboardingData.username) {
    const usernameValidation = await validateUsername(onboardingData.username, {
      excludeUserId: userId, // Allow the same user to keep their username
    });
    if (!usernameValidation.isValid || !usernameValidation.isAvailable) {
      return {
        success: false,
        needsOnboarding: true,
        message: usernameValidation.message || 'Username validation failed',
      };
    }
  }

  try {
    const firstName = onboardingData.firstName || existingData?.firstName || '';
    const lastName = onboardingData.lastName || existingData?.lastName || '';
    const username = onboardingData.username || existingData?.username || '';

    // Check if all required fields are now present
    const missingFields: string[] = [];
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
    if (!username) missingFields.push('username');

    if (missingFields.length > 0) {
      return {
        success: false,
        needsOnboarding: true,
        message: 'Missing required fields',
        missingFields,
      };
    }

    const now = new Date();

    // Update user document with onboarding data
    const updateData: Partial<UserDocument> = {
      firstName,
      lastName,
      username,
      name: `${firstName} ${lastName}`,
      lastUpdated: now,
      isUserInitialized: true, // Mark as fully initialized
    };

    await userRef.update(updateData);

    console.log(`User ${userId} onboarding completed successfully`);

    return {
      success: true,
      needsOnboarding: false,
      message: 'Onboarding completed successfully',
    };
  } catch (error) {
    console.error(`Error completing onboarding for user ${userId}:`, error);
    throw new Error(
      `Failed to complete onboarding: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use initializeUser instead
 */
export async function initializeNewUser(
  userId: string,
  userData: {
    email?: string;
    firstName?: string;
    lastName?: string;
    username?: string | undefined;
    clerkId?: string;
    isSignup?: boolean;
    firebaseToken?: string;
    name?: string;
  }
): Promise<{ success: boolean; needsOnboarding: boolean; message?: string }> {
  console.warn('initializeNewUser is deprecated. Use initializeUser instead.');

  const result = await initializeUser(userId, {
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    username: userData.username,
    clerkId: userData.clerkId,
    isSignup: userData.isSignup,
  });

  return {
    success: result.success,
    needsOnboarding: result.needsOnboarding,
    message: result.message,
  };
}
