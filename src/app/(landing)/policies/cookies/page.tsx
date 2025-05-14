import React from 'react';
import Footer from '@/components/Global/Footer';

const CookiePolicyPage: React.FC = () => {
  return (
    <div className='flex flex-col items-center overflow-scroll overflow-x-hidden bg-gradient-to-br from-accent2/40 to-accent/40 dark:from-accent3/30 dark:to-accent4/30'>
      <div className='flex flex-col items-center justify-center space-y-15 p-2 lg:p-5 xl:p-12'>
        <div className='py-24 sm:py-32'>
          <div className='mx-auto max-w-4xl px-4 text-center sm:px-6'>
            <h2 className='text-base font-semibold leading-7 text-accent'>Cookie Policy</h2>
            <p className='mt-2 text-4xl font-bold tracking-tight text-dark-800 dark:text-light-300'>
              Our Use of Cookies
            </p>
          </div>
          <div className='mx-auto mt-12 max-w-3xl px-4 sm:px-6'>
            <div className='rounded-lg bg-light-400/30 p-8 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
              <p className='mb-4 text-dark-600 dark:text-light-400'>
                This Cookie Policy explains how PDF Chatter (&dquo;we&dquo;, &dquo;us&dquo;, and
                &dquo;our&dquo;) uses cookies and similar technologies to recognize you when you
                visit our website. It explains what these technologies are and why we use them, as
                well as your rights to control our use of them.
              </p>
              <h3 className='mb-2 text-xl font-semibold text-dark-800 dark:text-light-300'>
                What are cookies?
              </h3>
              <p className='mb-4 text-dark-600 dark:text-light-400'>
                Cookies are small data files that are placed on your computer or mobile device when
                you visit a website. Cookies are widely used by website owners in order to make
                their websites work, or to work more efficiently, as well as to provide reporting
                information.
              </p>
              <h3 className='mb-2 text-xl font-semibold text-dark-800 dark:text-light-300'>
                How do we use cookies?
              </h3>
              <p className='mb-4 text-dark-600 dark:text-light-400'>
                We use cookies for several reasons. Some cookies are required for technical reasons
                in order for our website to operate, and we refer to these as &dquo;essential&dquo;
                or &dquo;strictly necessary&dquo; cookies. Other cookies also enable us to track
                and target the interests of our users to enhance the experience on our website.
                Third parties serve cookies through our website for advertising, analytics and
                other purposes.
              </p>
              {/* Add more sections as needed */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CookiePolicyPage;
