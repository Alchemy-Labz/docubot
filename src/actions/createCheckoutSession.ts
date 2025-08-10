/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
'use server';
import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { UserDetails } from '@/app/dashboard/upgrade/page';
import { stripe } from '@/lib/stripe/stripe';
import { auth } from '@clerk/nextjs/server';
import { getBaseURL } from '@/util/getBaseURL';
import { STRIPE_CONFIG, ERROR_MESSAGES, PLAN_TYPES } from '@/lib/constants/appConstants';

export async function createCheckoutSession(
  userDetails: UserDetails,
  planType: string = PLAN_TYPES.PRO,
  isAnnual: boolean = false
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
  }

  // Determine the correct price ID based on plan type and billing frequency
  let priceId: string = STRIPE_CONFIG.PRICE_ID; // Default fallback - explicitly typed as string

  if (planType === PLAN_TYPES.PRO) {
    priceId = isAnnual ? STRIPE_CONFIG.PRICE_IDS.PRO_YEARLY : STRIPE_CONFIG.PRICE_IDS.PRO_MONTHLY;
  } else if (planType === PLAN_TYPES.TEAM) {
    priceId = isAnnual
      ? STRIPE_CONFIG.PRICE_IDS.TEAM_YEARLY
      : STRIPE_CONFIG.PRICE_IDS.TEAM_MONTHLY;
  }

  console.log(
    `Creating checkout session for plan: ${planType}, annual: ${isAnnual}, priceId: ${priceId}`
  );

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
        price: priceId,
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    mode: 'subscription',
    metadata: {
      business_name: 'DocuBot',
    },
    customer: stripecustomerId,
    // getBaseURL works and the function runs past here
    success_url: `${getBaseURL()}dashboard?upgrade=true`,
    cancel_url: `${getBaseURL()}dashboard/upgrade?upgrade=false`,
  });

  return session.id;
}
