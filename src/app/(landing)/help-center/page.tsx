'use client';

import React from 'react';
import Footer from '@/components/Global/Footer';
import { Book, FileQuestion, Users, MessageCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useThemeClasses } from '@/components/Global/ThemeAwareWrapper';

const HelpCenterPage: React.FC = () => {
  const { getClasses } = useThemeClasses();

  const helpCategories = [
    {
      title: 'User Guide',
      icon: Book,
      description: 'Learn how to use PDF Chatter effectively',
      url: '/help-center/user-guide',
    },
    {
      title: 'FAQs',
      icon: FileQuestion,
      description: 'Find answers to commonly asked questions',
      url: '/help-center/faq',
    },
    {
      title: 'Documentation',
      icon: BookOpen,
      description: 'Browse our User Documentation',
      url: '/help-center/documentation',
    },
    {
      title: 'Contact Support',
      icon: MessageCircle,
      description: 'Get in touch with our support team',
      url: '/help-center/support',
    },
  ];

  return (
    <div
      className={getClasses({
        base: 'flex flex-col items-center overflow-scroll overflow-x-hidden',
        business: 'bg-background',
        neonLight: 'bg-gradient-to-br from-accent2/40 to-accent/40',
        neonDark: 'from-neon2-dark-900/20 to-neon-dark-900/20 bg-gradient-to-br',
      })}
    >
      <div className='flex flex-col items-center justify-center space-y-15 p-2 lg:p-5 xl:p-12'>
        <div className='py-24 sm:py-32'>
          <div className='mx-auto max-w-4xl px-4 text-center sm:px-6'>
            <h2
              className={getClasses({
                base: 'text-base font-semibold leading-7',
                business: 'text-primary',
                neon: 'text-accent',
              })}
            >
              Help Center
            </h2>
            <p
              className={getClasses({
                base: 'mt-2 text-4xl font-bold tracking-tight',
                business: 'text-foreground',
                neonLight: 'text-dark-800',
                neonDark: 'text-light-300',
              })}
            >
              How can we assist you?
            </p>
          </div>
          <div className='mx-auto mt-12 max-w-5xl px-4 sm:px-6'>
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2'>
              {helpCategories.map((category, index) => (
                <Link
                  key={index}
                  href={`${category.url}`}
                  className={getClasses({
                    base: 'rounded-lg p-8 shadow-lg ring-1 drop-shadow-md',
                    business: 'bg-card shadow-black/10 ring-border',
                    neonLight: 'bg-light-400/30 shadow-dark-900/30 ring-accent2/80',
                    neonDark: 'bg-dark-700/50 shadow-black/50 ring-accent/80',
                  })}
                >
                  <category.icon
                    className={getClasses({
                      base: 'mb-4 h-8 w-8',
                      business: 'text-primary',
                      neon: 'text-accent',
                    })}
                  />
                  <h3
                    className={getClasses({
                      base: 'mb-2 text-xl font-semibold',
                      business: 'text-foreground',
                      neonLight: 'text-dark-800',
                      neonDark: 'text-light-300',
                    })}
                  >
                    {category.title}
                  </h3>
                  <p
                    className={getClasses({
                      base: '',
                      business: 'text-muted-foreground',
                      neonLight: 'text-dark-600',
                      neonDark: 'text-light-400',
                    })}
                  >
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>
            <div className='mt-8 flex justify-center'>
              <Link
                href='https://discord.gg/mWvD5HHfTz'
                className={getClasses({
                  base: 'w-96 rounded-lg p-8 shadow-lg ring-1 drop-shadow-md',
                  business: 'bg-card shadow-black/10 ring-border',
                  neonLight: 'bg-accent2/20 shadow-dark-900/30 ring-accent2/80',
                  neonDark: 'bg-accent2/30 shadow-black/50 ring-accent2/80',
                })}
              >
                <Users
                  className={getClasses({
                    base: 'mb-4 h-8 w-8',
                    business: 'text-primary',
                    neon: 'text-accent2',
                  })}
                />
                <h3
                  className={getClasses({
                    base: 'mb-2 text-xl font-semibold',
                    business: 'text-foreground',
                    neonLight: 'text-dark-800',
                    neonDark: 'text-light-300',
                  })}
                >
                  Discord Community
                </h3>
                <p
                  className={getClasses({
                    base: '',
                    business: 'text-muted-foreground',
                    neonLight: 'text-dark-600',
                    neonDark: 'text-light-400',
                  })}
                >
                  Connect with other users and share tips
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HelpCenterPage;
