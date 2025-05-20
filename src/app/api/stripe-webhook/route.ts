// src/app/api/stripe-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/node';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/stripe';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { STRIPE_CONFIG, SUCCESS_MESSAGES } from '@/lib/constants/appConstants';

// Initialize Sentry (ensure this is done at the start of your application)
if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
  throw new Error('NEXT_PUBLIC_SENTRY_DSN must be a defined environment variable');
}
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
Sentry.init({ dsn: dsn });

console.log('Stripe webhook server started');

export async function POST(request: NextRequest) {
  console.log('Stripe webhook received');
  const headersList = headers();
  const body = await request.text();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('No signature found in request headers');
    return new NextResponse('No signature found in request headers', { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('No STRIPE_WEBHOOK_SECRET defined');
    return new NextResponse('No STRIPE_WEBHOOK_SECRET defined', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Verify the webhook signature and construct the event
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
    console.log('✅ Stripe event verified successfully:', event.type);
    console.log('Event data:', JSON.stringify(event.data.object, null, 2)); // Log the event data for debugging
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    Sentry.captureException(err);
    return new NextResponse(`Webhook signature verification failed: ${err}`, { status: 400 });
  }

  // Enhanced getUserDetails function with more robust error handling and debugging
  const getUserDetails = async (customerId: string) => {
    try {
      console.log(`🔍 Looking up user with Stripe customer ID: ${customerId}`);

      // 1. First try the query method to find by stripecustomerId
      const userQuery = await adminDb
        .collection('users')
        .where('stripecustomerId', '==', customerId)
        .limit(1)
        .get();

      if (!userQuery.empty) {
        console.log(`✅ Found user using stripecustomerId query for ${customerId}`);
        return userQuery.docs[0];
      }

      // 2. If user not found, try to find by metadata in the Stripe customer object
      console.log(`⚠️ User not found with query, fetching customer details from Stripe`);
      try {
        const customer = await stripe.customers.retrieve(customerId);

        if (customer && !customer.deleted && customer.metadata && customer.metadata.userId) {
          const userId = customer.metadata.userId;
          console.log(`🔍 Found userId ${userId} in Stripe customer metadata, checking Firestore`);

          const userDoc = await adminDb.collection('users').doc(userId).get();

          if (userDoc.exists) {
            console.log(`✅ Found user doc by userId ${userId} from metadata`);

            // Update the stripecustomerId if it wasn't set correctly
            if (!userDoc.data()?.stripecustomerId) {
              console.log(`⚠️ Fixing missing stripecustomerId for user ${userId}`);
              await adminDb.collection('users').doc(userId).update({
                stripecustomerId: customerId,
              });
            }

            return userDoc;
          } else {
            console.log(`❌ User document not found for userId ${userId} from metadata`);
          }
        } else {
          console.log(`❌ No valid userId found in Stripe customer metadata`);
        }
      } catch (stripeError) {
        console.error(`❌ Error retrieving customer details from Stripe:`, stripeError);
      }

      // 3. Final fallback: Look for users with matching email if the customer has an email
      try {
        const customer = await stripe.customers.retrieve(customerId);

        if (customer && !customer.deleted && customer.email) {
          console.log(`🔍 Trying to find user by email: ${customer.email}`);

          const usersByEmailQuery = await adminDb
            .collection('users')
            .where('email', '==', customer.email)
            .limit(1)
            .get();

          if (!usersByEmailQuery.empty) {
            const userDoc = usersByEmailQuery.docs[0];
            console.log(`✅ Found user by email ${customer.email}, updating stripecustomerId`);

            // Update the customer ID for this user
            await adminDb.collection('users').doc(userDoc.id).update({
              stripecustomerId: customerId,
            });

            return userDoc;
          }
        }
      } catch (emailLookupError) {
        console.error(`❌ Error trying email fallback lookup:`, emailLookupError);
      }

      console.error(`❌ User not found for Stripe customer ID: ${customerId} after all attempts`);
      return null;
    } catch (error) {
      console.error('❌ Error fetching user details:', error);
      return null;
    }
  };

  try {
    console.log(`🔄 Processing webhook event: ${event.type}`);

    switch (event.type) {
      case STRIPE_CONFIG.WEBHOOK_EVENTS.CHECKOUT_SESSION_COMPLETED: {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        console.log('💳 Checkout session completed for customer:', customerId);

        const userDetails = await getUserDetails(customerId);
        if (!userDetails?.id) {
          console.error(
            `❌ Could not find user for Stripe customer ${customerId} - Session object:`,
            JSON.stringify(session, null, 2)
          );
          // Instead of erroring out with 404, we'll log the issue but return 200
          // This prevents Stripe from retrying the webhook unnecessarily
          return new NextResponse(
            JSON.stringify({ received: true, warning: 'User not found, event logged' }),
            { status: 200 }
          );
        }

        await adminDb.collection('users').doc(userDetails.id).update({
          hasActiveMembership: true,
        });

        console.log(SUCCESS_MESSAGES.MEMBERSHIP_ACTIVATED + ' for user:', userDetails.id);
        break;
      }

      case STRIPE_CONFIG.WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_CREATED: {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        console.log('🎯 Subscription created for customer:', customerId);
        console.log('📋 Subscription status:', subscription.status);

        const userDetails = await getUserDetails(customerId);
        if (!userDetails?.id) {
          console.error(
            `❌ Could not find user for Stripe customer ${customerId} - Subscription object:`,
            JSON.stringify(subscription, null, 2)
          );
          return new NextResponse(
            JSON.stringify({ received: true, warning: 'User not found, event logged' }),
            { status: 200 }
          );
        }

        // Set membership to active if subscription is in a valid state
        const isActive =
          subscription.status === STRIPE_CONFIG.SUBSCRIPTION_STATUSES.ACTIVE ||
          subscription.status === STRIPE_CONFIG.SUBSCRIPTION_STATUSES.TRIALING;

        await adminDb.collection('users').doc(userDetails.id).update({
          hasActiveMembership: isActive,
        });

        console.log(
          `✅ Membership ${isActive ? 'activated' : 'not activated'} for user:`,
          userDetails.id
        );
        break;
      }

      case STRIPE_CONFIG.WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_UPDATED: {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        console.log('🔄 Subscription updated for customer:', customerId);
        console.log('📋 New subscription status:', subscription.status);

        const userDetails = await getUserDetails(customerId);
        if (!userDetails?.id) {
          console.error(
            `❌ Could not find user for Stripe customer ${customerId} - Subscription object:`,
            JSON.stringify(subscription, null, 2)
          );
          return new NextResponse(
            JSON.stringify({ received: true, warning: 'User not found, event logged' }),
            { status: 200 }
          );
        }

        // Check if subscription is still active
        const isActive =
          subscription.status === STRIPE_CONFIG.SUBSCRIPTION_STATUSES.ACTIVE ||
          subscription.status === STRIPE_CONFIG.SUBSCRIPTION_STATUSES.TRIALING;

        await adminDb.collection('users').doc(userDetails.id).update({
          hasActiveMembership: isActive,
        });

        console.log(
          `✅ Membership ${isActive ? 'activated' : 'deactivated'} for user:`,
          userDetails.id
        );
        break;
      }

      case STRIPE_CONFIG.WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_DELETED: {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        console.log('❌ Subscription deleted for customer:', customerId);

        const userDetails = await getUserDetails(customerId);
        if (!userDetails?.id) {
          console.error(
            `❌ Could not find user for Stripe customer ${customerId} - Subscription object:`,
            JSON.stringify(subscription, null, 2)
          );
          return new NextResponse(
            JSON.stringify({ received: true, warning: 'User not found, event logged' }),
            { status: 200 }
          );
        }

        await adminDb.collection('users').doc(userDetails.id).update({
          hasActiveMembership: false,
        });

        console.log('✅ Membership deactivated for user:', userDetails.id);
        break;
      }

      case STRIPE_CONFIG.WEBHOOK_EVENTS.INVOICE_PAYMENT_SUCCEEDED: {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        console.log('💰 Invoice payment succeeded for customer:', customerId);

        // Only process if this is for a subscription
        if (invoice.subscription) {
          const userDetails = await getUserDetails(customerId);
          if (!userDetails?.id) {
            console.error(
              `❌ Could not find user for Stripe customer ${customerId} - Invoice object:`,
              JSON.stringify(invoice, null, 2)
            );
            return new NextResponse(
              JSON.stringify({ received: true, warning: 'User not found, event logged' }),
              { status: 200 }
            );
          }

          await adminDb.collection('users').doc(userDetails.id).update({
            hasActiveMembership: true,
          });

          console.log(SUCCESS_MESSAGES.MEMBERSHIP_ACTIVATED + ' for user:', userDetails.id);
        }
        break;
      }

      case STRIPE_CONFIG.WEBHOOK_EVENTS.INVOICE_PAYMENT_FAILED: {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        console.log('💸 Invoice payment failed for customer:', customerId);

        // Only log this event, don't deactivate membership immediately
        // Stripe will handle retries and eventual subscription cancellation
        console.log('ℹ️ Payment failed, but membership remains active pending retry');
        break;
      }

      default: {
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
      }
    }

    console.log(SUCCESS_MESSAGES.WEBHOOK_PROCESSED);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    Sentry.captureException(error);
    // Return 200 even on error to prevent Stripe from retrying
    // This helps avoid webhook queue backlogs while you fix the issue
    return new NextResponse(
      JSON.stringify({
        received: true,
        error:
          'Webhook processing error: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      }),
      { status: 200 }
    );
  }
}
