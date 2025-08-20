'use client';

import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

import ThemeSelector from '@/components/Global/ThemeSelector';
import { dark } from '@clerk/themes';
import { useThemeClasses } from '@/components/Global/ThemeAwareWrapper';

import { Button } from '../ui/button';
import { File, FilePlus2, Settings } from 'lucide-react';
import UpgradeButton from '../Dashboard/UpgradeButton';

const Header = () => {
  const { user, isLoaded } = useUser();
  const isAdmin = user?.publicMetadata?.isAdmin === true;
  const { getClasses } = useThemeClasses();

  // Don't render admin features until user data is loaded
  if (!isLoaded) {
    return (
      <header
        className={getClasses({
          base: 'flex items-center justify-between px-5 py-3 shadow-xl',
          business: 'border-b border-border bg-background',
          neonLight: 'bg-light-600 shadow-dark-800/30',
          neonDark: 'bg-slate-800/95 shadow-black/50',
        })}
      >
        <Link href='/' className='flex items-center space-x-4' aria-label='DocuBot home page'>
          <Image src='/logo.png' alt='DocuBot logo' width={45} height={45} priority />
          <h1
            className={getClasses({
              base: 'hidden text-4xl font-bold md:block',
              business: 'text-foreground',
              neon: 'text-gradient-lime-violet',
            })}
          >
            DocuBot
          </h1>
        </Link>
        <div className='flex items-center space-x-4'>
          <ThemeSelector />
        </div>
      </header>
    );
  }

  return (
    <header
      className={getClasses({
        base: 'flex items-center justify-between px-5 py-3 shadow-xl',
        business: 'border-b border-border bg-background',
        neonLight: 'bg-light-600 shadow-dark-800/30',
        neonDark: 'bg-slate-800/95 shadow-black/50',
      })}
    >
      <SignedOut>
        <Link href='/' className='flex items-center space-x-4' aria-label='DocuBot home page'>
          <Image src='/logo.png' alt='DocuBot logo' width={45} height={45} priority />
          <h1
            className={getClasses({
              base: 'hidden text-4xl font-bold md:block',
              business: 'text-foreground',
              neon: 'text-gradient-lime-violet',
            })}
          >
            DocuBot
          </h1>
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
            <h1 className='business-light:text-foreground business-dark:text-foreground neon-light:text-gradient-lime-violet neon-dark:text-gradient-lime-violet hidden text-4xl font-bold md:block'>
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

            {/* Admin Panel Link - Only visible to admins */}
            {isAdmin && (
              <Button asChild variant='outline'>
                <Link href='/admin' aria-label='Access admin panel'>
                  <Settings aria-hidden='true' />
                  <span className='hidden md:block'>Admin Panel</span>
                  <span className='sr-only md:hidden'>Admin Panel</span>
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </SignedIn>

      <div className='flex items-center space-x-4'>
        <SignedIn>
          <UpgradeButton />
          <ThemeSelector />
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
            <Button
              asChild
              variant='outline'
              className={getClasses({
                base: 'border focus:outline-none focus:ring-2 focus:ring-offset-2',
                business:
                  'border-border bg-background text-foreground hover:bg-secondary focus:ring-ring',
                neonLight:
                  'border-accent bg-light-700 text-dark-800 hover:bg-light-600 focus:ring-accent',
                neonDark:
                  'border-accent2 bg-slate-800 text-slate-300 hover:bg-slate-700 focus:ring-accent2/60',
              })}
            >
              <Link href='/sign-up' aria-label='Create new account'>
                Sign Up
              </Link>
            </Button>
            <Button
              asChild
              variant='default'
              className={getClasses({
                base: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
                business: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring',
                neonLight: 'bg-accent2 text-light-100 hover:bg-accent2/90 focus:ring-accent2',
                neonDark:
                  'bg-accent font-semibold text-slate-900 hover:bg-accent focus:ring-accent',
              })}
            >
              <Link href='/sign-in' aria-label='Sign in to your account'>
                Sign In
              </Link>
            </Button>
          </nav>
          <ThemeSelector />
        </SignedOut>
      </div>
    </header>
  );
};

export default Header;
