import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be a defined environment variable');
}

const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(publicKey);
  }

  return stripePromise;
};

export default getStripe;
