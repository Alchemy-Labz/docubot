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
import { PRICING_PLANS, PLAN_TYPES } from '@/lib/constants/appConstants';
import { useThemeClasses } from '@/components/Global/ThemeAwareWrapper';

export type UserDetails = {
  email: string;
  name: string;
};

const PricingPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { hasPaidPlan, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();
  const [annualBilling, setAnnualBilling] = useState(true);
  const { getClasses } = useThemeClasses();

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-accent'></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const handleUpgrade = (planId: string) => {
    if (!user || !user.primaryEmailAddress) return;

    const userDetails: UserDetails = {
      email: user.primaryEmailAddress?.toString(),
      name: user.fullName!,
    };

    startTransition(async () => {
      const stripe = await getStripe();

      if (hasPaidPlan) {
        // Create stripe portal
        const stripePortalURL = await createStripePortal();
        return router.push(stripePortalURL);
      }

      // Skip checkout for starter plan
      if (planId === PLAN_TYPES.STARTER) {
        return;
      }

      const sessionId = await createCheckoutSession(userDetails, planId, annualBilling);
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

  const plans = Object.values(PRICING_PLANS).map((plan) => ({
    ...plan,
    price: annualBilling ? plan.pricing.annual : plan.pricing.monthly,
    yearlyPrice: plan.pricing.yearlyPrice,
    cta: plan.id === PLAN_TYPES.STARTER ? plan.cta : hasPaidPlan ? 'Manage Plan' : plan.cta,
    disabled: plan.id === PLAN_TYPES.PRO ? isPending || loading : isPending || loading,
  }));

  return (
    <div
      className={getClasses({
        base: 'flex flex-col items-center overflow-x-hidden',
        business: 'bg-background',
        neonLight: 'bg-gradient-to-br from-accent2/20 to-accent/20',
        neonDark: 'from-neon2-dark-900/25 to-neon-dark-900/25 bg-gradient-to-br',
      })}
    >
      <div className='w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <motion.div
          className='sm:text-center'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <h1
            className={getClasses({
              base: 'text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl',
              business: 'text-foreground',
              neon: 'text-foreground',
            })}
          >
            Simple, Transparent Pricing
          </h1>
          <p
            className={getClasses({
              base: 'mx-auto mt-6 max-w-2xl text-xl',
              business: 'text-muted-foreground',
              neon: 'text-muted-foreground',
            })}
          >
            Choose the perfect plan for your document processing needs
          </p>

          {/* Billing toggle */}
          <div className='mt-12 flex justify-center'>
            <div
              className={getClasses({
                base: 'relative flex items-center rounded-full p-1',
                business: 'bg-muted',
                neonLight: 'bg-light-200/50',
                neonDark: 'bg-neon2-dark-700/50',
              })}
            >
              <div className='flex items-center space-x-2 px-4 py-2'>
                <span
                  className={getClasses({
                    base: 'text-sm font-medium',
                    business: annualBilling ? 'text-primary' : 'text-muted-foreground',
                    neonLight: annualBilling ? 'text-accent2' : 'text-muted-foreground',
                    neonDark: annualBilling ? 'text-accent' : 'text-muted-foreground',
                  })}
                >
                  Annual
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info
                        className={getClasses({
                          base: 'h-4 w-4',
                          business: 'text-muted-foreground',
                          neon: 'text-muted-foreground',
                        })}
                      />
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
                className={getClasses({
                  base: 'px-4 py-2 text-sm font-medium',
                  business: !annualBilling ? 'text-primary' : 'text-muted-foreground',
                  neonLight: !annualBilling ? 'text-accent2' : 'text-muted-foreground',
                  neonDark: !annualBilling ? 'text-accent' : 'text-muted-foreground',
                })}
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
              className={getClasses({
                base: `flex flex-col overflow-hidden rounded-2xl border transition-all hover:shadow-xl ${
                  plan.popular ? 'scale-105 shadow-lg' : ''
                }`,
                business: plan.popular
                  ? 'border-primary bg-card shadow-primary/20'
                  : 'border-border bg-card',
                neonLight: plan.popular
                  ? 'border-accent2 bg-light-100/80 shadow-accent2/20'
                  : 'border-accent2/20 bg-light-100/80',
                neonDark: plan.popular
                  ? 'bg-neon2-dark-700/80 border-accent shadow-accent/20'
                  : 'bg-neon2-dark-700/80 border-accent/20',
              })}
            >
              {plan.popular && (
                <div
                  className={getClasses({
                    base: 'py-2 text-center text-sm font-medium',
                    business: 'bg-primary text-primary-foreground',
                    neonLight: 'bg-accent2 text-light-100',
                    neonDark: 'text-neon-dark-900 bg-accent',
                  })}
                >
                  Most Popular
                </div>
              )}

              <div className='p-8'>
                <h3
                  className={getClasses({
                    base: 'text-2xl font-bold',
                    business: 'text-foreground',
                    neonLight: 'text-dark-800',
                    neonDark: 'text-light-300',
                  })}
                >
                  {plan.name}
                </h3>
                <p
                  className={getClasses({
                    base: 'mt-2 h-12 text-sm',
                    business: 'text-muted-foreground',
                    neonLight: 'text-dark-600',
                    neonDark: 'text-light-400',
                  })}
                >
                  {plan.description}
                </p>
                <p className='mt-6'>
                  <span
                    className={getClasses({
                      base: 'text-4xl font-extrabold tracking-tight',
                      business: 'text-foreground',
                      neonLight: 'text-dark-800',
                      neonDark: 'text-light-300',
                    })}
                  >
                    {plan.price}
                  </span>
                  {plan.price !== 'Free' && (
                    <span
                      className={getClasses({
                        base: 'text-base',
                        business: 'text-muted-foreground',
                        neonLight: 'text-dark-600',
                        neonDark: 'text-light-400',
                      })}
                    >
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
                        <Check
                          className={getClasses({
                            base: 'mt-1 h-5 w-5 flex-shrink-0',
                            business: 'text-primary',
                            neonLight: 'text-accent2',
                            neonDark: 'text-accent',
                          })}
                        />
                      ) : (
                        <X
                          className={getClasses({
                            base: 'mt-1 h-5 w-5 flex-shrink-0',
                            business: 'text-muted-foreground',
                            neonLight: 'text-dark-400',
                            neonDark: 'text-light-600',
                          })}
                        />
                      )}
                      <span
                        className={getClasses({
                          base: 'ml-3 text-sm',
                          business: feature.included ? 'text-foreground' : 'text-muted-foreground',
                          neonLight: feature.included ? 'text-dark-700' : 'text-dark-400',
                          neonDark: feature.included ? 'text-light-300' : 'text-light-600',
                        })}
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
                    className={getClasses({
                      base: 'w-full',
                      business: plan.popular
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                      neonLight: plan.popular
                        ? 'bg-accent2 text-light-100 hover:bg-accent2/90'
                        : 'bg-light-300 text-dark-800 hover:bg-light-400',
                      neonDark: plan.popular
                        ? 'text-neon-dark-900 bg-accent hover:bg-accent/90'
                        : 'bg-neon2-dark-600 hover:bg-neon2-dark-500 text-light-300',
                    })}
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
          <h2
            className={getClasses({
              base: 'text-center text-3xl font-bold',
              business: 'text-foreground',
              neonLight: 'text-dark-800',
              neonDark: 'text-light-300',
            })}
          >
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
                className={getClasses({
                  base: 'rounded-lg border p-6',
                  business: 'border-border bg-card',
                  neonLight: 'border-accent2/20 bg-light-100/50',
                  neonDark: 'bg-neon2-dark-700/50 border-accent/20',
                })}
              >
                <h3
                  className={getClasses({
                    base: 'text-lg font-semibold',
                    business: 'text-foreground',
                    neonLight: 'text-dark-800',
                    neonDark: 'text-light-300',
                  })}
                >
                  {faq.question}
                </h3>
                <p
                  className={getClasses({
                    base: 'mt-3',
                    business: 'text-muted-foreground',
                    neonLight: 'text-dark-600',
                    neonDark: 'text-light-400',
                  })}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Enterprise CTA */}
        <motion.div
          className={getClasses({
            base: 'mt-24 rounded-2xl p-10 text-center',
            business: 'border border-border bg-muted',
            neonLight: 'bg-gradient-to-br from-accent2/40 to-accent/40',
            neonDark: 'from-neon2-dark-900/25 to-neon-dark-900/25 bg-gradient-to-br',
          })}
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <h2
            className={getClasses({
              base: 'text-2xl font-bold sm:text-3xl',
              business: 'text-foreground',
              neonLight: 'text-dark-800',
              neonDark: 'text-light-300',
            })}
          >
            Need a custom solution for your team or enterprise?
          </h2>
          <p
            className={getClasses({
              base: 'mx-auto mt-4 max-w-2xl text-lg',
              business: 'text-muted-foreground',
              neonLight: 'text-dark-600',
              neonDark: 'text-light-400',
            })}
          >
            Contact us to discuss your specific requirements and get a tailored package.
          </p>
          <Button
            asChild
            size='lg'
            className={getClasses({
              base: 'mt-8',
              business: 'bg-primary text-primary-foreground hover:bg-primary/90',
              neonLight: 'bg-dark-800 text-light-300 hover:bg-dark-700',
              neonDark: 'text-neon-dark-800 bg-light-300 hover:bg-light-400',
            })}
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
          <p
            className={getClasses({
              base: '',
              business: 'text-muted-foreground',
              neonLight: 'text-dark-600',
              neonDark: 'text-light-400',
            })}
          >
            All plans include a 14-day money-back guarantee. No questions asked.
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default PricingPage;
