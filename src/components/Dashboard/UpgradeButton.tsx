'use client';

import useSubscription from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';
import { Loader2, Star } from 'lucide-react';
import { createStripePortal } from '@/actions/createStripePortal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const UpgradeButton = () => {
  const { hasPaidPlan, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAccount = () => {
    startTransition(async () => {
      // Create stripe portal
      const stripePortalURL = await createStripePortal();
      return router.push(stripePortalURL);
    });
  };

  if (loading) {
    return (
      <Button className='border-accent' variant='default'>
        <Loader2 className='animate-spin-slow' />
      </Button>
    );
  }

  if (!hasPaidPlan) {
    return (
      <Button asChild variant='default' className='flex items-center justify-center space-x-2'>
        <Link href='/dashboard/upgrade'>
          Upgrade
          <Star className='ml-2 text-green-500' />
        </Link>
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAccount}
      disabled={isPending}
      variant='default'
      className='border-accent bg-accent2'
    >
      {isPending ? (
        <Loader2 className='animate-spin-slow' />
      ) : (
        <p>
          <span className='font-extrabold'>PRO</span>
          Account
        </p>
      )}
    </Button>
  );
};

export default UpgradeButton;
