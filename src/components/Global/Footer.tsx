import React from 'react';
import Link from 'next/link';
import NewsletterSubscribe from './NewsletterSubscribe';
import SocialLinks from './SocialLinks';

const Footer = () => {
  return (
    <footer className='flex w-full justify-center overflow-hidden bg-light-500/30 py-6 text-dark-700 shadow-black inner-glow-light-60 dark:bg-dark-700/50 dark:text-light-600 dark:inner-glow-dark-70'>
      {/* Social Media Icons */}
      <div className='bottom-0 flex w-full max-w-7xl flex-col items-center justify-start px-4'>
        <div className='dark:text-light-60 mb-3 flex w-full items-center justify-start border-b-2 border-light-500/50 pb-1 text-dark-700 dark:border-dark-700'>
          <SocialLinks />
        </div>
        <div className='container mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
          {/* Company Links */}
          <div className='space-y-2'>
            <h3 className='text-lg font-bold'>DocuBot</h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='https://docubot.indiereq.com/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='border-primary-600 text-primary-700 hover:bg-primary-50 hover:border-primary-700 dark:text-primary-400 dark:border-primary-400 inline-flex items-center gap-2 rounded-md border bg-white px-3 py-1 text-sm font-medium shadow-sm transition-colors dark:bg-dark-800'
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
                      fill='#fff'
                      className='dark:fill-black'
                    />
                    <rect
                      x='11'
                      y='18'
                      width='2'
                      height='2'
                      rx='1'
                      fill='#fff'
                      className='dark:fill-black'
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

          {/* Support Links */}
          <div className='space-y-2'>
            <h3 className='text-lg font-bold'>Support</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/help-center' className='hover:text-primary-600 transition-colors'>
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
            <h3 className='text-lg font-bold'>Legal</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/policies/privacy'
                  className='hover:text-primary-600 transition-colors'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/policies/cookies'
                  className='hover:text-primary-600 transition-colors'
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href='/policies/terms' className='hover:text-primary-600 transition-colors'>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className='space-y-2'>
            <h3 className='text-lg font-bold'>Company</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/about' className='hover:text-primary-600 transition-colors'>
                  About us
                </Link>
              </li>
              <li>
                <Link href='/jobs'>Jobs</Link>
              </li>
              <li>
                <Link href='/investor-relations'>Investor relations</Link>
              </li>
              <li>
                <Link href='/contact' className='hover:text-primary-600 transition-colors'>
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
