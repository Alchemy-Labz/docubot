// src/components/docs/DocsHeader.tsx
import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import DocSearch from './DocSearch';

interface DocsHeaderProps {
  activeDoc: string;
  docTitle: string;
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function DocsHeader({
  activeDoc,
  docTitle,
  onSearch,
  initialQuery = '',
}: DocsHeaderProps) {
  return (
    <div className='mb-6 flex flex-col space-y-4 md:space-y-0'>
      {/* Breadcrumbs */}
      <div className='hidden items-center md:flex'>
        <Link
          href='/'
          className='mr-2 flex items-center text-dark-600 hover:text-accent dark:text-light-400 dark:hover:text-accent3'
          aria-label='Go to home page'
        >
          <Home size={16} className='mr-1' />
          Home
        </Link>
        <ChevronRight
          size={16}
          className='mx-2 text-dark-400 dark:text-light-600'
          aria-hidden='true'
        />
        <Link
          href='/documentation'
          className='text-dark-600 hover:text-accent dark:text-light-400 dark:hover:text-accent3'
          aria-label='Go to documentation page'
        >
          Documentation
        </Link>
        {activeDoc !== 'introduction' && (
          <>
            <ChevronRight
              size={16}
              className='mx-2 text-dark-400 dark:text-light-600'
              aria-hidden='true'
            />
            <span className='font-medium text-dark-800 dark:text-light-200'>{docTitle}</span>
          </>
        )}
      </div>

      {/* Search - Desktop */}
      <div className='hidden md:block'>
        <DocSearch onSearch={onSearch} initialQuery={initialQuery} />
      </div>
    </div>
  );
}
