'use server';

import { auth } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { clerkClient } from '@clerk/nextjs/server';
import { initializeUser } from './initializeUser';

/**
 * Admin-only migration management functions
 * These functions should only be accessible to administrators
 */

async function verifyAdminAccess() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Authentication required');
  }

  // Check if user is admin (you can implement your own admin check logic)
  const userDoc = await adminDb.collection('users').doc(userId).get();
  const userData = userDoc.data();

  if (!userData?.isAdmin) {
    throw new Error('Admin access required');
  }

  return userId;
}

export async function getMigrationStats() {
  await verifyAdminAccess();

  try {
    console.log('📊 Fetching migration statistics...');

    // Get all users
    const usersSnapshot = await adminDb.collection('users').get();
    const totalUsers = usersSnapshot.size;

    // Count migrated users (users with migrationDate)
    const migratedUsers = usersSnapshot.docs.filter(
      (doc) => doc.data().migrationDate !== undefined
    ).length;

    // Get migration failures
    const failuresSnapshot = await adminDb.collection('migration_failures').get();
    const failedMigrations = failuresSnapshot.size;

    // Calculate pending migrations (users without migrationDate and not failed)
    const pendingMigrations = totalUsers - migratedUsers;

    // Calculate migration rate
    const migrationRate = totalUsers > 0 ? (migratedUsers / totalUsers) * 100 : 0;

    // Get last migration date
    const lastMigrationQuery = await adminDb
      .collection('users')
      .where('migrationDate', '!=', null)
      .orderBy('migrationDate', 'desc')
      .limit(1)
      .get();

    const lastMigrationDate = lastMigrationQuery.empty
      ? null
      : lastMigrationQuery.docs[0].data().migrationDate?.toDate()?.toISOString() || null;

    const stats = {
      totalUsers,
      migratedUsers,
      pendingMigrations,
      failedMigrations,
      migrationRate,
      lastMigrationDate,
    };

    console.log('✅ Migration statistics retrieved:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error fetching migration stats:', error);
    throw new Error(
      `Failed to fetch migration statistics: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function getMigrationFailures() {
  await verifyAdminAccess();

  try {
    console.log('📋 Fetching migration failures...');

    const failuresSnapshot = await adminDb
      .collection('migration_failures')
      .orderBy('timestamp', 'desc')
      .limit(100) // Limit to last 100 failures
      .get();

    const failures = failuresSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    }));

    console.log(`✅ Retrieved ${failures.length} migration failures`);
    return failures;
  } catch (error) {
    console.error('❌ Error fetching migration failures:', error);
    throw new Error(
      `Failed to fetch migration failures: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function retryFailedMigration(userId: string) {
  await verifyAdminAccess();

  try {
    console.log(`🔄 Retrying migration for user ${userId}...`);

    // Get the latest failure record for this user
    const failureQuery = await adminDb
      .collection('migration_failures')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();

    if (failureQuery.empty) {
      throw new Error(`No migration failure found for user ${userId}`);
    }

    const failureData = failureQuery.docs[0].data();

    // Fetch user data from Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    // Extract user data
    const email = clerkUser.emailAddresses?.[0]?.emailAddress || '';
    const firstName = clerkUser.firstName || '';
    const lastName = clerkUser.lastName || '';
    const username = clerkUser.username || undefined;

    // Determine if this is an existing user
    const accountAge = Date.now() - clerkUser.createdAt;
    const isExistingUser = accountAge > 60 * 60 * 1000; // 1 hour

    // Attempt migration
    const initResult = await initializeUser(userId, {
      email,
      firstName,
      lastName,
      username,
      clerkId: userId,
      isSignup: !isExistingUser,
    });

    if (initResult.success) {
      // Migration successful, add metadata and remove failure record
      const userRef = adminDb.collection('users').doc(userId);
      await userRef.update({
        migrationDate: new Date(),
        migrationSource: 'admin_retry',
        retryCount: (failureData.retryCount || 0) + 1,
        lastLogin: new Date(),
        lastTokenRefresh: new Date(),
      });

      // Remove the failure record
      await failureQuery.docs[0].ref.delete();

      console.log(`✅ Successfully retried migration for user ${userId}`);
      return { success: true, message: 'Migration retry successful' };
    } else {
      // Migration failed again, update failure record
      await failureQuery.docs[0].ref.update({
        retryCount: (failureData.retryCount || 0) + 1,
        lastRetryAt: new Date(),
        lastError: initResult.message,
      });

      console.log(`❌ Migration retry failed for user ${userId}: ${initResult.message}`);
      throw new Error(`Migration retry failed: ${initResult.message}`);
    }
  } catch (error) {
    console.error(`❌ Error retrying migration for user ${userId}:`, error);
    throw new Error(
      `Failed to retry migration: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function cleanupMigrationData() {
  await verifyAdminAccess();

  try {
    console.log('🧹 Cleaning up migration data...');

    // Delete migration failures older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldFailuresQuery = await adminDb
      .collection('migration_failures')
      .where('timestamp', '<', thirtyDaysAgo)
      .get();

    const batch = adminDb.batch();
    oldFailuresQuery.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    console.log(`✅ Cleaned up ${oldFailuresQuery.size} old migration failure records`);
    return {
      success: true,
      message: `Cleaned up ${oldFailuresQuery.size} old migration records`,
      deletedCount: oldFailuresQuery.size,
    };
  } catch (error) {
    console.error('❌ Error cleaning up migration data:', error);
    throw new Error(
      `Failed to cleanup migration data: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function forceMigrationForUser(userId: string) {
  await verifyAdminAccess();

  try {
    console.log(`🔧 Forcing migration for user ${userId}...`);

    // Check if user already exists in database
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      console.log(`User ${userId} already exists in database`);
      return { success: true, message: 'User already migrated' };
    }

    // Fetch user data from Clerk and initialize
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    const email = clerkUser.emailAddresses?.[0]?.emailAddress || '';
    const firstName = clerkUser.firstName || '';
    const lastName = clerkUser.lastName || '';
    const username = clerkUser.username || undefined;

    const accountAge = Date.now() - clerkUser.createdAt;
    const isExistingUser = accountAge > 60 * 60 * 1000;

    const initResult = await initializeUser(userId, {
      email,
      firstName,
      lastName,
      username,
      clerkId: userId,
      isSignup: !isExistingUser,
    });

    if (initResult.success) {
      await userRef.update({
        migrationDate: new Date(),
        migrationSource: 'admin_force',
        lastLogin: new Date(),
        lastTokenRefresh: new Date(),
      });

      console.log(`✅ Successfully forced migration for user ${userId}`);
      return { success: true, message: 'Migration completed successfully' };
    } else {
      throw new Error(initResult.message);
    }
  } catch (error) {
    console.error(`❌ Error forcing migration for user ${userId}:`, error);
    throw new Error(
      `Failed to force migration: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
