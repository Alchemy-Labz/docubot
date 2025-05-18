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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tokenExpired = await isTokenExpiredAction(userId);

    if (tokenExpired) {
      // The token was expired and has been refreshed in the server action
      // Fetch the new token from the database
      const userDoc = await adminDb.collection('users').doc(userId).get();
      const userData = userDoc.data();

      if (!userData || !userData.firebaseToken) {
        return NextResponse.json({ error: 'Firebase token not found' }, { status: 404 });
      }

      return NextResponse.json({ firebaseToken: userData.firebaseToken }, { status: 200 });
    } else {
      // Token is still valid, fetch and return it
      const userDoc = await adminDb.collection('users').doc(userId).get();
      const userData = userDoc.data();

      if (!userData || !userData.firebaseToken) {
        return NextResponse.json({ error: 'Firebase token not found' }, { status: 404 });
      }

      return NextResponse.json({ firebaseToken: userData.firebaseToken }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching Firebase token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
