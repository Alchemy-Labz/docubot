/* eslint-disable import/prefer-default-export */
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { adminApp, adminDb } from '@/lib/firebase/firebaseAdmin';
import { FIREBASE_CONFIG, SUCCESS_MESSAGES } from '@/lib/constants/appConstants';
import { initializeUser, initializeNewUser } from '@/actions/initializeUser';

// Add a GET method for testing
export async function GET() {
  console.log('Clerk webhook GET endpoint hit - route is accessible');
  return NextResponse.json({
    message: 'Clerk webhook endpoint is accessible',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: Request) {
  console.log('🚀 Clerk webhook POST endpoint hit!');
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

  try {
    // 👽️ This Webhook Secret is provided by the clerks dashboard > webhooks >endpoint > signing secret
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error('WEBHOOK_SECRET not found in environment variables');
      return new NextResponse('Webhook secret not configured', { status: 500 });
    }

    console.log('WEBHOOK_SECRET found, proceeding with verification');

    // Get the headers and svix signature payload to verify the request is from Clerk
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

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
      console.log(`Webhook with an ID of ${userId} and type of ${eventType}`);
    } else if (eventType === 'session.created' || eventType === 'session.removed') {
      userId = evt.data.user_id;
      console.log(`Webhook with an ID of ${userId} and type of ${eventType}`);
    }

    if (!userId) {
      console.error('No user ID found in webhook event');
      return new NextResponse('Missing user ID in webhook event', { status: 400 });
    }

    if (eventType === 'user.created' || eventType === 'user.updated') {
      try {
        // Generate a Firebase custom token based on the users Clerk ID
        const firebaseAuth = getAuth(adminApp);
        const tokenSettings = {
          expiresIn: FIREBASE_CONFIG.TOKEN_EXPIRY_SECONDS,
        };
        const firebaseToken = await firebaseAuth.createCustomToken(userId, tokenSettings);

        // Safely handle potentially null name parts
        const firstName = evt.data.first_name || '';
        const lastName = evt.data.last_name || '';
        const name =
          firstName && lastName
            ? `${firstName} ${lastName}`
            : firstName || lastName || evt.data.username || 'User';

        // Get email safely
        const emailAddress =
          evt.data.email_addresses &&
          evt.data.email_addresses.length > 0 &&
          evt.data.email_addresses[0].email_address
            ? evt.data.email_addresses[0].email_address
            : '';

        if (eventType === 'user.created') {
          console.log(`Creating new user ${userId} with data:`, {
            email: emailAddress,
            firstName: firstName,
            lastName: lastName,
            username: evt.data.username,
          });

          // Use the new comprehensive initialization system
          const initResult = await initializeUser(userId, {
            email: emailAddress,
            firstName: firstName,
            lastName: lastName,
            username: evt.data.username || undefined,
            clerkId: userId,
            isSignup: true,
          });

          console.log(`New user ${userId} initialization result:`, initResult);

          if (!initResult.success) {
            console.error(`Failed to initialize user ${userId}:`, initResult.message);
            return new NextResponse(`Failed to initialize user: ${initResult.message}`, {
              status: 500,
            });
          }
        } else {
          console.log(`Updating user ${userId} with data:`, {
            email: emailAddress,
            firstName: firstName,
            lastName: lastName,
            username: evt.data.username,
          });

          // For updates, use the initialization system to update user data
          const initResult = await initializeUser(userId, {
            email: emailAddress,
            firstName: firstName,
            lastName: lastName,
            username: evt.data.username || undefined,
            clerkId: userId,
            isSignup: false,
          });

          console.log(`User ${userId} update result:`, initResult);

          if (!initResult.success) {
            console.error(`Failed to update user ${userId}:`, initResult.message);
            return new NextResponse(`Failed to update user: ${initResult.message}`, {
              status: 500,
            });
          }
        }

        console.log(SUCCESS_MESSAGES.FIREBASE_TOKEN_GENERATED + ` for user ${userId}`);
      } catch (error) {
        console.error('Error generating or storing Firebase token:', error);
        return new NextResponse(
          'Error processing webhook: ' + (error instanceof Error ? error.message : String(error)),
          { status: 500 }
        );
      }
    }

    if (eventType === 'session.created') {
      console.log('Session created:', evt.data);
      try {
        // Update last login timestamp when session is created
        await adminDb.collection('users').doc(userId).update({
          lastLogin: new Date(),
          lastTokenRefresh: new Date(),
          lastUpdated: new Date(),
          clerkId: userId,
        });

        console.log(`Session created and login timestamp updated for user ${userId}`);
      } catch (error) {
        console.error('Error updating session data:', error);
        return new NextResponse(
          'Error processing webhook: ' + (error instanceof Error ? error.message : String(error)),
          { status: 500 }
        );
      }
    }

    console.log('✅ Webhook processed successfully');
    return new NextResponse('Webhook processed successfully', {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Global error handler to prevent unhandled exceptions
    console.error('❌ Unhandled error in webhook processing:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return new NextResponse(
      JSON.stringify({
        error: 'Error processing webhook',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
