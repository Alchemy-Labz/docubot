/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
'use server';
import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { UserDetails } from '@/app/dashboard/upgrade/page';
import { stripe } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';
import { getBaseURL } from '@/util/getBaseURL';
export async function createCheckoutSession(userDetails: UserDetails) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('No user found');
  }

  // Check if the user already has a stripecustomerId in our database
  let stripecustomerId;

  const user = await adminDb.collection('users').doc(userId).get();
  console.log('🚀 ~ createCheckoutSession ~ userId:', userId);

  stripecustomerId = user.data()?.stripecustomerId;
  console.log('🚀 ~ createCheckoutSession ~ stripecustomerId:', stripecustomerId);

  if (!stripecustomerId) {
    // Create a new customer in stripe
    const customer = await stripe.customers.create({
      email: userDetails.email,
      name: userDetails.name,
      metadata: {
        userId,
      },
    });

    // This Works and puts the stripe ID in the database
    await adminDb.collection('users').doc(userId).update({
      stripecustomerId: customer.id,
    });
    stripecustomerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // price: 'price_1Pj3axL5fHlelvMafHXvd27p',
        price: 'price_1RPxUwL5fHlelvMazFyq1jW4',
        quantity: 1,
      },
    ],
    mode: 'subscription',
    customer: stripecustomerId,
    // getBaseURL works and the function runs past here
    success_url: `${getBaseURL()}dashboard?upgrade=true`,
    cancel_url: `${getBaseURL()}dashboard/upgrade?upgrade=false`,
  });

  return session.id;
}
