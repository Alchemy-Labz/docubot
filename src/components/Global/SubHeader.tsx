'use client';

import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { FilePlus2, UserRoundPlus, UserRoundCog, FolderGit2 } from 'lucide-react';
import UpgradeButton from '../Dashboard/UpgradeButton';
import { useThemeClasses } from '@/components/Global/ThemeAwareWrapper';

const SubHeader = () => {
  const { getClasses } = useThemeClasses();

  return (
    <div
      className={getClasses({
        base: 'absolute bottom-0 flex w-full items-center justify-between px-6 py-2 shadow-lg',
        business: 'border-t border-border bg-muted/80',
        neonLight: 'border-t border-light-400 bg-light-500/80',
        neonDark: 'border-t border-border bg-card/80',
      })}
    >
      <div className='flex items-center justify-center space-x-4'>
        <Button asChild variant='default' className=''>
          <Link href='/dashboard'>My Documents</Link>
        </Button>
        <Button asChild variant='default' className=''>
          <Link href='/dashboard/upload-doc'>
            <FilePlus2 />
          </Link>
        </Button>
        <Button asChild variant='default' className=''>
          <Link href='/dashboard/upload-repo'>
            <FolderGit2 />
          </Link>
        </Button>
      </div>
      <div className='flex items-center justify-center space-x-4'>
        <Button asChild variant='default' className=''>
          <Link href='/dashboard/upgrade'>
            <UserRoundPlus />
          </Link>
        </Button>
        <UpgradeButton />
        <Button asChild variant='default' className=''>
          <Link href='/settings'>
            <UserRoundCog />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SubHeader;
