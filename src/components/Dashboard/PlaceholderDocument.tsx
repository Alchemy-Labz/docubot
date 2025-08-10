'use client';

import { Frown, PlusSquare } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import useSubscription from '@/hooks/useSubscription';
import { PLAN_TYPES } from '@/lib/constants/appConstants';

interface PlaceholderDocumentProps {
  className?: string;
}

const PlaceholderDocument = ({ className = '' }: PlaceholderDocumentProps) => {
  const router = useRouter();
  const { isOverFileLimit, planType } = useSubscription();

  const handleClick = () => {
    if (isOverFileLimit) {
      router.push('/dashboard/upgrade');
    } else {
      router.push('/dashboard/upload-doc');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`group relative flex h-auto min-h-64 w-full flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-accent/40 bg-transparent p-8 text-center transition-all duration-200 hover:border-accent/60 hover:bg-accent/5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:hover:bg-accent/10 ${className}`}
      variant='ghost'
      aria-label={
        isOverFileLimit
          ? 'Upgrade to Pro to add more documents'
          : 'Add a new document to your collection'
      }
      aria-describedby='placeholder-description'
      role='button'
      tabIndex={0}
    >
      {/* Background Pattern */}
      <div
        className='absolute inset-0 opacity-5'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${isOverFileLimit ? 'ff6b6b' : '4ade80'}' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden='true'
      />

      {isOverFileLimit ? (
        <>
          <div className='relative'>
            <Frown
              className='h-16 w-16 text-red-400 transition-transform duration-200 group-hover:scale-110'
              aria-hidden='true'
            />
            <div
              className='absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500'
              aria-hidden='true'
            />
          </div>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold text-red-400'>File Limit Reached</h3>
            <p className='max-w-xs text-wrap text-sm text-dark-600 dark:text-light-400'>
              {planType === PLAN_TYPES.STARTER
                ? 'Upgrade to Pro to add more documents and unlock premium features'
                : planType === PLAN_TYPES.PRO
                  ? 'Upgrade to Team for more documents and advanced team features'
                  : 'You have reached your plan limit. Contact support for assistance.'}
            </p>
            <div className='mt-4 rounded-lg bg-accent/10 p-3'>
              <p className='text-xs font-medium text-accent'>
                {planType === PLAN_TYPES.STARTER ? 'Pro Benefits:' : 'Team Benefits:'}
              </p>
              <ul className='mt-1 space-y-1 text-xs text-dark-600 dark:text-light-400'>
                {planType === PLAN_TYPES.STARTER ? (
                  <>
                    <li>• Up to 15 documents</li>
                    <li>• More AI conversations</li>
                    <li>• Delete documents</li>
                    <li>• Priority support</li>
                  </>
                ) : (
                  <>
                    <li>• Up to 100 documents</li>
                    <li>• Team collaboration</li>
                    <li>• Advanced analytics</li>
                    <li>• Dedicated support</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div id='placeholder-description' className='sr-only'>
            You have reached the maximum number of documents for your current plan. Click to
            {planType === PLAN_TYPES.STARTER
              ? ' upgrade to Pro and upload more documents with additional features.'
              : planType === PLAN_TYPES.PRO
                ? ' upgrade to Team and upload more documents with advanced team features.'
                : ' contact support for assistance with your plan limits.'}
          </div>
        </>
      ) : (
        <>
          <div className='relative'>
            <PlusSquare
              className='h-16 w-16 text-accent transition-transform duration-200 group-hover:scale-110'
              aria-hidden='true'
            />
            <div
              className='absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-accent'
              aria-hidden='true'
            />
          </div>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold text-dark-800 dark:text-light-200'>
              Add New Document
            </h3>
            <p className='max-w-xs text-wrap text-center text-sm text-dark-600 dark:text-light-400'>
              Upload a PDF, Word doc, text file, or markdown to start chatting with DocuBot
            </p>
            <div className='mt-4 flex flex-wrap justify-center gap-2'>
              {['PDF', 'DOCX', 'TXT', 'MD', 'RTF'].map((type) => (
                <span
                  key={type}
                  className='inline-flex items-center rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent'
                  aria-hidden='true'
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
          <div id='placeholder-description' className='sr-only'>
            Click to upload a new document. Supports PDF, DOCX, TXT, MD, and RTF files up to 15MB.
            Start chatting with your documents using AI.
          </div>
        </>
      )}

      {/* Hover effect indicator */}
      <div className='absolute bottom-4 flex items-center space-x-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
        <div className='h-1 w-1 animate-pulse rounded-full bg-accent' />
        <div
          className='h-1 w-1 animate-pulse rounded-full bg-accent'
          style={{ animationDelay: '0.2s' }}
        />
        <div
          className='h-1 w-1 animate-pulse rounded-full bg-accent'
          style={{ animationDelay: '0.4s' }}
        />
      </div>
    </Button>
  );
};

export default PlaceholderDocument;
