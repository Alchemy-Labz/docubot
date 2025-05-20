/* eslint-disable import/prefer-default-export */
// app/api/firebase-token/route.ts

import { getAuth } from '@clerk/nextjs/server';
import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';
import { isTokenExpiredAction } from '@/actions/tokenActions';

export async function POST(req: NextRequest) {
  const auth = getAuth(req);
  const userId = auth.userId;

  if (!userId) {
    console.error('Token API: No userId in request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log(`Token API: Processing request for user ${userId}`);

  try {
    // First check if the user document exists at all
    const userDoc = await adminDb.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      console.log(`Token API: User document doesn't exist for ${userId}, creating fallback token`);

      // Generate a fallback token through the token action
      const tokenExpired = await isTokenExpiredAction(userId);

      if (tokenExpired) {
        // The token action should have created a new token
        const refreshedDoc = await adminDb.collection('users').doc(userId).get();
        const refreshedData = refreshedDoc.data();

        if (!refreshedData || !refreshedData.firebaseToken) {
          console.error(`Token API: Failed to create token for new user ${userId}`);
          return NextResponse.json({ error: 'Failed to create token' }, { status: 500 });
        }

        return NextResponse.json({ firebaseToken: refreshedData.firebaseToken }, { status: 200 });
      } else {
        console.error(`Token API: Unexpected state - token not expired but user doesn't exist`);
        return NextResponse.json({ error: 'Inconsistent token state' }, { status: 500 });
      }
    }

    // For existing users, check if token is expired and refresh if needed
    console.log(`Token API: Checking token expiry for user ${userId}`);
    const tokenExpired = await isTokenExpiredAction(userId);

    // Whether expired or not, we now fetch the current token
    const currentUserDoc = await adminDb.collection('users').doc(userId).get();
    const userData = currentUserDoc.data();

    if (!userData || !userData.firebaseToken) {
      console.error(`Token API: No Firebase token found for user ${userId}`);
      return NextResponse.json({ error: 'Firebase token not found' }, { status: 404 });
    }

    console.log(`Token API: Returning token for user ${userId} (was expired: ${tokenExpired})`);
    return NextResponse.json({ firebaseToken: userData.firebaseToken }, { status: 200 });
  } catch (error) {
    console.error('Token API: Error fetching Firebase token:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
