'use client';

import React from 'react';
import Footer from '@/components/Global/Footer';
import { CalendarCheck, ThumbsUp, FlaskConical, Sparkles, GitBranch, Clock } from 'lucide-react';
import { useThemeClasses } from '@/components/Global/ThemeAwareWrapper';

type RoadmapItem = {
  title: string;
  description: string;
  timeframe: string;
  status: 'planned' | 'in-progress' | 'completed';
  icon: React.ReactNode;
};

const RoadmapPage = () => {
  const { getClasses } = useThemeClasses();

  const roadmapItems: RoadmapItem[] = [
    {
      title: 'Multi-Language Support',
      description:
        'DocuBot will analyze and chat with documents in multiple languages, including Spanish, French, German, and Japanese.',
      timeframe: 'Q1 2025',
      status: 'completed',
      icon: <Sparkles className='h-8 w-8 text-accent2 dark:text-accent' />,
    },
    {
      title: 'Team Collaboration Features',
      description:
        'Share documents and conversations with team members, add comments, and collaborate on document analysis.',
      timeframe: 'Q2 2025',
      status: 'in-progress',
      icon: <ThumbsUp className='h-8 w-8 text-accent2 dark:text-accent' />,
    },
    {
      title: 'GitHub Repository Integration',
      description:
        'Connect DocuBot to your GitHub repositories to analyze code documentation, README files, and technical specs.',
      timeframe: 'Q3 2025',
      status: 'planned',
      icon: <GitBranch className='h-8 w-8 text-accent2 dark:text-accent' />,
    },
    {
      title: 'Advanced Analytics Dashboard',
      description:
        'Get insights into your document usage, most frequent queries, and knowledge extraction patterns.',
      timeframe: 'Q3 2025',
      status: 'planned',
      icon: <CalendarCheck className='h-8 w-8 text-accent2 dark:text-accent' />,
    },
    {
      title: 'Mobile App for iOS and Android',
      description:
        'Access DocuBot on the go with our native mobile applications for iOS and Android devices.',
      timeframe: 'Q4 2025',
      status: 'planned',
      icon: <Clock className='h-8 w-8 text-accent2 dark:text-accent' />,
    },
    {
      title: 'API Access for Developers',
      description:
        'Integrate DocuBots capabilities into your own applications with our comprehensive API.',
      timeframe: 'Q1 2026',
      status: 'planned',
      icon: <FlaskConical className='h-8 w-8 text-accent2 dark:text-accent' />,
    },
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500 dark:bg-emerald-600';
      case 'in-progress':
        return 'bg-amber-500 dark:bg-amber-600';
      case 'planned':
        return 'bg-accent2';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'planned':
        return 'Planned';
      default:
        return status;
    }
  };

  return (
    <div
      className={getClasses({
        base: 'flex flex-col items-center overflow-x-hidden',
        business: 'bg-background',
        neonLight: 'bg-gradient-to-br from-accent2/40 to-accent/40',
        neonDark: 'from-neon2-dark-900/20 to-neon-dark-900/20 bg-gradient-to-br',
      })}
    >
      <div className='container mx-auto px-4 py-16 md:px-6 lg:py-24'>
        <div className='mx-auto max-w-4xl text-center'>
          <h1
            className={getClasses({
              base: 'text-4xl font-bold tracking-tight sm:text-5xl',
              business: 'text-foreground',
              neonLight: 'text-dark-800',
              neonDark: 'text-light-200',
            })}
          >
            DocuBot Product Roadmap
          </h1>
          <p
            className={getClasses({
              base: 'mt-4 text-lg',
              business: 'text-muted-foreground',
              neonLight: 'text-dark-700',
              neonDark: 'text-light-300',
            })}
          >
            Our vision for the future of DocuBot and upcoming features we&apos;re working on
          </p>
        </div>

        {/* Timeline */}
        <div className='relative mx-auto mt-16 max-w-5xl'>
          {/* Timeline Line */}
          <div
            className={getClasses({
              base: 'absolute left-0 top-0 hidden h-full w-1 border-l-2 lg:left-1/2 lg:-ml-px lg:block',
              business: 'border-border',
              neonLight: 'border-accent2/50',
              neonDark: 'border-accent/50',
            })}
          />

          {/* Roadmap Items */}
          <div className='space-y-12'>
            {roadmapItems.map((item, index) => (
              <div key={index} className='relative flex flex-col lg:flex-row'>
                {/* Date for desktop (left side on even, right side on odd) */}
                <div
                  className={`w-full pb-10 lg:w-1/2 lg:pb-0 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:order-1 lg:pl-8'}`}
                >
                  <div
                    className={getClasses({
                      base: `hidden h-8 font-semibold lg:block ${
                        index % 2 === 0 ? 'text-right' : 'text-left'
                      }`,
                      business: 'text-muted-foreground',
                      neonLight: 'text-dark-600',
                      neonDark: 'text-light-400',
                    })}
                  >
                    {item.timeframe}
                  </div>
                </div>

                {/* Timeline dot */}
                <div
                  className={getClasses({
                    base: 'absolute left-0 top-0 hidden h-6 w-6 rounded-full border-4 lg:left-1/2 lg:-ml-3 lg:block',
                    business: 'border-border bg-primary',
                    neonLight: 'border-light-200 bg-accent2',
                    neonDark: 'border-dark-600 bg-accent',
                  })}
                />

                {/* Content (right side on even, left side on odd) */}
                <div
                  className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:order-1 lg:pl-8' : 'lg:pr-8'}`}
                >
                  <div
                    className={getClasses({
                      base: 'rounded-lg border p-6 shadow-xl',
                      business: 'border-border bg-card',
                      neonLight: 'border-accent2/60 bg-light-500/70',
                      neonDark: 'border-accent/40 bg-dark-700/85',
                    })}
                  >
                    {/* Mobile timeframe */}
                    <div
                      className={getClasses({
                        base: 'mb-2 font-semibold lg:hidden',
                        business: 'text-muted-foreground',
                        neonLight: 'text-dark-600',
                        neonDark: 'text-light-400',
                      })}
                    >
                      {item.timeframe}
                    </div>

                    <div className='flex items-start space-x-4'>
                      <div className='flex-shrink-0'>{item.icon}</div>
                      <div className='flex-1'>
                        <div className='flex flex-wrap items-center justify-between gap-2'>
                          <h3
                            className={getClasses({
                              base: 'text-xl font-bold',
                              business: 'text-foreground',
                              neonLight: 'text-dark-800',
                              neonDark: 'text-light-200',
                            })}
                          >
                            {item.title}
                          </h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${getStatusClass(item.status)}`}
                          >
                            {getStatusText(item.status)}
                          </span>
                        </div>
                        <p
                          className={getClasses({
                            base: 'mt-2',
                            business: 'text-muted-foreground',
                            neonLight: 'text-dark-700',
                            neonDark: 'text-light-300',
                          })}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Want to see more section */}
        <div className='mx-auto mt-24 max-w-3xl rounded-lg border border-accent2/60 bg-light-500/70 p-8 text-center shadow-xl dark:border-accent/40 dark:bg-dark-700/85'>
          <h2 className='text-2xl font-bold text-dark-800 dark:text-light-200'>
            Want to see a specific feature on our roadmap?
          </h2>
          <p className='mt-4 text-dark-700 dark:text-light-300'>
            We&apos;re always looking to improve DocuBot based on your feedback. If there&apos;s a
            feature you&apos;d like to see, let us know!
          </p>
          <div className='mt-6'>
            <a
              href='mailto:feedback@docubot.app'
              className='inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-light-100 transition-colors hover:bg-accent2'
            >
              Send Feature Request
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RoadmapPage;
