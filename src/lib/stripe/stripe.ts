/* eslint-disable import/prefer-default-export */
import { Stripe } from 'stripe';

const secretKey = process.env.STRIPE_API_KEY;

if (!secretKey) {
  throw new Error('STRIPE_SECRET_KEY must be a defined environment variable');
}

export const stripe = new Stripe(secretKey!, {
  apiVersion: '2024-06-20',
  typescript: true,
});
