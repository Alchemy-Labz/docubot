'use client';

import { Frown, PlusSquare } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import useSubscription from '@/hooks/useSubscription';

const PlaceholderDocument = () => {
  const router = useRouter();
  const { isOverFileLimit } = useSubscription();

  const handleClick = () => {
    if (isOverFileLimit) {
      router.push('/dashboard/upgrade');
    } else {
      router.push('/dashboard/upload-doc');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Handle Enter and Space key for accessibility
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className='flex h-80 w-64 flex-col items-center justify-center space-y-3 rounded-xl border border-accent2/60 bg-light-900/80 shadow-md hover:bg-light-800/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:border-accent/60 dark:bg-dark-700 dark:text-light-300 dark:shadow-light-800/60 dark:hover:bg-dark-800/90'
      aria-label={
        isOverFileLimit
          ? 'Upgrade to Pro to add more documents'
          : 'Add a new document to your collection'
      }
      aria-describedby='placeholder-description'
      role='button'
      tabIndex={0}
    >
      {isOverFileLimit ? (
        <>
          <Frown className='h-12 w-12 text-accent2' aria-hidden='true' />
          <p className='text-wrap text-light-400 md:text-lg'>
            Upgrade to Pro to add more documents
          </p>
          <div id='placeholder-description' className='sr-only'>
            You have reached the maximum number of documents for your current plan. Click to
            upgrade to Pro and upload more documents.
          </div>
        </>
      ) : (
        <>
          <PlusSquare className='h-12 w-12 text-accent2' aria-hidden='true' />
          <p className='text-light-400 md:text-lg'>Add A Document</p>
          <div id='placeholder-description' className='sr-only'>
            Click to upload a new document. Supports PDF, TXT, MD, and RTF files.
          </div>
        </>
      )}
    </Button>
  );
};

export default PlaceholderDocument;
