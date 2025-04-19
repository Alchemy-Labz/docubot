import React from 'react';
import Footer from '@/components/Global/Footer';
import { Book, FileQuestion, Users, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const HelpCenterPage: React.FC = () => {
  const helpCategories = [
    {
      title: 'User Guide',
      icon: Book,
      description: 'Learn how to use PDF Chatter effectively',
      url: 'user-guide',
    },
    {
      title: 'FAQs',
      icon: FileQuestion,
      description: 'Find answers to commonly asked questions',
      url: 'faq',
    },
    {
      title: 'Discord Community',
      icon: Users,
      description: 'Connect with other users and share tips',
      url: 'https://discord.gg/mWvD5HHfTz',
    },
    {
      title: 'Contact Support',
      icon: MessageCircle,
      description: 'Get in touch with our support team',
      url: 'support',
    },
  ];

  return (
    <div className='flex flex-col items-center overflow-scroll overflow-x-hidden bg-gradient-to-br from-accent2/40 to-accent/40 dark:from-accent3/30 dark:to-accent4/30'>
      <div className='flex flex-col items-center justify-center space-y-15 p-2 lg:p-5 xl:p-12'>
        <div className='py-24 sm:py-32'>
          <div className='mx-auto max-w-4xl px-4 text-center sm:px-6'>
            <h2 className='text-base font-semibold leading-7 text-accent'>Help Center</h2>
            <p className='mt-2 text-4xl font-bold tracking-tight text-dark-800 dark:text-light-300'>
              How can we assist you?
            </p>
          </div>
          <div className='mx-auto mt-12 max-w-5xl px-4 sm:px-6'>
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2'>
              {helpCategories.map((category, index) => (
                <Link
                  key={index}
                  href={`${category.url}`}
                  className='rounded-lg bg-light-400/30 p-8 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'
                >
                  <category.icon className='mb-4 h-8 w-8 text-accent' />
                  <h3 className='mb-2 text-xl font-semibold text-dark-800 dark:text-light-300'>
                    {category.title}
                  </h3>
                  <p className='text-dark-600 dark:text-light-400'>{category.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HelpCenterPage;
