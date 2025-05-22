// src/components/docs/DocSearch.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface DocSearchProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function DocSearch({ onSearch, initialQuery = '' }: DocSearchProps) {
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Handle search submission
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch(searchInput);
  };

  // Handle clear button click
  const handleClear = () => {
    setSearchInput('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Escape key to close expanded view on mobile
    if (e.key === 'Escape') {
      setIsExpanded(false);
    }
    // Handle Enter key to submit search
    else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={`transition-all duration-300 ${isExpanded ? 'w-full' : 'w-auto'}`}>
      <form onSubmit={handleSubmit} className='relative'>
        <div className='relative'>
          {/* Toggle button for mobile */}
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='absolute left-0 top-0 flex h-full items-center justify-center md:hidden'
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Close search' : 'Open search'}
          >
            <Search className='h-5 w-5 text-dark-400 dark:text-light-600' />
          </Button>

          {/* Search input - always visible on desktop, conditionally on mobile */}
          <div
            className={`relative flex w-full items-center overflow-hidden rounded-md border border-light-400 bg-light-100/80 transition-all dark:border-dark-600 dark:bg-dark-700/80 md:flex ${
              isExpanded ? 'opacity-100' : 'opacity-0 md:opacity-100'
            }`}
          >
            {/* Search icon - desktop only */}
            <Search
              className='absolute left-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-dark-400 dark:text-light-600 md:block'
              aria-hidden='true'
            />

            {/* Input field */}
            <input
              ref={inputRef}
              type='text'
              placeholder='Search documentation...'
              value={searchInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent px-3 py-2 text-dark-800 placeholder-dark-400 focus:outline-none dark:text-light-200 dark:placeholder-light-600 md:pl-10 ${
                isExpanded ? 'opacity-100' : 'opacity-0 md:opacity-100'
              }`}
              aria-label='Search documentation'
            />

            {/* Clear button - show only when there's input */}
            {searchInput && (
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-dark-400 hover:text-dark-600 dark:text-light-600 dark:hover:text-light-400'
                onClick={handleClear}
                aria-label='Clear search'
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* Search button - visible only on expanded mobile or on desktop */}
        <Button
          type='submit'
          className={`mt-2 w-full bg-accent text-light-100 hover:bg-accent2 dark:bg-accent3 dark:hover:bg-accent4 md:ml-2 md:mt-0 md:w-auto ${
            isExpanded ? 'block' : 'hidden md:block'
          }`}
        >
          Search
        </Button>
      </form>
    </div>
  );
}
