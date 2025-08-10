/* eslint-disable import/prefer-default-export */
// app/api/firebase-token/route.ts

import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { generateFirebaseToken } from '@/actions/tokenActions';
import { adminDb } from '@/lib/firebase/firebaseAdmin';

export async function POST(req: NextRequest) {
  console.log('🔥🔥🔥 NEW Firebase token API route called - VERSION 2.0 🔥🔥🔥');

  try {
    const auth = getAuth(req);
    const userId = auth.userId;

    if (!userId) {
      console.error('NEW Token API: No userId in request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`NEW Token API: Processing request for user ${userId}`);

    // Generate a fresh Firebase token directly
    console.log(`NEW Token API: Generating fresh Firebase token for user ${userId}`);
    const firebaseToken = await generateFirebaseToken(userId);

    if (!firebaseToken) {
      console.error(`NEW Token API: Failed to generate token for user ${userId}`);
      return NextResponse.json({ error: 'Failed to create token' }, { status: 500 });
    }

    // Store the token in the user's Firestore document
    try {
      console.log(`NEW Token API: Storing token in Firestore for user ${userId}`);
      const userDocRef = adminDb.collection('users').doc(userId);

      // Use set with merge to handle both new and existing documents
      await userDocRef.set(
        {
          firebaseToken,
          lastTokenRefresh: new Date(),
        },
        { merge: true }
      );

      console.log(`NEW Token API: Successfully stored token in Firestore for user ${userId}`);
    } catch (storageError) {
      console.warn(
        `NEW Token API: Could not store token in Firestore for user ${userId}:`,
        storageError
      );
      // Don't fail the API call if storage fails - the token was generated successfully
    }

    console.log(`NEW Token API: Successfully generated token for user ${userId}`);
    return NextResponse.json({ firebaseToken }, { status: 200 });
  } catch (error) {
    console.error('NEW Token API: Error generating Firebase token:', error);
    return NextResponse.json(
      {
        error: 'Failed to create token',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Add GET method for testing
export async function GET() {
  console.log('🔥🔥🔥 NEW Firebase token API GET route called - VERSION 2.0 🔥🔥🔥');
  return NextResponse.json(
    {
      message: 'NEW Firebase token API is working - VERSION 2.0',
      timestamp: new Date().toISOString(),
      version: '2.0',
    },
    { status: 200 }
  );
}
