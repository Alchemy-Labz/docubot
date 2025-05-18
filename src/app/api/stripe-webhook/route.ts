/* eslint-disable import/prefer-default-export */
import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/node';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/stripe';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase/firebaseAdmin';

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
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    Sentry.captureException(err);
    return new NextResponse(`Webhook signature verification failed: ${err}`, { status: 400 });
  }

  const getUserDetails = async (customerId: string) => {
    try {
      const userQuery = await adminDb
        .collection('users')
        .where('stripecustomerId', '==', customerId)
        .limit(1)
        .get();

      if (userQuery.empty) {
        console.error(`❌ User not found for Stripe customer ID: ${customerId}`);
        return null;
      }

      return userQuery.docs[0];
    } catch (error) {
      console.error('❌ Error fetching user details:', error);
      return null;
    }
  };

  try {
    console.log(`🔄 Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        console.log('💳 Checkout session completed for customer:', customerId);

        const userDetails = await getUserDetails(customerId);
        if (!userDetails?.id) {
          return new NextResponse('User not found', { status: 404 });
        }

        await adminDb.collection('users').doc(userDetails.id).update({
          hasActiveMembership: true,
        });

        console.log('✅ Membership activated for user:', userDetails.id);
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        console.log('🎯 Subscription created for customer:', customerId);
        console.log('📋 Subscription status:', subscription.status);

        const userDetails = await getUserDetails(customerId);
        if (!userDetails?.id) {
          return new NextResponse('User not found', { status: 404 });
        }

        // Set membership to active if subscription is in a valid state
        const isActive = ['active', 'trialing'].includes(subscription.status);

        await adminDb.collection('users').doc(userDetails.id).update({
          hasActiveMembership: isActive,
        });

        console.log(
          `✅ Membership ${isActive ? 'activated' : 'not activated'} for user:`,
          userDetails.id
        );
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        console.log('🔄 Subscription updated for customer:', customerId);
        console.log('📋 New subscription status:', subscription.status);

        const userDetails = await getUserDetails(customerId);
        if (!userDetails?.id) {
          return new NextResponse('User not found', { status: 404 });
        }

        // Check if subscription is still active
        const isActive = ['active', 'trialing'].includes(subscription.status);

        await adminDb.collection('users').doc(userDetails.id).update({
          hasActiveMembership: isActive,
        });

        console.log(
          `✅ Membership ${isActive ? 'activated' : 'deactivated'} for user:`,
          userDetails.id
        );
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        console.log('❌ Subscription deleted for customer:', customerId);

        const userDetails = await getUserDetails(customerId);
        if (!userDetails?.id) {
          return new NextResponse('User not found', { status: 404 });
        }

        await adminDb.collection('users').doc(userDetails.id).update({
          hasActiveMembership: false,
        });

        console.log('✅ Membership deactivated for user:', userDetails.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        console.log('💰 Invoice payment succeeded for customer:', customerId);

        // Only process if this is for a subscription
        if (invoice.subscription) {
          const userDetails = await getUserDetails(customerId);
          if (!userDetails?.id) {
            return new NextResponse('User not found', { status: 404 });
          }

          await adminDb.collection('users').doc(userDetails.id).update({
            hasActiveMembership: true,
          });

          console.log('✅ Membership activated for user:', userDetails.id);
        }
        break;
      }

      case 'invoice.payment_failed': {
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

    console.log('✅ Webhook processed successfully');
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    Sentry.captureException(error);
    return new NextResponse(
      'Webhook processing error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}
