/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { createCheckoutSession } from '@/actions/createCheckoutSession';
// import { createCheckoutSession } from '@/actions/createCheckoutSession';
import { createStripePortal } from '@/actions/createStripePortal';
import { Button } from '@/components/ui/button';
import useSubscription from '@/hooks/useSubscription';
import getStripe from '@/lib/stripeConfig';
import { useUser } from '@clerk/nextjs';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';

export type UserDetails = {
  email: string;
  name: string;
};

const PricingPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { hasActiveMembership, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = () => {
    if (!user || !user.primaryEmailAddress) return;

    const userDetails: UserDetails = {
      email: user.primaryEmailAddress?.toString(),
      name: user.fullName!,
    };

    startTransition(async () => {
      const stripe = await getStripe();

      if (hasActiveMembership) {
        //create stripe portal
        const stripePortalURL = await createStripePortal();
        return router.push(stripePortalURL);
      }

      const sessionId = await createCheckoutSession(userDetails);
      // console.log('🚀 ~ startTransition ~ userDetails:', userDetails);
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
        <div className='mx-auto mt-12 grid max-w-md grid-cols-1 gap-10 px-4 sm:px-6 md:max-w-2xl md:grid-cols-2 lg:max-w-4xl lg:gap-x-22 lg:px-8'>
          {/* Free */}
          <div className='h-fit rounded-lg bg-light-600 p-6 pb-12 ring-1 ring-accent2'>
            <h3 className='text-lg font-semibold leading-8 text-dark-700'>Basic Plan</h3>
            <p className='test-sm mt-4 leading-6 text-dark-600'>
              Explore Core Features at No Cost
            </p>
            <p className='mt-6 flex items-baseline gap-x-1'>
              <span className='text-4xl font-bold tracking-tight text-dark-800'>Free</span>
            </p>
            <ul role='list' className='mt-8 space-y-3 text-sm leading-6 text-dark-600'>
              <li className='gapx-x-3 flex'>
                <Check className='h-6 w-5 flex-none text-accent2' />5 Documents
              </li>
              <li className='gapx-x-3 flex'>
                <Check className='h-6 w-5 flex-none text-accent2' />
                Up to 3 messages per Document
              </li>
              <li className='gapx-x-3 flex'>
                <Check className='h-6 w-5 flex-none text-accent2' />
                Try out DocuBots AI Features
              </li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className='h-fit rounded-lg bg-light-600 p-6 pb-12 ring-2 ring-accent'>
            <h3 className='text-lg font-bold leading-8 text-dark-900'>Pro Plan</h3>
            <p className='test-sm mt-4 leading-6 text-dark-600'>
              Maximize Productivity with PRO Features
            </p>
            <p className='mt-6 flex items-baseline gap-x-1'>
              <span className='text-4xl font-bold tracking-tight text-dark-800'>$5.99</span>
              <span className='text-base font-semibold leading-6 text-dark-600'>/ month</span>
            </p>
            <ul role='list' className='my-8 space-y-3 text-sm leading-6 text-dark-600'>
              <li className='gapx-x-3 flex'>
                <Check className='h-6 w-5 flex-none text-accent2' />5 Documents
              </li>
              <li className='gapx-x-3 flex'>
                <Check className='h-6 w-5 flex-none text-accent2' />
                Up to 3 messages per Document
              </li>
              <li className='gapx-x-3 flex'>
                <Check className='h-6 w-5 flex-none text-accent2' />
                Try out DocuBots AI Features
              </li>
            </ul>
            <Button className='' disabled={loading || isPending} onClick={handleUpgrade}>
              <span className='text-sm font-semibold leading-6 text-accent'>
                {isPending || loading
                  ? 'Loading...'
                  : hasActiveMembership
                    ? 'Manage Plan'
                    : 'Upgrade Now'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
