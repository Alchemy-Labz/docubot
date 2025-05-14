'use client';
// components/Global/Header2.tsx
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import DLToggle from '@/components/Global/DLToggle';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header2 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className='sticky top-0 z-10 flex items-center justify-between bg-light-600 px-5 py-3 shadow-xl shadow-dark-800/30 dark:bg-dark-800'>
      <Link href='/' className='flex items-center space-x-4'>
        <Image src='/logo.png' alt='DocuBot logo' width={45} height={45} />
        <h1 className='hidden text-4xl font-bold text-gradient-lime-violet lg:block'>DocuBot</h1>
      </Link>

      <div className='flex items-center space-x-4'>
        <button onClick={toggleMenu} className='md:hidden'>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div
          className={`fixed inset-0 top-[72px] z-50 transform bg-light-600 transition-transform duration-300 ease-in-out dark:bg-dark-800 md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className='flex flex-col items-center space-y-6 pt-8'>
            <SignedIn>
              <Link href='/dashboard' onClick={toggleMenu}>
                <Button variant='default'>Dashboard</Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <nav className='flex flex-col items-center space-y-6'>
                <Link
                  href='/pricing'
                  className='text-dark-800 hover:text-accent dark:text-light-300 dark:hover:text-accent4'
                  onClick={toggleMenu}
                >
                  Pricing
                </Link>
                <Link
                  href='/roadmap'
                  className='text-dark-800 hover:text-accent dark:text-light-300 dark:hover:text-accent4'
                  onClick={toggleMenu}
                >
                  Roadmap
                </Link>
                <Link
                  href='/about'
                  className='text-dark-800 hover:text-accent dark:text-light-300 dark:hover:text-accent4'
                  onClick={toggleMenu}
                >
                  About
                </Link>
                <Link
                  href='/help-center'
                  className='text-dark-800 hover:text-accent dark:text-light-300 dark:hover:text-accent4'
                  onClick={toggleMenu}
                >
                  Help Center
                </Link>
              </nav>
            </SignedOut>
          </div>
        </div>

        <div className='hidden items-center space-x-4 md:flex'>
          <SignedIn>
            <Link href='/dashboard'>
              <Button variant='default'>Dashboard</Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <nav className='mr-18 space-x-12'>
              <Link
                href='/pricing'
                className='text-dark-800 hover:text-accent dark:text-light-300 dark:hover:text-accent4'
              >
                Pricing
              </Link>
              <Link
                href='/roadmap'
                className='text-dark-800 hover:text-accent dark:text-light-300 dark:hover:text-accent4'
              >
                Roadmap
              </Link>
              <Link
                href='/about'
                className='text-dark-800 hover:text-accent dark:text-light-300 dark:hover:text-accent4'
              >
                About
              </Link>
              <Link
                href='/help-center'
                className='text-dark-800 hover:text-accent dark:text-light-300 dark:hover:text-accent4'
              >
                Help Center
              </Link>
            </nav>
          </SignedOut>
        </div>

        <SignedIn>
          <UserButton
            showName={false}
            appearance={{
              elements: {
                avatarBox: 'h-10 w-10',
              },
            }}
          />
        </SignedIn>

        <div className='flex space-x-4'>
          <Link
            className='rounded-md border border-accent bg-light-700 px-3 py-2 text-dark-800 neon-neon dark:bg-dark-400 dark:text-light-400'
            href='/sign-up'
          >
            <button>Sign Up</button>
          </Link>
          <Link
            className='rounded-md border border-accent2 bg-light-700 px-3 py-2 text-dark-800 neon-neon2 dark:bg-dark-400 dark:text-light-400'
            href='/sign-in'
          >
            <button>Sign In</button>
          </Link>
        </div>

        <DLToggle />
      </div>
    </header>
  );
};

export default Header2;
