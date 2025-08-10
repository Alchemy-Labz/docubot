'use server';

import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { auth } from '@clerk/nextjs/server';
import { PLAN_TYPES } from '@/lib/constants/appConstants';
import type { UserDocument } from '@/models/types/firebaseTypes';

/**
 * Migrates a single user to the new user document structure
 */
export async function migrateUserDocument(userId: string): Promise<{
  success: boolean;
  message: string;
  needsOnboarding?: boolean;
}> {
  try {
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return {
        success: false,
        message: 'User document not found',
      };
    }

    const existingData = userDoc.data();

    // Check if already migrated
    if (existingData?.isUserInitialized !== undefined) {
      return {
        success: true,
        message: 'User already migrated',
        needsOnboarding: !existingData.isUserInitialized,
      };
    }

    const now = new Date();

    // Extract name parts from existing name field
    const fullName = existingData?.name || '';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Check what fields are missing for complete initialization
    const missingFields: string[] = [];
    if (!existingData?.email) missingFields.push('email');
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
    if (!existingData?.username) missingFields.push('username');

    const needsOnboarding = missingFields.length > 0;

    // Prepare migration data
    const migrationData: Partial<UserDocument> = {
      // Core identification
      clerkId: existingData?.clerkId || userId,
      email: existingData?.email || '',
      
      // Personal information
      firstName: firstName,
      lastName: lastName,
      username: existingData?.username || '',
      
      // Computed name field
      name: firstName && lastName ? `${firstName} ${lastName}` : fullName || 'User',
      
      // Subscription and billing (preserve existing)
      planType: existingData?.planType || PLAN_TYPES.STARTER,
      stripecustomerId: existingData?.stripecustomerId || null,
      
      // Timestamps
      registrationDate: existingData?.createdAt || existingData?.registrationDate || now,
      lastLogin: now, // Set to now since they're accessing the system
      lastTokenRefresh: existingData?.lastTokenRefresh || now,
      createdAt: existingData?.createdAt || now,
      lastUpdated: now,
      
      // Initialization tracking
      isUserInitialized: !needsOnboarding,
    };

    // Remove deprecated fields
    const fieldsToRemove = ['firebaseToken'];
    const updateData = { ...migrationData };
    
    // Firestore doesn't have a direct way to remove fields in a merge operation,
    // so we'll use FieldValue.delete() for deprecated fields
    const { FieldValue } = require('firebase-admin/firestore');
    fieldsToRemove.forEach(field => {
      if (existingData?.[field] !== undefined) {
        updateData[field] = FieldValue.delete();
      }
    });

    // Update the user document
    await userRef.set(updateData, { merge: true });

    console.log(`User ${userId} migrated successfully. Needs onboarding: ${needsOnboarding}`);

    return {
      success: true,
      message: needsOnboarding 
        ? 'User migrated, onboarding required' 
        : 'User migrated successfully',
      needsOnboarding,
    };

  } catch (error) {
    console.error(`Error migrating user ${userId}:`, error);
    return {
      success: false,
      message: `Migration failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Migrates the current authenticated user
 */
export async function migrateCurrentUser(): Promise<{
  success: boolean;
  message: string;
  needsOnboarding?: boolean;
}> {
  try {
    auth.protect();
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: 'User authentication failed',
      };
    }

    return await migrateUserDocument(userId);
  } catch (error) {
    console.error('Error migrating current user:', error);
    return {
      success: false,
      message: `Migration failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Batch migration for multiple users (admin only)
 */
export async function batchMigrateUsers(userIds: string[]): Promise<{
  success: boolean;
  results: Array<{
    userId: string;
    success: boolean;
    message: string;
    needsOnboarding?: boolean;
  }>;
}> {
  try {
    auth.protect();
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
      throw new Error('User authentication failed');
    }

    // Check if current user is admin (you may need to adjust this check)
    const currentUserDoc = await adminDb.collection('users').doc(currentUserId).get();
    const isAdmin = currentUserDoc.data()?.isAdmin === true;

    if (!isAdmin) {
      throw new Error('Admin privileges required');
    }

    const results = [];

    for (const userId of userIds) {
      const result = await migrateUserDocument(userId);
      results.push({
        userId,
        ...result,
      });
    }

    return {
      success: true,
      results,
    };

  } catch (error) {
    console.error('Error in batch migration:', error);
    throw error;
  }
}

/**
 * Get migration status for all users (admin only)
 */
export async function getMigrationStatus(): Promise<{
  total: number;
  migrated: number;
  needsMigration: number;
  needsOnboarding: number;
}> {
  try {
    auth.protect();
    const { userId } = await auth();

    if (!userId) {
      throw new Error('User authentication failed');
    }

    // Check if current user is admin
    const currentUserDoc = await adminDb.collection('users').doc(userId).get();
    const isAdmin = currentUserDoc.data()?.isAdmin === true;

    if (!isAdmin) {
      throw new Error('Admin privileges required');
    }

    const usersSnapshot = await adminDb.collection('users').get();
    
    let total = 0;
    let migrated = 0;
    let needsMigration = 0;
    let needsOnboarding = 0;

    usersSnapshot.forEach(doc => {
      total++;
      const data = doc.data();
      
      if (data.isUserInitialized !== undefined) {
        migrated++;
        if (!data.isUserInitialized) {
          needsOnboarding++;
        }
      } else {
        needsMigration++;
      }
    });

    return {
      total,
      migrated,
      needsMigration,
      needsOnboarding,
    };

  } catch (error) {
    console.error('Error getting migration status:', error);
    throw error;
  }
}
