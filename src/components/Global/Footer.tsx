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
              </li>
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
                  Cookie policy
                </Link>
              </li>
              <li>
                <Link href='/policies/terms' className='hover:text-primary-600 transition-colors'>
                  Terms of service
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
                <Link href='/contact' className='hover:text-primary-600 transition-colors'>
                  Contact Us
                </Link>
              </li>
              {/* <li>
              <Link href='/jobs'>Jobs</Link>
              </li>
              <li>
              <Link href='/investor-relations'>Investor relations</Link>
              </li> */}
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
