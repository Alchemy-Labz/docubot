'use client';
// eslint-disable react/function-component-definition
import React, { useEffect, useState } from 'react';
import { useSignUp, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
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
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function SignUpPage() {
  const { isLoaded } = useAuth();
  const { isLoaded: signUpLoaded, signUp, setActive } = useSignUp();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      await signUp.create({
        username,
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const onPressVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (strategy: 'oauth_github' | 'oauth_google') => {
    if (!signUpLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: '/dashboard',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Social sign up failed');
      setIsLoading(false);
    }
  };

  // Don't render until mounted and Clerk is loaded
  if (!mounted || !isLoaded || !signUpLoaded) {
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
                    Create your account to get started
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Authentication Form */}
          <div className='flex items-center justify-center bg-gradient-to-b from-light-100 via-accent2/30 to-accent/40 p-6 backdrop-blur-md transition-colors duration-300 dark:from-dark-900 dark:via-dark-800 dark:to-accent3/30 md:p-10'>
            {!pendingVerification ? (
              <Card className='w-full min-w-max border-light-300/50 bg-white/80 backdrop-blur-sm dark:border-dark-600/50 dark:bg-dark-800/80 sm:w-96'>
                <CardHeader>
                  <div className='flex w-full flex-col items-center justify-center space-y-4'>
                    <Image src='/logo.png' alt='DocuBot logo' width={75} height={75} />
                    <CardTitle className='text-center'>
                      Create your{' '}
                      <span className='text-accent2 dark:text-accent2'>DocuBot</span>{' '}
                      account
                    </CardTitle>
                    <CardDescription className='text-center'>
                      Welcome to DocuBot! Please fill in the details to get started.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className='w-full flex-col gap-y-4'>
                  {error && (
                    <div className='mb-4 rounded-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-sm'>
                      {error}
                    </div>
                  )}
                  <div className='grid w-full grid-cols-2 gap-x-4 gap-y-4'>
                    <Button
                      size='sm'
                      variant='outline'
                      type='button'
                      disabled={isLoading}
                      aria-label='Sign up with GitHub'
                      className='w-full'
                      onClick={() => handleSocialSignUp('oauth_github')}
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
                      aria-label='Sign up with Google'
                      className='w-full'
                      onClick={() => handleSocialSignUp('oauth_google')}
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
                  <p className='flex items-center gap-x-3 py-2 pt-8 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border'>
                    or
                  </p>
                  <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='firstName'>First Name</Label>
                        <Input
                          id='firstName'
                          type='text'
                          placeholder='First Name'
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='lastName'>Last Name</Label>
                        <Input
                          id='lastName'
                          type='text'
                          placeholder='Last Name'
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='username'>Username</Label>
                      <Input
                        id='username'
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength={3}
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email address</Label>
                      <Input
                        id='email'
                        type='email'
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
                        minLength={8}
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <div className='grid w-full gap-y-4'>
                    <Button
                      type='submit'
                      disabled={isLoading}
                      className='w-full bg-accent text-white hover:bg-accent/90'
                      onClick={handleSubmit}
                    >
                      {isLoading ? (
                        <Icons.spinner className='size-4 animate-spin' />
                      ) : (
                        'Sign up'
                      )}
                    </Button>
                    <Button variant='link' size='sm' asChild>
                      <Link href='/sign-in'>Already have an account? Sign in</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ) : (
              <Card className='w-full border-light-300/50 bg-white/80 backdrop-blur-sm dark:border-dark-600/50 dark:bg-dark-800/80 sm:w-96'>
                <CardHeader>
                  <CardTitle>Verify your email</CardTitle>
                  <CardDescription>
                    We sent a verification code to {email}
                  </CardDescription>
                </CardHeader>
                <CardContent className='grid gap-y-4'>
                  {error && (
                    <div className='rounded-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-sm'>
                      {error}
                    </div>
                  )}
                  <form onSubmit={onPressVerify} className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='code'>Verification Code</Label>
                      <Input
                        id='code'
                        type='text'
                        placeholder='Enter verification code'
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button
                    type='submit'
                    disabled={isLoading}
                    className='w-full bg-accent text-white hover:bg-accent/90'
                    onClick={onPressVerify}
                  >
                    {isLoading ? (
                      <Icons.spinner className='size-4 animate-spin' />
                    ) : (
                      'Verify Email'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
