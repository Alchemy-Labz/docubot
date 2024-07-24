'use client';

import { PlusSquare } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

function PlaceholderDocument() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard/upload-doc');
  };

  return (
    <Button
      onClick={handleClick}
      className='flex h-80 w-64 flex-col items-center justify-center space-y-3 rounded-xl border border-accent/60 shadow-md dark:bg-dark-700 dark:text-light-300 dark:shadow-light-800/60 dark:hover:bg-dark-800/90'
    >
      <PlusSquare className='h-12 w-12 text-accent2' />
      <p className='text-light-400 md:text-lg'>Add A Document</p>
    </Button>
  );
}

export default PlaceholderDocument;
