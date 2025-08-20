'use client';
// components/Global/Header2.tsx
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import ThemeSelector from '@/components/Global/ThemeSelector';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';
import { useThemeClasses } from '@/components/Global/ThemeAwareWrapper';

const Header2 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const isAdmin = user?.publicMetadata?.isAdmin === true;
  const { getClasses } = useThemeClasses();

  // Don't render admin features until user data is loaded
  if (!isLoaded) {
    return (
      <header
        className={getClasses({
          base: 'shadow-sm',
          business: 'border-b border-border bg-background',
          neonLight: 'bg-light-600 shadow-dark-800/30',
          neonDark: 'bg-neon2-dark-800/95 shadow-black/50',
        })}
      >
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 justify-between'>
            <div className='flex items-center'>
              <Link href='/' className='flex items-center space-x-2'>
                <Image src='/logo.png' alt='DocuBot' width={32} height={32} />
                <span
                  className={getClasses({
                    base: 'text-xl font-bold',
                    business: 'text-foreground',
                    neon: 'text-gradient-lime-violet',
                  })}
                >
                  DocuBot
                </span>
              </Link>
            </div>
            <div className='flex items-center space-x-4'>
              <ThemeSelector />
            </div>
          </div>
        </div>
      </header>
    );
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={getClasses({
        base: 'sticky top-0 z-10 flex items-center justify-between px-5 py-3 shadow-xl',
        business: 'border-b border-border bg-card shadow-black/10',
        neonLight: 'bg-light-600 shadow-dark-800/30',
        neonDark: 'bg-neon2-dark-800/95 shadow-black/50',
      })}
    >
      <Link href='/' className='flex items-center space-x-4' aria-label='DocuBot home page'>
        <Image src='/logo.png' alt='DocuBot logo' width={45} height={45} priority />
        <h1
          className={getClasses({
            base: 'hidden text-4xl font-bold lg:block',
            business: 'text-foreground',
            neon: 'text-gradient-lime-violet',
          })}
        >
          DocuBot
        </h1>
      </Link>

      <div className='flex items-center space-x-4'>
        <button
          onClick={toggleMenu}
          className={getClasses({
            base: 'rounded-md p-1 focus:outline-none focus:ring-2 md:hidden',
            business: 'text-foreground hover:bg-secondary focus:ring-ring',
            neonLight: 'text-dark-800 hover:bg-light-500 focus:ring-accent',
            neonDark: 'hover:bg-neon2-dark-700 text-light-400 focus:ring-accent',
          })}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls='mobile-menu'
        >
          {isMenuOpen ? <X size={24} aria-hidden='true' /> : <Menu size={24} aria-hidden='true' />}
        </button>

        {/* Mobile Menu Overlay */}
        <div
          id='mobile-menu'
          className={getClasses({
            base: `fixed inset-0 top-[72px] z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`,
            business: 'border-l border-border bg-background',
            neonLight: 'border-l border-light-400 bg-light-600',
            neonDark: 'border-neon2-dark-600 bg-neon2-dark-800/95 border-l',
          })}
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
                  className='business-light:text-foreground business-light:hover:text-primary business-dark:text-foreground business-dark:hover:text-primary neon-light:text-foreground neon-light:hover:text-accent neon-dark:text-foreground neon-dark:hover:text-accent rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary'
                  onClick={closeMenu}
                  aria-label='View pricing plans'
                >
                  Pricing
                </Link>
                <Link
                  href='/roadmap'
                  className='business-light:text-foreground business-light:hover:text-primary business-dark:text-foreground business-dark:hover:text-primary neon-light:text-foreground neon-light:hover:text-accent neon-dark:text-foreground neon-dark:hover:text-accent rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary'
                  onClick={closeMenu}
                  aria-label='View product roadmap'
                >
                  Roadmap
                </Link>
                <Link
                  href='/about'
                  className='business-light:text-foreground business-light:hover:text-primary business-dark:text-foreground business-dark:hover:text-primary neon-light:text-foreground neon-light:hover:text-accent neon-dark:text-foreground neon-dark:hover:text-accent rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary'
                  onClick={closeMenu}
                  aria-label='Learn about DocuBot'
                >
                  About
                </Link>
                <Link
                  href='/help-center'
                  className='business-light:text-foreground business-light:hover:text-primary business-dark:text-foreground business-dark:hover:text-primary neon-light:text-foreground neon-light:hover:text-accent neon-dark:text-foreground neon-dark:hover:text-accent rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary'
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
                className='business-light:text-foreground business-light:hover:text-primary business-dark:text-foreground business-dark:hover:text-primary neon-light:text-foreground neon-light:hover:text-accent neon-dark:text-foreground neon-dark:hover:text-accent rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary'
                aria-label='View pricing plans'
              >
                Pricing
              </Link>
              <Link
                href='/roadmap'
                className='business-light:text-foreground business-light:hover:text-primary business-dark:text-foreground business-dark:hover:text-primary neon-light:text-foreground neon-light:hover:text-accent neon-dark:text-foreground neon-dark:hover:text-accent rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary'
                aria-label='View product roadmap'
              >
                Roadmap
              </Link>
              <Link
                href='/about'
                className='business-light:text-foreground business-light:hover:text-primary business-dark:text-foreground business-dark:hover:text-primary neon-light:text-foreground neon-light:hover:text-accent neon-dark:text-foreground neon-dark:hover:text-accent rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary'
                aria-label='Learn about DocuBot'
              >
                About
              </Link>
              <Link
                href='/help-center'
                className='business-light:text-foreground business-light:hover:text-primary business-dark:text-foreground business-dark:hover:text-primary neon-light:text-foreground neon-light:hover:text-accent neon-dark:text-foreground neon-dark:hover:text-accent rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary'
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
            className='business-light:border-primary business-light:bg-background business-light:text-primary business-dark:border-primary business-dark:bg-background business-dark:text-primary neon-light:border-accent neon-light:bg-background neon-light:text-accent neon-dark:border-accent neon-dark:bg-background neon-dark:text-accent rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            href='/sign-up'
            aria-label='Create new account'
          >
            <button type='button'>Sign Up</button>
          </Link>
          <Link
            className='business-light:border-primary business-light:bg-primary business-light:text-primary-foreground business-dark:border-primary business-dark:bg-primary business-dark:text-primary-foreground neon-light:border-accent2 neon-light:bg-accent2 neon-light:text-white neon-dark:border-accent2 neon-dark:bg-accent2 neon-dark:text-white rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            href='/sign-in'
            aria-label='Sign in to your account'
          >
            <button type='button'>Sign In</button>
          </Link>
        </nav>

        <ThemeSelector />
      </div>
    </header>
  );
};

export default Header2;
