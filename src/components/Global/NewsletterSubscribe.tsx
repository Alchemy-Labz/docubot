'use client';
import { useState } from 'react';

const NewsletterSubscribe = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your subscription logic here
    console.log('Subscribed with email:', email);
  };

  return (
    <div className='w-full max-w-4xl px-6 py-4 text-dark-700 dark:text-light-600'>
      <h3 className='mb-2 text-lg font-bold'>Subscribe to our Newsletter</h3>
      <form onSubmit={handleSubmit} className='flex flex-col items-center space-x-4 sm:flex-row'>
        <input
          type='email'
          className='flex-grow rounded-md border border-gray-300 p-2 dark:border-gray-700'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type='submit'
          className='rounded-md bg-accent2 px-4 py-2 text-light-300 hover:bg-accent'
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterSubscribe;
