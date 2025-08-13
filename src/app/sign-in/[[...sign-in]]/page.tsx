'use client';

import React, { useEffect, useState } from 'react';
import { useSignIn, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/util/utils';

export default function SignInPage() {
  const { isLoaded } = useAuth();
  const { isLoaded: signInLoaded, signIn, setActive } = useSignIn();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (strategy: 'oauth_github' | 'oauth_google') => {
    if (!signInLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: '/dashboard',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Social sign in failed');
      setIsLoading(false);
    }
  };

  // Don't render until mounted and Clerk is loaded
  if (!mounted || !isLoaded || !signInLoaded) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-accent'></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-light-100 via-accent2/30 to-accent/40 px-4 py-16 transition-colors duration-300 dark:from-dark-900 dark:via-dark-800 dark:to-accent3/30 sm:px-6 lg:px-8'>
      <div className='relative mx-auto max-w-6xl'>
        {/* Decorative elements */}
        <div className='absolute -left-20 top-1/3 -z-10 h-80 w-80 rounded-full bg-gradient-to-br from-accent2/40 to-accent3/30 blur-3xl dark:from-accent2/20 dark:to-accent3/10' />
        <div className='absolute -bottom-10 -right-20 -z-10 h-96 w-96 rounded-full bg-gradient-to-tl from-accent/30 to-accent4/20 blur-3xl dark:from-accent/20 dark:to-accent4/10' />

        <div className='grid grid-cols-1 gap-0 overflow-hidden rounded-3xl border border-dark-300/50 bg-white/50 shadow-xl backdrop-blur-sm dark:border-light-600/30 dark:bg-dark-800/50 lg:grid-cols-2'>
          {/* Left Panel - Information */}
          <div className='flex flex-col items-center justify-center space-y-8 bg-gradient-to-b from-light-100 via-accent2/30 to-accent/40 p-8 shadow-lg backdrop-blur-md transition-colors duration-300 dark:from-dark-900 dark:via-dark-800 dark:to-accent3/30 md:p-12'>
            <div className='group relative'>
              <div className='absolute -inset-4 rounded-full bg-gradient-to-r from-accent2 to-accent opacity-70 blur-lg transition-all duration-500 group-hover:opacity-100 group-hover:blur-xl dark:opacity-90' />
              <div className='relative flex items-center justify-center'>
                <Image
                  src='/logo.png'
                  width={150}
                  height={150}
                  alt='DocuBot Logo'
                  className='transition-transform duration-500 group-hover:scale-105'
                />
              </div>
            </div>

            <div className='text-center'>
              <h1 className='mb-2 text-5xl font-bold'>
                <span className='text-accent2 dark:text-accent2'>Docu</span>
                <span className='text-dark-800 dark:text-light-100'>Bot</span>
              </h1>
              <h2 className='mx-auto max-w-sm text-lg font-light text-dark-600 dark:text-light-300'>
                Transform your PDFs into interactive conversations with AI-powered document
                analysis
              </h2>
              <div className='mb-4 mt-8'>
                <div className='inline-flex items-center rounded-full bg-gradient-to-r from-accent2/20 to-accent/20 px-6 py-3 backdrop-blur-sm dark:from-accent2/20 dark:to-accent/20'>
                  <ArrowRight className='mr-2 h-5 w-5 text-accent2 dark:text-accent2' />
                  <h3 className='font-medium text-dark-700 dark:text-light-100'>
                    Sign in to get started
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Authentication Form */}
          <div className='flex items-center justify-center bg-gradient-to-b from-light-100 via-accent2/30 to-accent/40 p-6 backdrop-blur-md transition-colors duration-300 dark:from-dark-900 dark:via-dark-800 dark:to-accent3/30 md:p-10'>
            <Card className='w-full min-w-max border-light-300/50 bg-white/80 backdrop-blur-sm dark:border-dark-600/50 dark:bg-dark-800/80 sm:w-96'>
              <CardHeader>
                <div className='flex w-full flex-col items-center justify-center space-y-4'>
                  <Image src='/logo.png' alt='DocuBot logo' width={75} height={75} />
                  <CardTitle className='text-center'>
                    Sign in to <span className='text-accent2 dark:text-accent2'>DocuBot</span>
                  </CardTitle>
                  <CardDescription className='text-center'>
                    Welcome back! Please sign in to continue.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className='w-full space-y-4'>
                {error && (
                  <div className='rounded-md border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700'>
                    {error}
                  </div>
                )}

                {/* Social Login Options */}
                <div className='grid w-full grid-cols-2 gap-x-4'>
                  <Button
                    size='sm'
                    variant='outline'
                    type='button'
                    disabled={isLoading}
                    aria-label='Sign in with GitHub'
                    onClick={() => handleSocialSignIn('oauth_github')}
                  >
                    {isLoading ? (
                      <Icons.spinner className='size-4 animate-spin' />
                    ) : (
                      <>
                        <Icons.gitHub className='mr-2 size-4' />
                        GitHub
                      </>
                    )}
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    type='button'
                    disabled={isLoading}
                    aria-label='Sign in with Google'
                    onClick={() => handleSocialSignIn('oauth_google')}
                  >
                    {isLoading ? (
                      <Icons.spinner className='size-4 animate-spin' />
                    ) : (
                      <>
                        <Icons.google className='mr-2 size-4' />
                        Google
                      </>
                    )}
                  </Button>
                </div>

                <p className='flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border'>
                  or
                </p>

                {/* Combined Email/Username and Password Fields */}
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email or Username</Label>
                    <Input
                      id='email'
                      type='text'
                      placeholder='Email Address'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='password'>Password</Label>
                    <Input
                      id='password'
                      type='password'
                      placeholder='Password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </form>

                {/* Forgot Password Link */}
                <div className='text-center'>
                  <Button type='button' variant='link' size='sm'>
                    Forgot your password?
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <div className='grid w-full gap-y-4'>
                  <Button
                    type='submit'
                    disabled={isLoading}
                    className='w-full bg-accent text-white hover:bg-accent/90'
                    onClick={handleSubmit}
                  >
                    {isLoading ? <Icons.spinner className='size-4 animate-spin' /> : 'Sign In'}
                  </Button>
                  <Button variant='link' size='sm' asChild>
                    <Link href='/sign-up'>Don&apos;t have an account? Sign up</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
