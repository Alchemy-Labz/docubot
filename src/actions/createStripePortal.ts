/* eslint-disable import/prefer-default-export */
'use server';

import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { stripe } from '@/lib/stripe/stripe';
import { getBaseURL } from '@/util/getBaseURL';
import { auth } from '@clerk/nextjs/server';
import { ERROR_MESSAGES } from '@/lib/constants/appConstants';

export async function createStripePortal() {
  // Protect the endpoint
  auth.protect();

  // Get the authenticated user ID
  const { userId } = await auth();

  // Throw an Error if no userId is found
  if (!userId) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
  }

  // Get the user document from Firestore
  const userDoc = await adminDb.collection('users').doc(userId).get();
  console.log('🚀 ~ createStripePortal ~ userId:', userId);

  // Retrieve the Stripe customer ID from the user document
  const stripeCustomerId = userDoc.data()?.stripecustomerId;
  console.log('🚀 ~ createStripePortal ~ stripeCustomerId:', stripeCustomerId);

  // Check if stripeCustomerId exists
  if (!stripeCustomerId) {
    throw new Error(ERROR_MESSAGES.STRIPE_CUSTOMER_NOT_FOUND);
  }

  // Create a Stripe billing portal session
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${getBaseURL()}/dashboard`,
  });

  // Return the session URL
  return session.url;
}
