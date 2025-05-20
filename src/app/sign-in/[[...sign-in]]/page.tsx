'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import * as Clerk from '@clerk/elements/common';
import * as SignIn from '@clerk/elements/sign-in';
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
            <SignIn.Root>
              <Clerk.Loading>
                {(isGlobalLoading) => (
                  <>
                    <SignIn.Step name='start'>
                      <Card className='w-full min-w-max border-light-300/50 bg-white/80 backdrop-blur-sm dark:border-dark-600/50 dark:bg-dark-800/80 sm:w-96'>
                        <CardHeader>
                          <div className='flex w-full flex-col items-center justify-center space-y-4'>
                            <Image src='/logo.png' alt='DocuBot logo' width={75} height={75} />
                            <CardTitle className='text-center'>
                              Sign in to{' '}
                              <span className='text-accent2 dark:text-accent2'>DocuBot</span>
                            </CardTitle>
                            <CardDescription className='text-center'>
                              Welcome back! Please sign in to continue.
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className='w-full space-y-4'>
                          <Clerk.GlobalError className='text-sm text-destructive' />

                          {/* Social Login Options */}
                          <div className='grid w-full grid-cols-2 gap-x-4'>
                            <Clerk.Connection name='github' asChild>
                              <Button
                                size='sm'
                                variant='outline'
                                type='button'
                                disabled={isGlobalLoading}
                                aria-label='Sign in with GitHub'
                              >
                                {isGlobalLoading ? (
                                  <Icons.spinner className='size-4 animate-spin' />
                                ) : (
                                  <>
                                    <Icons.gitHub className='mr-2 size-4' />
                                    GitHub
                                  </>
                                )}
                              </Button>
                            </Clerk.Connection>
                            <Clerk.Connection name='google' asChild>
                              <Button
                                size='sm'
                                variant='outline'
                                type='button'
                                disabled={isGlobalLoading}
                                aria-label='Sign in with Google'
                              >
                                {isGlobalLoading ? (
                                  <Icons.spinner className='size-4 animate-spin' />
                                ) : (
                                  <>
                                    <Icons.google className='mr-2 size-4' />
                                    Google
                                  </>
                                )}
                              </Button>
                            </Clerk.Connection>
                          </div>

                          <p className='flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border'>
                            or
                          </p>

                          {/* Combined Email/Username and Password Fields */}
                          <div className='space-y-4'>
                            <Clerk.Field name='identifier' className='space-y-2'>
                              <Clerk.Label asChild>
                                <Label>Email or Username</Label>
                              </Clerk.Label>
                              <Clerk.Input type='text' required asChild>
                                <Input />
                              </Clerk.Input>
                              <Clerk.FieldError className='block text-sm text-destructive' />
                            </Clerk.Field>

                            <Clerk.Field name='password' className='space-y-2'>
                              <Clerk.Label asChild>
                                <Label>Password</Label>
                              </Clerk.Label>
                              <Clerk.Input type='password' required asChild>
                                <Input />
                              </Clerk.Input>
                              <Clerk.FieldError className='block text-sm text-destructive' />
                            </Clerk.Field>
                          </div>

                          {/* Forgot Password Link */}
                          <div className='text-center'>
                            <SignIn.Action navigate='forgot-password' asChild>
                              <Button type='button' variant='link' size='sm'>
                                Forgot your password?
                              </Button>
                            </SignIn.Action>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <div className='grid w-full gap-y-4'>
                            <SignIn.Action submit asChild>
                              <Button
                                disabled={isGlobalLoading}
                                className='w-full bg-accent text-white hover:bg-accent/90'
                              >
                                {isGlobalLoading ? (
                                  <Icons.spinner className='size-4 animate-spin' />
                                ) : (
                                  'Sign In'
                                )}
                              </Button>
                            </SignIn.Action>
                            <Button variant='link' size='sm' asChild>
                              <Link href='/sign-up'>Don&apos;t have an account? Sign up</Link>
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </SignIn.Step>

                    {/* Keep verification steps for email codes, etc. */}
                    <SignIn.Step name='verifications'>
                      <SignIn.Strategy name='email_code'>
                        <Card className='w-full border-light-300/50 bg-white/80 backdrop-blur-sm dark:border-dark-600/50 dark:bg-dark-800/80 sm:w-96'>
                          <CardHeader>
                            <CardTitle>Verify your email</CardTitle>
                            <CardDescription>
                              Use the verification code sent to your email address
                            </CardDescription>
                          </CardHeader>
                          <CardContent className='grid gap-y-4'>
                            <Clerk.GlobalError className='text-sm text-destructive' />
                            <div className='grid items-center justify-center gap-y-2'>
                              <Clerk.Field name='code' className='space-y-2'>
                                <Clerk.Label className='sr-only'>Email code</Clerk.Label>
                                <div className='flex justify-center text-center'>
                                  <Clerk.Input
                                    type='otp'
                                    className='flex justify-center has-[:disabled]:opacity-50'
                                    autoSubmit
                                    render={({ value, status }) => {
                                      return (
                                        <div
                                          data-status={status}
                                          className={cn(
                                            'relative flex size-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
                                            {
                                              'z-10 ring-2 ring-ring ring-offset-background':
                                                status === 'cursor' || status === 'selected',
                                            }
                                          )}
                                        >
                                          {value}
                                          {status === 'cursor' && (
                                            <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
                                              <div className='h-4 w-px animate-caret-blink bg-foreground duration-1000' />
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }}
                                  />
                                </div>
                                <Clerk.FieldError className='block text-center text-sm text-destructive' />
                              </Clerk.Field>
                              <SignIn.Action
                                asChild
                                resend
                                className='text-muted-foreground'
                                fallback={({ resendableAfter }) => (
                                  <Button variant='link' size='sm' disabled>
                                    Didn&apos;t receive a code? Resend (
                                    <span className='tabular-nums'>{resendableAfter}</span>)
                                  </Button>
                                )}
                              >
                                <Button type='button' variant='link' size='sm'>
                                  Didn&apos;t receive a code? Resend
                                </Button>
                              </SignIn.Action>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <div className='grid w-full gap-y-4'>
                              <SignIn.Action submit asChild>
                                <Button disabled={isGlobalLoading}>
                                  {isGlobalLoading ? (
                                    <Icons.spinner className='size-4 animate-spin' />
                                  ) : (
                                    'Verify'
                                  )}
                                </Button>
                              </SignIn.Action>
                            </div>
                          </CardFooter>
                        </Card>
                      </SignIn.Strategy>
                    </SignIn.Step>

                    {/* Forgot Password Step */}
                    <SignIn.Step name='forgot-password'>
                      <Card className='w-full border-light-300/50 bg-white/80 backdrop-blur-sm dark:border-dark-600/50 dark:bg-dark-800/80 sm:w-96'>
                        <CardHeader>
                          <CardTitle>Forgot your password?</CardTitle>
                          <CardDescription>
                            Enter your email or username and we&apos;ll send you a reset link
                          </CardDescription>
                        </CardHeader>
                        <CardContent className='grid gap-y-4'>
                          <Clerk.Field name='identifier' className='space-y-2'>
                            <Clerk.Label asChild>
                              <Label>Email or Username</Label>
                            </Clerk.Label>
                            <Clerk.Input type='text' required asChild>
                              <Input />
                            </Clerk.Input>
                            <Clerk.FieldError className='block text-sm text-destructive' />
                          </Clerk.Field>
                        </CardContent>
                        <CardFooter>
                          <div className='grid w-full gap-y-4'>
                            <SignIn.SupportedStrategy name='reset_password_email_code' asChild>
                              <Button disabled={isGlobalLoading}>
                                {isGlobalLoading ? (
                                  <Icons.spinner className='size-4 animate-spin' />
                                ) : (
                                  'Send reset link'
                                )}
                              </Button>
                            </SignIn.SupportedStrategy>
                            <SignIn.Action navigate='start' asChild>
                              <Button size='sm' variant='link'>
                                Back to sign in
                              </Button>
                            </SignIn.Action>
                          </div>
                        </CardFooter>
                      </Card>
                    </SignIn.Step>

                    {/* Reset Password Step */}
                    <SignIn.Step name='reset-password'>
                      <Card className='w-full border-light-300/50 bg-white/80 backdrop-blur-sm dark:border-dark-600/50 dark:bg-dark-800/80 sm:w-96'>
                        <CardHeader>
                          <CardTitle>Reset your password</CardTitle>
                          <CardDescription>Enter a new password for your account</CardDescription>
                        </CardHeader>
                        <CardContent className='grid gap-y-4'>
                          <Clerk.Field name='password' className='space-y-2'>
                            <Clerk.Label asChild>
                              <Label>New password</Label>
                            </Clerk.Label>
                            <Clerk.Input type='password' required asChild>
                              <Input />
                            </Clerk.Input>
                            <Clerk.FieldError className='block text-sm text-destructive' />
                          </Clerk.Field>
                          <Clerk.Field name='confirmPassword' className='space-y-2'>
                            <Clerk.Label asChild>
                              <Label>Confirm password</Label>
                            </Clerk.Label>
                            <Clerk.Input type='password' required asChild>
                              <Input />
                            </Clerk.Input>
                            <Clerk.FieldError className='block text-sm text-destructive' />
                          </Clerk.Field>
                        </CardContent>
                        <CardFooter>
                          <SignIn.Action submit asChild>
                            <Button disabled={isGlobalLoading}>
                              {isGlobalLoading ? (
                                <Icons.spinner className='size-4 animate-spin' />
                              ) : (
                                'Reset password'
                              )}
                            </Button>
                          </SignIn.Action>
                        </CardFooter>
                      </Card>
                    </SignIn.Step>
                  </>
                )}
              </Clerk.Loading>
            </SignIn.Root>
          </div>
        </div>
      </div>
    </div>
  );
}
