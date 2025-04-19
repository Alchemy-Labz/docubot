import React from 'react';
import Footer from '@/components/Global/Footer';

const ContactPage: React.FC = () => {
  return (
    <div className='flex flex-col items-center overflow-scroll overflow-x-hidden bg-gradient-to-br from-accent2/40 to-accent/40 dark:from-accent3/30 dark:to-accent4/30'>
      <div className='flex flex-col items-center justify-center space-y-15 p-2 lg:p-5 xl:p-12'>
        <div className='py-24 sm:py-32'>
          <div className='mx-auto max-w-4xl px-4 text-center sm:px-6'>
            <h2 className='text-base font-semibold leading-7 text-accent'>Contact Us</h2>
            <p className='mt-2 text-4xl font-bold tracking-tight text-dark-800 dark:text-light-300'>
              Get in Touch
            </p>
          </div>
          <div className='mx-auto mt-12 max-w-3xl px-4 sm:px-6'>
            <div className='rounded-lg bg-light-400/30 p-8 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
              <form className='space-y-6'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-dark-700 dark:text-light-300'
                  >
                    Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    className='mt-1 block w-full rounded-md border-accent2 shadow-sm focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50'
                  />
                </div>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-dark-700 dark:text-light-300'
                  >
                    Email
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    className='mt-1 block w-full rounded-md border-accent2 shadow-sm focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50'
                  />
                </div>
                <div>
                  <label
                    htmlFor='message'
                    className='block text-sm font-medium text-dark-700 dark:text-light-300'
                  >
                    Message
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    rows={4}
                    className='mt-1 block w-full rounded-md border-accent2 shadow-sm focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50'
                  />
                </div>
                <div>
                  <button
                    type='submit'
                    className='w-full rounded-md bg-accent px-4 py-2 text-white hover:bg-accent2 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50'
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
