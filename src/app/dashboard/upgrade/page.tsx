/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { createCheckoutSession } from '@/actions/createCheckoutSession';
// import { createCheckoutSession } from '@/actions/createCheckoutSession';
import { createStripePortal } from '@/actions/createStripePortal';
import { Button } from '@/components/ui/button';
import useSubscription from '@/hooks/useSubscription';
import getStripe from '@/lib/stripe/stripeConfig';
import { useUser } from '@clerk/nextjs';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { SUBSCRIPTION_LIMITS, PRICING_PLANS, PLAN_TYPES } from '@/lib/constants/appConstants';

export type UserDetails = {
  email: string;
  name: string;
};

const PricingPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { hasPaidPlan, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = () => {
    if (!user || !user.primaryEmailAddress) return;

    const userDetails: UserDetails = {
      email: user.primaryEmailAddress?.toString(),
      name: user.fullName!,
    };

    startTransition(async () => {
      const stripe = await getStripe();

      if (hasPaidPlan) {
        //create stripe portal
        const stripePortalURL = await createStripePortal();
        return router.push(stripePortalURL);
      }

      // Default to Pro plan for dashboard upgrade
      const sessionId = await createCheckoutSession(userDetails, PLAN_TYPES.PRO, false);
      await stripe?.redirectToCheckout({ sessionId });
    });
  };

  return (
    <div className='h-full bg-light-400/40'>
      <div className='py-24 sm:py-32'>
        <div className='mx-auto max-w-4xl px-4 text-center sm:px-6'>
          <h2 className='text-base font-semibold leading-7 text-accent'>Pricing</h2>
          <p className='mt-2 text-4xl font-bold tracking-tight text-dark-800 sm:text-5xl'>
            Powerup Docubot
          </p>
        </div>
        <p className='mx-auto max-w-4xl px-4 py-8 text-center sm:px-6 sm:py-14'>
          Choose an affordable plan packed full of features for interacting with your PDFs,
          enhancing productivity and streamliningg your workflow
        </p>
        {/* Plans  */}
        <div className='mx-auto mt-12 grid max-w-md grid-cols-1 gap-10 px-4 sm:px-6 md:max-w-2xl md:grid-cols-2 lg:max-w-6xl lg:grid-cols-3 lg:gap-x-8 lg:px-8'>
          {Object.values(PRICING_PLANS).map((plan) => (
            <div
              key={plan.id}
              className={`h-fit rounded-lg bg-light-600 p-6 pb-12 ${
                plan.popular ? 'ring-2 ring-accent' : 'ring-1 ring-accent2'
              }`}
            >
              <h3
                className={`text-lg leading-8 ${plan.popular ? 'font-bold text-dark-900' : 'font-semibold text-dark-700'}`}
              >
                {plan.name}
              </h3>
              <p className='test-sm mt-4 leading-6 text-dark-600'>{plan.description}</p>
              <p className='mt-6 flex items-baseline gap-x-1'>
                <span className='text-4xl font-bold tracking-tight text-dark-800'>
                  {plan.pricing.monthly}
                </span>
                {plan.pricing.monthly !== 'Free' && (
                  <span className='text-base font-semibold leading-6 text-dark-600'>/ month</span>
                )}
              </p>
              <ul role='list' className='mt-8 space-y-3 text-sm leading-6 text-dark-600'>
                {plan.features.map((feature, index) => (
                  <li key={index} className='gapx-x-3 flex'>
                    {feature.included ? (
                      <Check className='h-6 w-5 flex-none text-accent2' />
                    ) : (
                      <X className='h-6 w-5 flex-none text-dark-400' />
                    )}
                    {feature.title}
                  </li>
                ))}
              </ul>
              <Button
                className='mt-8 w-full'
                disabled={plan.id === PLAN_TYPES.STARTER || loading || isPending}
                onClick={plan.id !== PLAN_TYPES.STARTER ? handleUpgrade : undefined}
              >
                <span className='text-sm font-semibold leading-6 text-accent'>
                  {plan.id === PLAN_TYPES.STARTER
                    ? 'Current Plan'
                    : isPending || loading
                      ? 'Loading...'
                      : hasPaidPlan
                        ? 'Manage Plan'
                        : plan.cta}
                </span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
