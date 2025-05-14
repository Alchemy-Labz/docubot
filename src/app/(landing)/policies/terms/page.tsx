import React from 'react';
import Footer from '@/components/Global/Footer';

const TermsAndConditionsPage: React.FC = () => {
  return (
    <div className='flex flex-col items-center overflow-scroll overflow-x-hidden bg-gradient-to-br from-accent2/40 to-accent/40 dark:from-accent3/30 dark:to-accent4/30'>
      <div className='flex flex-col items-center justify-center space-y-15 p-2 lg:p-5 xl:p-12'>
        <div className='py-24 sm:py-32'>
          <div className='mx-auto max-w-4xl px-4 text-center sm:px-6'>
            <h2 className='text-base font-semibold leading-7 text-accent'>Terms and Conditions</h2>
            <p className='mt-2 text-4xl font-bold tracking-tight text-dark-800 dark:text-light-300'>
              Our Agreement with You
            </p>
          </div>
          <div className='mx-auto mt-12 max-w-3xl px-4 sm:px-6'>
            <div className='rounded-lg bg-light-400/30 p-8 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
              <p className='mb-4 text-dark-600 dark:text-light-400'>
                Welcome to PDF Chatter. These Terms and Conditions govern your use of our website
                and services. By accessing or using PDF Chatter, you agree to be bound by these
                Terms.
              </p>
              <h3 className='mb-2 text-xl font-semibold text-dark-800 dark:text-light-300'>
                1. Use of Service
              </h3>
              <p className='mb-4 text-dark-600 dark:text-light-400'>
                PDF Chatter provides an AI-powered tool for interacting with PDF documents. You
                agree to use this service only for lawful purposes and in accordance with these
                Terms.
              </p>
              <h3 className='mb-2 text-xl font-semibold text-dark-800 dark:text-light-300'>
                2. User Accounts
              </h3>
              <p className='mb-4 text-dark-600 dark:text-light-400'>
                To access certain features of our service, you may be required to create an
                account. You are responsible for maintaining the confidentiality of your account
                information and for all activities that occur under your account.
              </p>
              <h3 className='mb-2 text-xl font-semibold text-dark-800 dark:text-light-300'>
                3. Intellectual Property
              </h3>
              <p className='mb-4 text-dark-600 dark:text-light-400'>
                All content on PDF Chatter, including text, graphics, logos, images, and software,
                is the property of PDF Chatter or its licensors and is protected by copyright and
                other intellectual property laws.
              </p>
              <h3 className='mb-2 text-xl font-semibold text-dark-800 dark:text-light-300'>
                4. Limitation of Liability
              </h3>
              <p className='mb-4 text-dark-600 dark:text-light-400'>
                PDF Chatter and its affiliates, employees, agents, and licensors shall not be
                liable for any direct, indirect, incidental, special, or consequential damages
                arising out of or in any way connected with the use of or inability to use PDF
                Chatter.
              </p>
              <h3 className='mb-2 text-xl font-semibold text-dark-800 dark:text-light-300'>
                5. Changes to Terms
              </h3>
              <p className='mb-4 text-dark-600 dark:text-light-400'>
                We may update these Terms from time to time. Any changes will be effective
                immediately upon posting on this page.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditionsPage;
