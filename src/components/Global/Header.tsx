import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

import DLToggle from '@/c/Global/DLToggle';
import { dark } from '@clerk/themes';

import { Button } from '../ui/button';
import { File, FilePlus2 } from 'lucide-react';
import UpgradeButton from '../Dashboard/UpgradeButton';

const Header = () => {
  return (
    <header className='flex items-center justify-between bg-light-600 px-5 py-3 shadow-xl shadow-dark-800/30 dark:bg-dark-800'>
      <SignedOut>
        <Link href='/' className='flex items-center space-x-4' aria-label='DocuBot home page'>
          <Image src='/logo.png' alt='DocuBot logo' width={45} height={45} priority />
          <h1 className='hidden text-4xl font-bold text-gradient-lime-violet md:block'>DocuBot</h1>
        </Link>
      </SignedOut>

      <SignedIn>
        <div className='flex items-center space-x-4'>
          <Link
            href='/dashboard'
            className='flex items-center space-x-4'
            aria-label='Go to dashboard'
          >
            <Image src='/logo.png' alt='DocuBot logo' width={45} height={45} priority />
            <h1 className='hidden text-4xl font-bold text-gradient-lime-violet md:block'>
              DocuBot
            </h1>
          </Link>

          <nav className='flex items-center justify-start space-x-4' aria-label='Main navigation'>
            <Button asChild variant='default'>
              <Link href='/dashboard' aria-label='View my documents'>
                <File aria-hidden='true' />
                <span className='hidden md:block'>My Documents</span>
                <span className='sr-only md:hidden'>My Documents</span>
              </Link>
            </Button>

            <Button asChild variant='default'>
              <Link href='/dashboard/upload-doc' aria-label='Upload new document'>
                <FilePlus2 aria-hidden='true' />
                <span className='sr-only'>Upload Document</span>
              </Link>
            </Button>
          </nav>
        </div>
      </SignedIn>

      <div className='flex items-center space-x-4'>
        <SignedIn>
          <UpgradeButton />
          <DLToggle />
          <UserButton
            showName={false}
            appearance={{
              baseTheme: dark,
              elements: {
                avatarBox: 'h-10 w-10',
              },
            }}
            userProfileProps={{
              appearance: {
                baseTheme: dark,
              },
            }}
          />
        </SignedIn>

        <SignedOut>
          <nav className='flex items-center space-x-4' aria-label='Authentication navigation'>
            <Link
              className='rounded-md border border-accent bg-light-700 px-3 py-2 text-dark-800 neon-neon focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:bg-dark-400 dark:text-light-400'
              href='/sign-up'
              aria-label='Create new account'
            >
              <button type='button'>Sign Up</button>
            </Link>
            <Link
              className='rounded-md border border-accent2 bg-light-700 px-3 py-2 text-dark-800 neon-neon2 focus:outline-none focus:ring-2 focus:ring-accent2 focus:ring-offset-2 dark:bg-dark-400 dark:text-light-400'
              href='/sign-in'
              aria-label='Sign in to your account'
            >
              <button type='button'>Sign In</button>
            </Link>
          </nav>
          <DLToggle />
        </SignedOut>
      </div>
    </header>
  );
};

export default Header;
