import React from 'react';
import Footer from '@/components/Global/Footer';
import { CalendarCheck, ThumbsUp, FlaskConical, Sparkles, GitBranch, Clock } from 'lucide-react';

type RoadmapItem = {
  title: string;
  description: string;
  timeframe: string;
  status: 'planned' | 'in-progress' | 'completed';
  icon: React.ReactNode;
};

const RoadmapPage = () => {
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
        return 'bg-accent2 dark:bg-accent';
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
    <div className='flex flex-col items-center overflow-x-hidden bg-gradient-to-br from-accent2/40 to-accent/40 dark:from-accent3/30 dark:to-accent4/30'>
      <div className='container mx-auto px-4 py-16 md:px-6 lg:py-24'>
        <div className='mx-auto max-w-4xl text-center'>
          <h1 className='text-4xl font-bold tracking-tight text-dark-800 dark:text-light-200 sm:text-5xl'>
            DocuBot Product Roadmap
          </h1>
          <p className='mt-4 text-lg text-dark-700 dark:text-light-300'>
            Our vision for the future of DocuBot and upcoming features we&apos;re working on
          </p>
        </div>

        {/* Timeline */}
        <div className='relative mx-auto mt-16 max-w-5xl'>
          {/* Timeline Line */}
          <div className='absolute left-0 top-0 hidden h-full w-1 border-l-2 border-accent2/50 dark:border-accent/50 lg:left-1/2 lg:-ml-px lg:block' />

          {/* Roadmap Items */}
          <div className='space-y-12'>
            {roadmapItems.map((item, index) => (
              <div key={index} className='relative flex flex-col lg:flex-row'>
                {/* Date for desktop (left side on even, right side on odd) */}
                <div
                  className={`w-full pb-10 lg:w-1/2 lg:pb-0 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:order-1 lg:pl-8'}`}
                >
                  <div
                    className={`hidden h-8 text-right font-semibold text-dark-600 dark:text-light-400 lg:block ${
                      index % 2 === 0 ? 'text-right' : 'text-left'
                    }`}
                  >
                    {item.timeframe}
                  </div>
                </div>

                {/* Timeline dot */}
                <div className='absolute left-0 top-0 hidden h-6 w-6 rounded-full border-4 border-light-200 bg-accent2 dark:border-dark-600 dark:bg-accent lg:left-1/2 lg:-ml-3 lg:block' />

                {/* Content (right side on even, left side on odd) */}
                <div
                  className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:order-1 lg:pl-8' : 'lg:pr-8'}`}
                >
                  <div className='rounded-lg border border-accent2/60 bg-light-500/70 p-6 shadow-xl dark:border-accent/40 dark:bg-dark-700/85'>
                    {/* Mobile timeframe */}
                    <div className='mb-2 font-semibold text-dark-600 dark:text-light-400 lg:hidden'>
                      {item.timeframe}
                    </div>

                    <div className='flex items-start space-x-4'>
                      <div className='flex-shrink-0'>{item.icon}</div>
                      <div className='flex-1'>
                        <div className='flex flex-wrap items-center justify-between gap-2'>
                          <h3 className='text-xl font-bold text-dark-800 dark:text-light-200'>
                            {item.title}
                          </h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${getStatusClass(item.status)}`}
                          >
                            {getStatusText(item.status)}
                          </span>
                        </div>
                        <p className='mt-2 text-dark-700 dark:text-light-300'>
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
