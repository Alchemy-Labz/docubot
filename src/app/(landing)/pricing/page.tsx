// app/about/pricing/page.tsx
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, X, Info, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { createCheckoutSession } from '@/actions/createCheckoutSession';
import { createStripePortal } from '@/actions/createStripePortal';
import getStripe from '@/lib/stripe/stripeConfig';
import useSubscription from '@/hooks/useSubscription';
import Footer from '@/components/Global/Footer';

export type UserDetails = {
  email: string;
  name: string;
};

const PricingPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { hasActiveMembership, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();
  const [annualBilling, setAnnualBilling] = useState(true);

  const handleUpgrade = (_planId: string) => {
    if (!user || !user.primaryEmailAddress) return;

    const userDetails: UserDetails = {
      email: user.primaryEmailAddress?.toString(),
      name: user.fullName!,
    };

    startTransition(async () => {
      const stripe = await getStripe();

      if (hasActiveMembership) {
        // Create stripe portal
        const stripePortalURL = await createStripePortal();
        return router.push(stripePortalURL);
      }

      const sessionId = await createCheckoutSession(userDetails);
      await stripe?.redirectToCheckout({ sessionId });
    });
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'For individuals exploring DocuBots capabilities',
      price: annualBilling ? 'Free' : 'Free',
      features: [
        { title: 'Upload up to 5 documents', included: true },
        { title: '3 AI messages per document', included: true },
        { title: 'Basic document analysis', included: true },
        { title: 'Standard email support', included: true },
        { title: 'Delete documents', included: false },
        { title: 'Advanced data exports', included: false },
        { title: 'Priority support', included: false },
      ],
      cta: 'Get Started',
      popular: false,
      disabled: false,
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'For professionals who need more power and flexibility',
      price: annualBilling ? '$8.33/mo' : '$9.99/mo',
      features: [
        { title: 'Upload up to 12 documents', included: true },
        { title: 'Up to 15 AI messages per document', included: true },
        { title: 'Advanced document analytics', included: true },
        { title: 'Delete documents anytime', included: true },
        { title: 'Advanced data export options', included: true },
        { title: 'Priority email support', included: true },
        { title: 'Access to new features first', included: true },
      ],
      cta: hasActiveMembership ? 'Manage Plan' : 'Upgrade Now',
      popular: true,
      disabled: isPending || loading,
    },
    {
      id: 'developer',
      name: 'Developer',
      description: 'For teams and developers with advanced needs',
      price: 'Coming Soon',
      features: [
        { title: 'Upload up to 50 documents', included: true },
        { title: 'Unlimited AI messages', included: true },
        { title: 'GitHub repository integration', included: true },
        { title: 'Document-to-repo chat linking', included: true },
        { title: 'Comprehensive analytics suite', included: true },
        { title: '24/7 dedicated support', included: true },
        { title: 'Custom solutions and services', included: true },
      ],
      cta: 'Join Waitlist',
      popular: false,
      disabled: true,
    },
  ];

  return (
    <div className='flex flex-col items-center overflow-x-hidden bg-gradient-to-br from-accent2/20 to-accent/20 dark:from-accent3/20 dark:to-accent4/20'>
      <div className='w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <motion.div
          className='sm:text-center'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <h1 className='text-4xl font-extrabold tracking-tight text-dark-800 dark:text-light-300 sm:text-5xl lg:text-6xl'>
            Simple, Transparent Pricing
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-xl text-dark-600 dark:text-light-400'>
            Choose the perfect plan for your document processing needs
          </p>

          {/* Billing toggle */}
          <div className='mt-12 flex justify-center'>
            <div className='relative flex items-center rounded-full bg-light-200/50 p-1 dark:bg-dark-700/50'>
              <div className='flex items-center space-x-2 px-4 py-2'>
                <span
                  className={`text-sm font-medium ${annualBilling ? 'text-accent2 dark:text-accent' : 'text-dark-600 dark:text-light-400'}`}
                >
                  Annual
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className='h-4 w-4 text-dark-500 dark:text-light-500' />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className='w-48 text-sm'>Save 25% with annual billing</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Switch
                checked={annualBilling}
                onCheckedChange={setAnnualBilling}
                className='mx-2'
              />

              <span
                className={`px-4 py-2 text-sm font-medium ${!annualBilling ? 'text-accent2 dark:text-accent' : 'text-dark-600 dark:text-light-400'}`}
              >
                Monthly
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          className='mt-16 grid gap-8 lg:grid-cols-3 lg:gap-6'
          initial='hidden'
          animate='visible'
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={fadeIn}
              className={`flex flex-col overflow-hidden rounded-2xl border ${
                plan.popular
                  ? 'scale-105 border-accent2 shadow-lg shadow-accent2/20 dark:border-accent dark:shadow-accent/20'
                  : 'border-accent2/20 dark:border-accent/20'
              } bg-light-100/80 transition-all hover:shadow-xl dark:bg-dark-700/80`}
            >
              {plan.popular && (
                <div className='bg-accent2 py-2 text-center text-sm font-medium text-light-100 dark:bg-accent'>
                  Most Popular
                </div>
              )}

              <div className='p-8'>
                <h3 className='text-2xl font-bold text-dark-800 dark:text-light-300'>
                  {plan.name}
                </h3>
                <p className='mt-2 h-12 text-sm text-dark-600 dark:text-light-400'>
                  {plan.description}
                </p>
                <p className='mt-6'>
                  <span className='text-4xl font-extrabold tracking-tight text-dark-800 dark:text-light-300'>
                    {plan.price}
                  </span>
                  {plan.price !== 'Free' && plan.price !== 'Coming Soon' && (
                    <span className='text-base text-dark-600 dark:text-light-400'>
                      {annualBilling
                        ? ' per month, billed annually'
                        : ' per month, billed monthly'}
                    </span>
                  )}
                </p>

                <ul className='mt-8 space-y-4'>
                  {plan.features.map((feature, index) => (
                    <li key={index} className='flex items-start'>
                      {feature.included ? (
                        <Check className='mt-1 h-5 w-5 flex-shrink-0 text-accent2 dark:text-accent' />
                      ) : (
                        <X className='mt-1 h-5 w-5 flex-shrink-0 text-dark-400 dark:text-light-600' />
                      )}
                      <span
                        className={`ml-3 text-sm ${
                          feature.included
                            ? 'text-dark-700 dark:text-light-300'
                            : 'text-dark-400 dark:text-light-600'
                        }`}
                      >
                        {feature.title}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className='mt-8'>
                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={plan.disabled}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-accent2 hover:bg-accent2/90 dark:bg-accent dark:hover:bg-accent/90'
                        : 'bg-light-300 hover:bg-light-400 dark:bg-dark-600 dark:hover:bg-dark-500'
                    }`}
                  >
                    {isPending && plan.id === 'pro' ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : null}
                    {plan.cta}
                    {plan.id === 'starter' && <ArrowRight className='ml-2 h-4 w-4' />}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ section */}
        <motion.div className='mt-24' initial='hidden' animate='visible' variants={fadeIn}>
          <h2 className='text-center text-3xl font-bold text-dark-800 dark:text-light-300'>
            Frequently Asked Questions
          </h2>

          <div className='mt-12 grid gap-8 lg:grid-cols-2'>
            {[
              {
                question: 'Can I change plans later?',
                answer:
                  'Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle.',
              },
              {
                question: 'Is there a limit to document size?',
                answer:
                  'Yes, the maximum file size is 15MB per document. This limit applies to all plans.',
              },
              {
                question: 'How secure are my documents?',
                answer:
                  'Your documents are encrypted both in transit and at rest. We follow industry best practices for security and privacy.',
              },
              {
                question: 'Can I cancel my subscription?',
                answer:
                  "Yes, you can cancel your subscription anytime through your account settings. You'll continue to have access until the end of your current billing period.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className='rounded-lg border border-accent2/20 bg-light-100/50 p-6 dark:border-accent/20 dark:bg-dark-700/50'
              >
                <h3 className='text-lg font-semibold text-dark-800 dark:text-light-300'>
                  {faq.question}
                </h3>
                <p className='mt-3 text-dark-600 dark:text-light-400'>{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Enterprise CTA */}
        <motion.div
          className='mt-24 rounded-2xl bg-gradient-to-br from-accent2/40 to-accent/40 p-10 text-center dark:from-accent3/30 dark:to-accent4/30'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <h2 className='text-2xl font-bold text-dark-800 dark:text-light-300 sm:text-3xl'>
            Need a custom solution for your team or enterprise?
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-lg text-dark-600 dark:text-light-400'>
            Contact us to discuss your specific requirements and get a tailored package.
          </p>
          <Button
            asChild
            size='lg'
            className='mt-8 bg-dark-800 text-light-300 hover:bg-dark-700 dark:bg-light-300 dark:text-dark-800 dark:hover:bg-light-400'
          >
            <Link href='/contact'>Contact Sales</Link>
          </Button>
        </motion.div>

        {/* Money-back guarantee */}
        <motion.div
          className='mt-12 text-center'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <p className='text-dark-600 dark:text-light-400'>
            All plans include a 14-day money-back guarantee. No questions asked.
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default PricingPage;
