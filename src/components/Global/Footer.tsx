'use client';

import React from 'react';
import Link from 'next/link';
import NewsletterSubscribe from './NewsletterSubscribe';
import SocialLinks from './SocialLinks';
import { useThemeClasses } from '@/components/Global/ThemeAwareWrapper';

const Footer = () => {
  const { getClasses } = useThemeClasses();

  return (
    <footer
      className={getClasses({
        base: 'flex w-full justify-center overflow-hidden py-6 shadow-black',
        business: 'bg-muted text-muted-foreground',
        neonLight: 'bg-light-500/30 text-dark-700',
        neonDark: 'bg-neon2-dark-800/90 text-light-600',
      })}
    >
      {/* Social Media Icons */}
      <div className='bottom-0 flex w-full max-w-7xl flex-col items-center justify-start px-4'>
        <div
          className={getClasses({
            base: 'mb-3 flex w-full items-center justify-start border-b-2 pb-1',
            business: 'border-border text-muted-foreground',
            neonLight: 'border-light-500/50 text-dark-700',
            neonDark: 'border-neon2-dark-600/60 text-light-600',
          })}
        >
          <SocialLinks />
        </div>
        <div className='container mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
          {/* Company Links */}
          <div className='space-y-2'>
            <h3
              className={getClasses({
                base: 'text-lg font-bold',
                business: 'text-foreground',
                neonLight: 'text-dark-800',
                neonDark: 'text-light-300',
              })}
            >
              DocuBot
            </h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='https://docubot.indiereq.com/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={getClasses({
                    base: 'inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm font-medium shadow-sm transition-colors',
                    business:
                      'border-primary bg-background text-primary hover:border-primary/80 hover:bg-secondary',
                    neonLight:
                      'border-primary-600 text-primary-700 hover:bg-primary-50 hover:border-primary-700 bg-white',
                    neonDark:
                      'border-primary-400 text-primary-400 hover:border-primary-300 bg-dark-800 hover:bg-dark-700',
                  })}
                  aria-label='Request a feature on IndieReq'
                >
                  <svg width='32' height='32' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
                    <polygon points='12,5 21,21 3,21' fill='currentColor' />
                    <rect
                      x='11'
                      y='11'
                      width='2'
                      height='6'
                      rx='1'
                      className={getClasses({
                        base: '',
                        business: 'fill-primary-foreground',
                        neonLight: 'fill-white',
                        neonDark: 'fill-black',
                      })}
                    />
                    <rect
                      x='11'
                      y='18'
                      width='2'
                      height='2'
                      rx='1'
                      className={getClasses({
                        base: '',
                        business: 'fill-primary-foreground',
                        neonLight: 'fill-white',
                        neonDark: 'fill-black',
                      })}
                    />
                  </svg>
                  Request a Feature
                </a>
              </li>
              {/* <li>
              <Link href='/desktop-app'>Desktop app</Link>
              </li>
              <li>
              <Link href='/mobile-app'>Mobile app</Link>
              </li>
              <li>
              <Link href='/integrations'>Integrations</Link>
              </li> */}
            </ul>
          </div>

          {/* Product Links */}
          <div className='space-y-2'>
            <h3 className='business-light:text-foreground business-dark:text-foreground neon-light:text-dark-800 neon-dark:text-light-300 text-lg font-bold'>
              Product
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/dashboard'
                  className='business-light:text-muted-foreground business-light:hover:text-primary business-dark:text-muted-foreground business-dark:hover:text-primary neon-light:text-dark-600 neon-light:hover:text-accent neon-dark:text-light-400 neon-dark:hover:text-accent transition-colors'
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href='/pricing'
                  className='business-light:text-muted-foreground business-light:hover:text-primary business-dark:text-muted-foreground business-dark:hover:text-primary neon-light:text-dark-600 neon-light:hover:text-accent neon-dark:text-light-400 neon-dark:hover:text-accent transition-colors'
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href='/roadmap'
                  className='business-light:text-muted-foreground business-light:hover:text-primary business-dark:text-muted-foreground business-dark:hover:text-primary neon-light:text-dark-600 neon-light:hover:text-accent neon-dark:text-light-400 neon-dark:hover:text-accent transition-colors'
                >
                  Roadmap
                </Link>
              </li>
              <li>
                <Link
                  href='/help-center'
                  className='business-light:text-muted-foreground business-light:hover:text-primary business-dark:text-muted-foreground business-dark:hover:text-primary neon-light:text-dark-600 neon-light:hover:text-accent neon-dark:text-light-400 neon-dark:hover:text-accent transition-colors'
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className='space-y-2'>
            <h3 className='text-lg font-bold text-dark-800 dark:text-light-300'>Support</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/help-center'
                  className='text-dark-600 transition-colors hover:text-accent dark:text-light-400 dark:hover:text-accent4'
                >
                  Help center
                </Link>
                <ul className='mt-2 space-y-1 text-sm font-light text-dark-500 dark:text-light-500'>
                  <li>
                    <Link
                      href='/help-center/documentation'
                      className='hover:text-primary-600 transition-colors'
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/help-center/faq'
                      className='hover:text-primary-600 transition-colors'
                    >
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/help-center/user-guide'
                      className='hover:text-primary-600 transition-colors'
                    >
                      User Guide
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/help-center/support'
                      className='hover:text-primary-600 transition-colors'
                    >
                      Contact Support
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='https://docubot.indiereq.com/'
                      className='hover:text-primary-600 transition-colors'
                    >
                      Report a Bug
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          {/* Legal Links */}
          <div className='space-y-2'>
            <h3
              className={getClasses({
                base: 'text-lg font-bold',
                business: 'text-foreground',
                neonLight: 'text-dark-800',
                neonDark: 'text-light-300',
              })}
            >
              Legal
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/policies/privacy'
                  className={getClasses({
                    base: 'transition-colors',
                    business: 'text-muted-foreground hover:text-primary',
                    neonLight: 'text-dark-600 hover:text-accent',
                    neonDark: 'text-light-400 hover:text-accent4',
                  })}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/policies/cookies'
                  className={getClasses({
                    base: 'transition-colors',
                    business: 'text-muted-foreground hover:text-primary',
                    neonLight: 'text-dark-600 hover:text-accent',
                    neonDark: 'text-light-400 hover:text-accent4',
                  })}
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/policies/terms'
                  className={getClasses({
                    base: 'transition-colors',
                    business: 'text-muted-foreground hover:text-primary',
                    neonLight: 'text-dark-600 hover:text-accent',
                    neonDark: 'text-light-400 hover:text-primary',
                  })}
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className='space-y-2'>
            <h3
              className={getClasses({
                base: 'text-lg font-bold',
                business: 'text-foreground',
                neonLight: 'text-dark-800',
                neonDark: 'text-light-300',
              })}
            >
              Company
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/about'
                  className={getClasses({
                    base: 'transition-colors',
                    business: 'text-muted-foreground hover:text-primary',
                    neonLight: 'text-dark-600 hover:text-accent',
                    neonDark: 'text-light-400 hover:text-primary',
                  })}
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href='/careers'
                  className={getClasses({
                    base: 'transition-colors',
                    business: 'text-muted-foreground hover:text-primary',
                    neonLight: 'text-dark-600 hover:text-accent',
                    neonDark: 'text-light-400 hover:text-primary',
                  })}
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href='/investor-relations'
                  className={getClasses({
                    base: 'transition-colors',
                    business: 'text-muted-foreground hover:text-primary',
                    neonLight: 'text-dark-600 hover:text-accent',
                    neonDark: 'text-light-400 hover:text-accent4',
                  })}
                >
                  Investor relations
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className={getClasses({
                    base: 'transition-colors',
                    business: 'text-muted-foreground hover:text-primary',
                    neonLight: 'text-dark-600 hover:text-accent',
                    neonDark: 'text-light-400 hover:text-accent4',
                  })}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription Component */}
        <div className='mt-8 w-full'>
          <NewsletterSubscribe />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
