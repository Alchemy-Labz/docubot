/* eslint-disable import/prefer-default-export */
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { adminApp, adminDb } from '@/lib/firebase/firebaseAdmin';

export async function POST(req: Request) {
  // 👽️ This Webhook Secret is provided by the clerks dashboard > webhooks >endpoint > signing secret
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers and svix signature payload to verify the request is from Clerk
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // 📋 To-Do: Report event to sentry
  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Security Event Detected. Header signatures are not present', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  console.log('🦟 ~ Clerk-Webhook API Route ~ Response Payload:', payload);
  const body = JSON.stringify(payload);
  // console.log('🦟 ~ Clerk-Webhook API Route ~ Response Body:', body);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    // 📋 To-Do: Report event to sentry
    console.error('Security Event Detected. Error verifying webhook:', err);
    return new NextResponse('Security Event Detected. Error verifying webhook', { status: 400 });
  }

  // Process the webhook
  // Use the event type to determine which function to pass the payload to.
  const eventType = evt.type;
  console.log('🚀 ~ POST ~ eventType:', eventType);

  // Get the Clerk user ID from the event data
  let userId;
  if (eventType === 'user.created' || eventType === 'user.updated') {
    userId = evt.data.id;
    // Log the user ID and event type to the console to check if the event is being processed correctly
    console.log(`Webhook with an ID of ${userId} and type of ${eventType}`);
  } else if (eventType === 'session.created') {
    userId = evt.data.user_id;
    // Log the user ID and event type to the console to check if the event is being processed correctly
    console.log(`Webhook with an ID of ${userId} and type of ${eventType}`);
  }

  if (eventType === 'user.created' || eventType === 'user.updated') {
    try {
      // Generate a Firebase custom token based on the users Clerk ID
      const firebaseAuth = getAuth(adminApp);
      const tokenSettings = {
        expiresIn: 60 * 60 * 24 * 30 * 1000, // 5 days
      };
      const firebaseToken = await firebaseAuth.createCustomToken(userId!, tokenSettings);

      const name = evt.data.first_name + ' ' + evt.data.last_name;

      // Store the Firebase token in Firestore
      await adminDb.collection('users').doc(userId!).set(
        {
          firebaseToken: firebaseToken,
          lastUpdated: new Date(),
          email: evt.data.email_addresses[0].email_address,
          name: name,
          username: evt.data.username,
        },
        { merge: true }
      );

      console.log(`Firebase token generated and stored for user ${userId}`);
    } catch (error) {
      console.error('Error generating or storing Firebase token:', error);
      return new NextResponse('Error processing webhook', { status: 500 });
    }
  }

  if (eventType === 'session.created') {
    console.log('Session created:', evt.data);
    try {
      // Handle the session.created event
      // You can access the session data using evt.data.session
      // You can perform any necessary actions based on the session creation
      // For example, you can log the session data to the console
      const firebaseAuth = getAuth(adminApp);
      const tokenSettings = {
        expiresIn: 60 * 60 * 24 * 30 * 1000, // 5 days
      };
      const firebaseToken = await firebaseAuth.createCustomToken(userId!, tokenSettings);
      console.log('🚀 ~ POST ~ firebaseToken:', firebaseToken);

      await adminDb.collection('users').doc(userId!).set(
        {
          firebaseToken: firebaseToken,
          lastUpdated: new Date(),
        },
        { merge: true }
      );
      console.log(`Firebase token generated and stored for user ${userId}`);
    } catch (error) {
      console.error('Error generating or storing Firebase token:', error);
      return new NextResponse('Error processing webhook', { status: 500 });
    }
  }

  return new NextResponse('Webhook processed', { status: 200 });
}
