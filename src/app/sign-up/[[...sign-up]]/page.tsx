'use client';
// eslint-disable react/function-component-definition
import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';
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
// import { BsMicrosoft } from 'react-icons/bs';

export default function SignUpPage() {
  return (
    <div className='flex w-full grow items-center bg-gradient-to-br from-accent2/40 to-accent/40 px-4 dark:from-accent3/30 dark:to-accent4/30 sm:justify-center'>
      <SignUp.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignUp.Step name='start'>
                <Card className='w-full min-w-max sm:w-96'>
                  <CardHeader className='flex w-full flex-col items-start justify-center'>
                    <Image src='/logo.png' alt='Docubot logo' width={55} height={55} />
                    <CardTitle>Create your Docubot account</CardTitle>
                    <CardDescription>
                      Welcome to DocuBot! Please fill in the details to get started.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='w-full flex-col gap-y-4'>
                    <Clerk.GlobalError className='text-sm text-destructive' />
                    <div className='grid w-full grid-cols-3 gap-x-4 gap-y-2'>
                      <Clerk.Connection name='github' asChild>
                        <Button
                          size='sm'
                          variant='outline'
                          type='button'
                          disabled={isGlobalLoading}
                          aria-label='Sign up with GitHub'
                          className='w-32'
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
                          aria-label='Sign up with Google'
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
                      <Clerk.Connection name='metamask' asChild>
                        <Button
                          size='sm'
                          variant='outline'
                          type='button'
                          disabled={isGlobalLoading}
                          aria-label='Sign up with Metamask'
                        >
                          {isGlobalLoading ? (
                            <Icons.spinner className='size-4 animate-spin' />
                          ) : (
                            <>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='1.1em'
                                height='1.05em'
                                viewBox='0 0 256 240'
                                className='mr-2 size-4'
                              >
                                <path fill='#e17726' d='M250.066 0L140.219 81.279l20.427-47.9z' />
                                <path
                                  fill='#e27625'
                                  d='m6.191.096l89.181 33.289l19.396 48.528zM205.86 172.858l48.551.924l-16.968 57.642l-59.243-16.311zm-155.721 0l27.557 42.255l-59.143 16.312l-16.865-57.643z'
                                />
                                <path
                                  fill='#e27625'
                                  d='m112.131 69.552l1.984 64.083l-59.371-2.701l16.888-25.478l.214-.245zm31.123-.715l40.9 36.376l.212.244l16.888 25.478l-59.358 2.7zM79.435 173.044l32.418 25.259l-37.658 18.181zm97.136-.004l5.131 43.445l-37.553-18.184z'
                                />
                                <path
                                  fill='#d5bfb2'
                                  d='m144.978 195.922l38.107 18.452l-35.447 16.846l.368-11.134zm-33.967.008l-2.909 23.974l.239 11.303l-35.53-16.833z'
                                />
                                <path
                                  fill='#233447'
                                  d='m100.007 141.999l9.958 20.928l-33.903-9.932zm55.985.002l24.058 10.994l-34.014 9.929z'
                                />
                                <path
                                  fill='#cc6228'
                                  d='m82.026 172.83l-5.48 45.04l-29.373-44.055zm91.95.001l34.854.984l-29.483 44.057zm28.136-44.444l-25.365 25.851l-19.557-8.937l-9.363 19.684l-6.138-33.849zm-148.237 0l60.435 2.749l-6.139 33.849l-9.365-19.681l-19.453 8.935z'
                                />
                                <path
                                  fill='#e27525'
                                  d='m52.166 123.082l28.698 29.121l.994 28.749zm151.697-.052l-29.746 57.973l1.12-28.8zm-90.956 1.826l1.155 7.27l2.854 18.111l-1.835 55.625l-8.675-44.685l-.003-.462zm30.171-.101l6.521 35.96l-.003.462l-8.697 44.797l-.344-11.205l-1.357-44.862z'
                                />
                                <path
                                  fill='#f5841f'
                                  d='m177.788 151.046l-.971 24.978l-30.274 23.587l-6.12-4.324l6.86-35.335zm-99.471 0l30.399 8.906l6.86 35.335l-6.12 4.324l-30.275-23.589z'
                                />
                                <path
                                  fill='#c0ac9d'
                                  d='m67.018 208.858l38.732 18.352l-.164-7.837l3.241-2.845h38.334l3.358 2.835l-.248 7.831l38.487-18.29l-18.728 15.476l-22.645 15.553h-38.869l-22.63-15.617z'
                                />
                                <path
                                  fill='#161616'
                                  d='m142.204 193.479l5.476 3.869l3.209 25.604l-4.644-3.921h-36.476l-4.556 4l3.104-25.681l5.478-3.871z'
                                />
                                <path
                                  fill='#763e1a'
                                  d='M242.814 2.25L256 41.807l-8.235 39.997l5.864 4.523l-7.935 6.054l5.964 4.606l-7.897 7.191l4.848 3.511l-12.866 15.026l-52.77-15.365l-.457-.245l-38.027-32.078zm-229.628 0l98.326 72.777l-38.028 32.078l-.457.245l-52.77 15.365l-12.866-15.026l4.844-3.508l-7.892-7.194l5.952-4.601l-8.054-6.071l6.085-4.526L0 41.809z'
                                />
                                <path
                                  fill='#f5841f'
                                  d='m180.392 103.99l55.913 16.279l18.165 55.986h-47.924l-33.02.416l24.014-46.808zm-104.784 0l-17.151 25.873l24.017 46.808l-33.005-.416H1.631l18.063-55.985zm87.776-70.878l-15.639 42.239l-3.319 57.06l-1.27 17.885l-.101 45.688h-30.111l-.098-45.602l-1.274-17.986l-3.32-57.045l-15.637-42.239z'
                                />
                              </svg>
                              {/* <Icons.metamask className='mr-2 size-4' /> */}
                              Metamask
                            </>
                          )}
                        </Button>
                      </Clerk.Connection>
                      {/* <Clerk.Connection name='microsoft' asChild>
                        <Button
                          size='sm'
                          variant='outline'
                          type='button'
                          disabled={isGlobalLoading}
                          aria-label='Sign up with Microsoft'
                        >
                          {isGlobalLoading ? (
                            <Icons.spinner className='size-4 animate-spin' />
                          ) : (
                            <>
                              <BsMicrosoft className='mr-2 size-4' />
                              Microsoft
                            </>
                          )}
                        </Button>
                      </Clerk.Connection>

                      <Clerk.Connection name='apple' asChild>
                        <Button
                          size='sm'
                          variant='outline'
                          type='button'
                          disabled={isGlobalLoading}
                          aria-label='Sign up with Apple'
                        >
                          {isGlobalLoading ? (
                            <Icons.spinner className='size-4 animate-spin' />
                          ) : (
                            <>
                              <Icons.apple className='mr-2 size-4' />
                              Apple
                            </>
                          )}
                        </Button>
                      </Clerk.Connection> */}
                    </div>
                    <p className='flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border'>
                      or
                    </p>
                    <Clerk.Field name='username' className='space-y-2'>
                      <Clerk.Label asChild>
                        <Label>Username</Label>
                      </Clerk.Label>
                      <Clerk.Input type='text' required minLength={3} asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className='block text-sm text-destructive' />
                    </Clerk.Field>
                    <Clerk.Field name='emailAddress' className='space-y-2'>
                      <Clerk.Label asChild>
                        <Label>Email address</Label>
                      </Clerk.Label>
                      <Clerk.Input type='email' required asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className='block text-sm text-destructive' />
                    </Clerk.Field>
                    <Clerk.Field name='password' className='space-y-2'>
                      <Clerk.Label asChild>
                        <Label>Password</Label>
                      </Clerk.Label>
                      <Clerk.Input type='password' required minLength={8} asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className='block text-sm text-destructive' />
                    </Clerk.Field>
                    {/* <Clerk.Field name='phoneNumber' className='space-y-2'>
                      <Clerk.Label asChild>
                        <Label>Phone Number</Label>
                      </Clerk.Label>
                      <Clerk.Input type='tel' asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className='block text-sm text-destructive' />
                    </Clerk.Field> */}
                  </CardContent>
                  <CardFooter>
                    <div className='grid w-full gap-y-4'>
                      <SignUp.Action submit asChild>
                        <Button
                          disabled={isGlobalLoading}
                          className='max-w-min justify-self-end bg-accent'
                        >
                          {isGlobalLoading ? (
                            <Icons.spinner className='size-4 animate-spin' />
                          ) : (
                            'Sign up'
                          )}
                        </Button>
                      </SignUp.Action>
                      <Button variant='link' size='sm' asChild>
                        <Link href='/sign-in'>Already have an account? Sign in</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </SignUp.Step>

              <SignUp.Step name='continue'>
                <Card className='w-full sm:w-96'>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                    <CardDescription>Please provide any missing information</CardDescription>
                  </CardHeader>
                  <CardContent className='grid gap-y-4'>
                    <Clerk.GlobalError className='text-sm text-destructive' />
                    <Clerk.Field name='username' className='space-y-2'>
                      <Clerk.Label asChild>
                        <Label>Username</Label>
                      </Clerk.Label>
                      <Clerk.Input type='text' required minLength={3} asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className='block text-sm text-destructive' />
                    </Clerk.Field>

                    <Clerk.Field name='name' className='space-y-2'>
                      <Clerk.Label asChild>
                        <Label>Name</Label>
                      </Clerk.Label>
                      <Clerk.Input type='text' required asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className='block text-sm text-destructive' />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <SignUp.Action submit asChild>
                      <Button disabled={isGlobalLoading}>
                        {isGlobalLoading ? (
                          <Icons.spinner className='size-4 animate-spin' />
                        ) : (
                          'Continue'
                        )}
                      </Button>
                    </SignUp.Action>
                  </CardFooter>
                </Card>
              </SignUp.Step>

              <SignUp.Step name='verifications'>
                <Clerk.GlobalError className='text-sm text-destructive' />
                <SignUp.Strategy name='email_code'>
                  <Card className='w-full sm:w-96'>
                    <CardHeader>
                      <CardTitle>Verify your email</CardTitle>
                      <CardDescription>
                        Use the verification link sent to your email address
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
                              required
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
                        <SignUp.Action
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
                        </SignUp.Action>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className='grid w-full gap-y-4'>
                        <SignUp.Action submit asChild>
                          <Button disabled={isGlobalLoading}>
                            {isGlobalLoading ? (
                              <Icons.spinner className='size-4 animate-spin' />
                            ) : (
                              'Verify'
                            )}
                          </Button>
                        </SignUp.Action>
                      </div>
                    </CardFooter>
                  </Card>
                </SignUp.Strategy>
                {/* <SignUp.Strategy name='phone_code'>
                  <Card className='w-full sm:w-96'>
                    <CardHeader>
                      <CardTitle>Verify your phone number</CardTitle>
                      <CardDescription>Enter the code sent to your phone</CardDescription>
                    </CardHeader>
                    <CardContent className='grid gap-y-4'>
                      <Clerk.GlobalError className='text-sm text-destructive' />
                      <Clerk.Field name='code' className='space-y-2'>
                        <Clerk.Label className='sr-only'>Phone code</Clerk.Label>
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
                      <SignUp.Action
                        asChild
                        resend
                        className='text-muted-foreground'
                        fallback={({ resendableAfter }) => (
                          <Button variant='link' size='sm' disabled>
                            Resend code ({resendableAfter})
                          </Button>
                        )}
                      >
                        <Button type='button' variant='link' size='sm'>
                          Resend code
                        </Button>
                      </SignUp.Action>
                    </CardContent>
                    <CardFooter>
                      <SignUp.Action submit asChild>
                        <Button disabled={isGlobalLoading}>
                          {isGlobalLoading ? (
                            <Icons.spinner className='size-4 animate-spin' />
                          ) : (
                            'Verify'
                          )}
                        </Button>
                      </SignUp.Action>
                    </CardFooter>
                  </Card>
                </SignUp.Strategy> */}
              </SignUp.Step>
            </>
          )}
        </Clerk.Loading>
      </SignUp.Root>
    </div>
  );
}
