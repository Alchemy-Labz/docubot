import React from 'react';
import Link from 'next/link';
import NewsletterSubscribe from './NewsletterSubscribe';
import SocialLinks from './SocialLinks';

const Footer = () => {
  return (
    <footer className='flex w-full justify-center overflow-hidden bg-light-500/30 py-6 text-dark-700 shadow-black inner-glow-light-60 dark:bg-dark-700/50 dark:text-light-600 dark:inner-glow-dark-70'>
      {/* Social Media Icons */}
      <div className='bottom-0 flex w-full max-w-7xl flex-col items-center justify-start'>
        <div className='dark:text-light-60 mb-3 flex w-full items-center justify-start border-b-2 border-light-500/50 pb-1 text-dark-700 dark:border-dark-700'>
          <SocialLinks />
        </div>
        <div className='container mx-auto flex flex-wrap justify-between'>
          {/* Company Links */}
          <div className='mb-4 w-full sm:w-1/2 md:w-1/4 lg:w-1/6'>
            <h3 className='mb-2 text-lg font-bold'>DocuBot</h3>
            <ul>
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
          <div className='mb-4 w-full sm:w-1/2 md:w-1/4 lg:w-1/6'>
            <h3 className='mb-2 text-lg font-bold'>Support</h3>
            <ul>
              <li>
                <Link href='/help-center'>Help center</Link>
              </li>
              <li>
                <Link href='/policies/privacy'>Privacy Policy</Link>
              </li>
              <li>
                <Link href='/policies/cookies'>Cookie policy</Link>
              </li>
              <li>
                <Link href='/policies/terms'>Terms of service</Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className='mb-4 w-full sm:w-1/2 md:w-1/4 lg:w-1/6'>
            <h3 className='mb-2 text-lg font-bold'>Company</h3>
            <ul>
              <li>
                <Link href='/about'>About us</Link>
              </li>
              <li>
                <Link href='/contact'>Contact Us</Link>
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
        <NewsletterSubscribe />
      </div>
    </footer>
  );
};

export default Footer;
