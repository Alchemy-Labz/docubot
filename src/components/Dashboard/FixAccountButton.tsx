'use client';

import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { fixExistingUser } from '@/actions/fixExistingUser';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

/**
 * Button component that users can click to fix their account data
 * Useful for users who may be stuck in loading states after signup
 */
const FixAccountButton = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  const handleFix = () => {
    startTransition(async () => {
      try {
        const result = await fixExistingUser();

        if (result.success) {
          toast.success('Account data fixed! Refreshing page...');
          // Hide the button
          setIsVisible(false);
          // Wait a moment then refresh
          setTimeout(() => {
            router.refresh();
          }, 1500);
        } else {
          toast.error(`Failed to fix account: ${result.message}`);
        }
      } catch (error) {
        toast.error('Error fixing account data. Please try again.');
        console.error('Error fixing account:', error);
      }
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className='fixed bottom-4 right-4 z-50 rounded-lg bg-accent/10 p-4 shadow-lg backdrop-blur-sm dark:bg-dark-700/80'>
      <div className='mb-2 text-sm text-dark-700 dark:text-light-300'>
        Having trouble loading your data?
      </div>
      <Button
        onClick={handleFix}
        disabled={isPending}
        className='w-full bg-accent text-white hover:bg-accent/90'
        aria-label='Fix account data issues'
      >
        {isPending ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Fixing...
          </>
        ) : (
          'Fix My Account'
        )}
      </Button>
    </div>
  );
};

export default FixAccountButton;
