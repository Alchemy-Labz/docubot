'use client';
// components/Global/Header2.tsx
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import DLToggle from '@/components/Global/DLToggle';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';

const Header2 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.isAdmin === true;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className='sticky top-0 z-10 flex items-center justify-between bg-light-600 px-5 py-3 shadow-xl shadow-dark-800/30 dark:bg-dark-800'>
      <Link href='/' className='flex items-center space-x-4' aria-label='DocuBot home page'>
        <Image src='/logo.png' alt='DocuBot logo' width={45} height={45} priority />
        <h1 className='hidden text-4xl font-bold text-gradient-lime-violet lg:block'>DocuBot</h1>
      </Link>

      <div className='flex items-center space-x-4'>
        <button
          onClick={toggleMenu}
          className='rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-accent md:hidden'
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls='mobile-menu'
        >
          {isMenuOpen ? <X size={24} aria-hidden='true' /> : <Menu size={24} aria-hidden='true' />}
        </button>

        {/* Mobile Menu Overlay */}
        <div
          id='mobile-menu'
          className={`fixed inset-0 top-[72px] z-50 transform bg-light-600 transition-transform duration-300 ease-in-out dark:bg-dark-800 md:hidden ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role='dialog'
          aria-modal='true'
          aria-labelledby='mobile-menu-title'
        >
          <div className='flex flex-col items-center space-y-6 pt-8'>
            <h2 id='mobile-menu-title' className='sr-only'>
              Navigation Menu
            </h2>

            <SignedIn>
              <Link
                href='/dashboard'
                onClick={closeMenu}
                className='rounded-md focus:outline-none focus:ring-2 focus:ring-accent'
                aria-label='Go to dashboard'
              >
                <Button variant='default'>Dashboard</Button>
              </Link>

              {/* Admin Panel Link - Mobile */}
              {isAdmin && (
                <Link
                  href='/admin'
                  onClick={closeMenu}
                  className='rounded-md focus:outline-none focus:ring-2 focus:ring-accent'
                  aria-label='Access admin panel'
                >
                  <Button variant='outline'>
                    <Settings className='mr-2 h-4 w-4' />
                    Admin Panel
                  </Button>
                </Link>
              )}
            </SignedIn>

            <SignedOut>
              <nav className='flex flex-col items-center space-y-6' aria-label='Main navigation'>
                <Link
                  href='/pricing'
                  className='rounded-md px-2 py-1 text-dark-800 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent dark:text-light-300 dark:hover:text-accent4'
                  onClick={closeMenu}
                  aria-label='View pricing plans'
                >
                  Pricing
                </Link>
                <Link
                  href='/roadmap'
                  className='rounded-md px-2 py-1 text-dark-800 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent dark:text-light-300 dark:hover:text-accent4'
                  onClick={closeMenu}
                  aria-label='View product roadmap'
                >
                  Roadmap
                </Link>
                <Link
                  href='/about'
                  className='rounded-md px-2 py-1 text-dark-800 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent dark:text-light-300 dark:hover:text-accent4'
                  onClick={closeMenu}
                  aria-label='Learn about DocuBot'
                >
                  About
                </Link>
                <Link
                  href='/help-center'
                  className='rounded-md px-2 py-1 text-dark-800 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent dark:text-light-300 dark:hover:text-accent4'
                  onClick={closeMenu}
                  aria-label='Get help and support'
                >
                  Help Center
                </Link>
              </nav>
            </SignedOut>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className='hidden items-center space-x-4 md:flex'>
          <SignedIn>
            <Link
              href='/dashboard'
              className='rounded-md focus:outline-none focus:ring-2 focus:ring-accent'
              aria-label='Go to dashboard'
            >
              <Button variant='default'>Dashboard</Button>
            </Link>

            {/* Admin Panel Link - Desktop */}
            {isAdmin && (
              <Link
                href='/admin'
                className='rounded-md focus:outline-none focus:ring-2 focus:ring-accent'
                aria-label='Access admin panel'
              >
                <Button variant='outline'>
                  <Settings className='mr-2 h-4 w-4' />
                  Admin Panel
                </Button>
              </Link>
            )}
          </SignedIn>

          <SignedOut>
            <nav className='mr-18 space-x-12' aria-label='Main navigation'>
              <Link
                href='/pricing'
                className='rounded-md px-2 py-1 text-dark-800 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent dark:text-light-300 dark:hover:text-accent4'
                aria-label='View pricing plans'
              >
                Pricing
              </Link>
              <Link
                href='/roadmap'
                className='rounded-md px-2 py-1 text-dark-800 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent dark:text-light-300 dark:hover:text-accent4'
                aria-label='View product roadmap'
              >
                Roadmap
              </Link>
              <Link
                href='/about'
                className='rounded-md px-2 py-1 text-dark-800 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent dark:text-light-300 dark:hover:text-accent4'
                aria-label='Learn about DocuBot'
              >
                About
              </Link>
              <Link
                href='/help-center'
                className='rounded-md px-2 py-1 text-dark-800 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent dark:text-light-300 dark:hover:text-accent4'
                aria-label='Get help and support'
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
            userProfileProps={{
              appearance: {
                elements: {
                  rootBox: 'focus:outline-none focus:ring-2 focus:ring-accent',
                },
              },
            }}
          />
        </SignedIn>

        <nav className='flex space-x-4' aria-label='Authentication navigation'>
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
      </div>
    </header>
  );
};

export default Header2;
