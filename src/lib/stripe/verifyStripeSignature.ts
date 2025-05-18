import { stripe } from './stripe';

export default function verifyStripeSignature(body: string, signature: string | null) {
  if (!signature) {
    throw new Error('No signature found in request headers');
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('No STRIPE_WEBHOOK_SECRET defined');
  }
  return stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
}
