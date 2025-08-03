// app/about/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Code,
  Lightbulb,
  Rocket,
  BarChart4,
  Clock,
  Users,
  Shield,
  Award,
  MessageSquare,
  Brain,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Global/Footer';

const AboutPage: React.FC = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className='flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-br from-accent2/20 to-accent/20 dark:from-accent3/20 dark:to-accent4/20'>
      {/* Hero section */}
      <section className='relative'>
        <div className='mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32'>
          <motion.div className='text-center' initial='hidden' animate='visible' variants={fadeIn}>
            <h1 className='text-4xl font-extrabold tracking-tight text-dark-800 dark:text-light-300 sm:text-5xl lg:text-6xl'>
              Our Mission is to <span className='text-accent2 dark:text-accent'>Transform</span>
              <br />
              Document Interaction
            </h1>
            <p className='mx-auto mt-6 max-w-2xl text-xl text-dark-600 dark:text-light-400'>
              Empowering professionals to extract knowledge and insights from documents with
              unprecedented speed and accuracy
            </p>
          </motion.div>

          <motion.div
            className='relative mt-20'
            initial='hidden'
            animate='visible'
            variants={fadeIn}
          >
            <div className='relative overflow-hidden rounded-2xl shadow-2xl'>
              <Image
                src='/screenshots/Markdown Chat.png'
                alt='DocuBot interface'
                width={1600}
                height={800}
                className='w-full object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-dark-900/40 to-transparent' />
            </div>
          </motion.div>
        </div>
        {/* Curved separator */}
        {/* Curved separator */}{' '}
        <div className='absolute bottom-0 left-0 right-0 w-full overflow-hidden'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1440 64'
            className='h-16 w-screen fill-light-400/30 dark:fill-dark-700/30'
            preserveAspectRatio='none'
            aria-hidden='true'
          >
            <path d='M0,32L60,37.3C120,43,240,53,360,53.3C480,53,600,43,720,37.3C840,32,960,32,1080,37.3C1200,43,1320,53,1380,58.7L1440,64L1440,64L1380,64C1320,64,1200,64,1080,64C960,64,840,64,720,64C600,64,480,64,360,64C240,64,120,64,60,64L0,64Z' />
          </svg>
        </div>
      </section>

      {/* Our Story section */}
      <section className='bg-light-400/30 py-24 dark:bg-dark-700/30'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='grid items-center gap-12 lg:grid-cols-2'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <h2 className='text-3xl font-bold tracking-tight text-dark-800 dark:text-light-300 sm:text-4xl'>
                The DocuBot Story
              </h2>
              <p className='mt-6 text-lg text-dark-600 dark:text-light-400'>
                DocuBot was born during the University of Code AI SaaS Challenge, where it secured
                an impressive 2nd place among 4,000 contestants. Developed in just 3 days, DocuBot
                showcases the power of rapid innovation and expertise in AI and SaaS development.
              </p>
              <p className='mt-4 text-lg text-dark-600 dark:text-light-400'>
                What started as a challenge project has evolved into a powerful tool used by
                professionals across industries to transform how they interact with documents and
                extract insights from information.
              </p>
              <p className='mt-4 text-lg text-dark-600 dark:text-light-400'>
                Our team of AI specialists and software engineers continues to refine and expand
                DocuBot&apos;s capabilities, guided by user feedback and the latest advancements in
                artificial intelligence.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className='relative h-96 lg:h-auto'>
              <div className='absolute inset-0 rotate-3 transform rounded-2xl bg-gradient-to-br from-accent2/30 to-accent/30 dark:from-accent3/20 dark:to-accent4/20' />
              <div className='absolute inset-0 -rotate-3 transform rounded-2xl bg-gradient-to-tr from-accent/30 to-accent2/30 dark:from-accent4/20 dark:to-accent3/20' />
              <div className='relative flex h-full items-center justify-center p-6'>
                <div className='rounded-xl bg-light-100/90 p-8 shadow-xl dark:bg-dark-700/90'>
                  <div className='flex justify-center'>
                    <div className='flex h-20 w-20 items-center justify-center rounded-full bg-accent2/10 dark:bg-accent/10'>
                      <Trophy className='h-10 w-10 text-accent2 dark:text-accent' />
                    </div>
                  </div>
                  <h3 className='mt-6 text-center text-xl font-bold text-dark-800 dark:text-light-300'>
                    Recognition & Achievements
                  </h3>
                  <ul className='mt-4 space-y-3'>
                    <li className='flex items-start'>
                      <Award className='mt-1 h-5 w-5 flex-shrink-0 text-accent2 dark:text-accent' />
                      <span className='ml-3 text-dark-600 dark:text-light-400'>
                        2nd place in the University of Code AI SaaS Challenge
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <Users className='mt-1 h-5 w-5 flex-shrink-0 text-accent2 dark:text-accent' />
                      <span className='ml-3 text-dark-600 dark:text-light-400'>
                        Recognized as the most helpful participant for assisting fellow developers
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <Rocket className='mt-1 h-5 w-5 flex-shrink-0 text-accent2 dark:text-accent' />
                      <span className='ml-3 text-dark-600 dark:text-light-400'>
                        Completed the entire project in just 3 days
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <Brain className='mt-1 h-5 w-5 flex-shrink-0 text-accent2 dark:text-accent' />
                      <span className='ml-3 text-dark-600 dark:text-light-400'>
                        Pioneered vector-based document analysis for AI chat
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Technical innovation section */}
      <section className='bg-light-500/70 py-24 dark:bg-dark-800/70'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='mb-16 text-center'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className='text-3xl font-bold tracking-tight text-dark-800 dark:text-light-300 sm:text-4xl'>
              Technical Innovation
            </h2>
            <p className='mx-auto mt-4 max-w-2xl text-lg text-dark-600 dark:text-light-400'>
              DocuBot leverages cutting-edge AI technology to make document interaction intuitive
              and powerful
            </p>
          </motion.div>

          <motion.div
            className='grid gap-8 md:grid-cols-3'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                icon: <Brain className='h-10 w-10 text-accent2 dark:text-accent' />,
                title: 'Vector Embeddings',
                description:
                  'Documents are transformed into mathematical vectors that capture semantic meaning, enabling contextual understanding of your questions.',
              },
              {
                icon: <MessageSquare className='h-10 w-10 text-accent2 dark:text-accent' />,
                title: 'Natural Language Processing',
                description:
                  'Advanced language models allow you to interact with documents using conversational questions rather than rigid search terms.',
              },
              {
                icon: <Code className='h-10 w-10 text-accent2 dark:text-accent' />,
                title: 'RAG Architecture',
                description:
                  'Our Retrieval Augmented Generation system combines the power of large language models with precise information retrieval.',
              },
              {
                icon: <BarChart4 className='h-10 w-10 text-accent2 dark:text-accent' />,
                title: 'Document Analytics',
                description:
                  'Gain insights about your documents with automated analysis of key topics, entities, and relationships.',
              },
              {
                icon: <Shield className='h-10 w-10 text-accent2 dark:text-accent' />,
                title: 'Secure Processing',
                description:
                  'End-to-end encryption and secure cloud infrastructure ensure your documents are protected at every step.',
              },
              {
                icon: <Clock className='h-10 w-10 text-accent2 dark:text-accent' />,
                title: 'Real-time Responses',
                description:
                  'Get immediate answers to your questions with optimized processing that delivers results in seconds.',
              },
            ].map((tech, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className='rounded-lg border border-accent2/20 bg-light-100/80 p-6 shadow-lg transition-all hover:shadow-xl dark:border-accent/20 dark:bg-dark-700/80'
              >
                <div className='mb-4'>{tech.icon}</div>
                <h3 className='text-xl font-bold text-dark-800 dark:text-light-300'>
                  {tech.title}
                </h3>
                <p className='mt-2 text-dark-600 dark:text-light-400'>{tech.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Team section */}
      <section className='bg-light-200/30 py-24 dark:bg-dark-900/30'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='mb-16 text-center'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className='text-3xl font-bold tracking-tight text-dark-800 dark:text-light-300 sm:text-4xl'>
              Meet the Team
            </h2>
            <p className='mx-auto mt-4 max-w-2xl text-lg text-dark-600 dark:text-light-400'>
              DocuBot was created by a team of passionate AI specialists and developers
            </p>
          </motion.div>

          <motion.div
            className='grid gap-x-12 gap-y-16 lg:grid-cols-3'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className='text-center'>
              <div className='mx-auto h-40 w-40 overflow-hidden rounded-full shadow-lg'>
                <Image
                  src='/logo.png'
                  alt='Steven Watkins'
                  width={160}
                  height={160}
                  className='h-full w-full bg-accent2/10 object-cover p-4 dark:bg-accent/10'
                />
              </div>
              <h3 className='mt-6 text-xl font-bold text-dark-800 dark:text-light-300'>
                Steven Watkins
              </h3>
              <p className='text-accent2 dark:text-accent'>Founder & Chief Architect</p>
              <p className='mt-2 text-dark-600 dark:text-light-400'>
                Also known as Digital Alchemyst, Steven is a Sr. Next.js Architect and AI
                Integration Specialist with a passion for cutting-edge technology.
              </p>
              <div className='mt-4 flex justify-center space-x-3'>
                <a
                  href='https://twitter.com/DigitlAlchemyst'
                  className='text-dark-500 hover:text-accent2 dark:text-light-500 dark:hover:text-accent'
                >
                  <span className='sr-only'>Twitter</span>
                  <svg
                    className='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                  >
                    <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
                  </svg>
                </a>
                <a
                  href='https://github.com/Digitl-Alchemyst'
                  className='text-dark-500 hover:text-accent2 dark:text-light-500 dark:hover:text-accent'
                >
                  <span className='sr-only'>GitHub</span>
                  <svg
                    className='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                  >
                    <path
                      fillRule='evenodd'
                      d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                      clipRule='evenodd'
                    />
                  </svg>
                </a>
                <a
                  href='https://www.linkedin.com/in/steven-watkins-02105b155/'
                  className='text-dark-500 hover:text-accent2 dark:text-light-500 dark:hover:text-accent'
                >
                  <span className='sr-only'>LinkedIn</span>
                  <svg
                    className='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                  >
                    <path
                      fillRule='evenodd'
                      d='M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z'
                      clipRule='evenodd'
                    />
                  </svg>
                </a>
                <a
                  href='https://www.youtube.com/@digitalalchemyst'
                  className='text-dark-500 hover:text-accent2 dark:text-light-500 dark:hover:text-accent'
                >
                  <span className='sr-only'>YouTube</span>
                  <svg
                    className='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                  >
                    <path
                      fillRule='evenodd'
                      d='M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z'
                      clipRule='evenodd'
                    />
                  </svg>
                </a>{' '}
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className='col-span-2'>
              <div className='prose-lg prose max-w-none text-dark-600 dark:text-light-400'>
                <h3 className='mb-4 text-2xl font-bold text-dark-800 dark:text-light-300'>
                  About Alchemy Labz
                </h3>
                <p>
                  DocuBot is owned and operated by Alchemy Labz, a company at the forefront of
                  AI-powered solutions. We are committed to developing innovative tools that
                  enhance productivity and streamline information processing for users across
                  various industries.
                </p>
                <p className='mt-4'>
                  Our team combines expertise in artificial intelligence, software development, and
                  user experience design to create tools that are both powerful and intuitive. We
                  believe that AI should augment human capabilities, not replace them, and our
                  products reflect this philosophy.
                </p>
                <p className='mt-4'>
                  At Alchemy Labz, we&apos;re passionate about helping professionals extract
                  maximum value from their documents and data. We&apos;re constantly exploring new
                  ways to apply AI technology to solve real-world problems and improve workflows.
                </p>
                <div className='mt-8'>
                  <Button
                    asChild
                    className='bg-accent2 hover:bg-accent2/90 dark:bg-accent dark:hover:bg-accent/90'
                  >
                    <Link
                      href='https://www.alchemyst.digital/'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Learn more about Alchemy Labz <ArrowRight className='ml-2 h-4 w-4' />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values section */}
      <section className='bg-light-500/70 py-24 dark:bg-dark-800/70'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='mb-16 text-center'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className='text-3xl font-bold tracking-tight text-dark-800 dark:text-light-300 sm:text-4xl'>
              Our Values
            </h2>
            <p className='mx-auto mt-4 max-w-2xl text-lg text-dark-600 dark:text-light-400'>
              The principles that guide how we build and improve DocuBot
            </p>
          </motion.div>

          <motion.div
            className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                icon: <Rocket className='h-10 w-10 text-accent2 dark:text-accent' />,
                title: 'Innovation',
                description:
                  'We constantly explore new technologies and approaches to improve document interaction.',
              },
              {
                icon: <Users className='h-10 w-10 text-accent2 dark:text-accent' />,
                title: 'User-Centered',
                description:
                  "Every feature we build starts with understanding our users' needs and workflows.",
              },
              {
                icon: <Shield className='h-10 w-10 text-accent2 dark:text-accent' />,
                title: 'Privacy & Security',
                description:
                  'We prioritize the security of your documents and data in everything we do.',
              },
              {
                icon: <Lightbulb className='h-10 w-10 text-accent2 dark:text-accent' />,
                title: 'Transparency',
                description:
                  'We believe in being clear about what our technology can and cannot do.',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className='rounded-lg border border-accent2/20 bg-light-100/80 p-6 text-center shadow-lg transition-all hover:shadow-xl dark:border-accent/20 dark:bg-dark-700/80'
              >
                <div className='mb-4 flex justify-center'>{value.icon}</div>
                <h3 className='text-xl font-bold text-dark-800 dark:text-light-300'>
                  {value.title}
                </h3>
                <p className='mt-2 text-dark-600 dark:text-light-400'>{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA section */}
      <section className='bg-gradient-to-br from-accent2/40 to-accent/40 py-24 dark:from-accent3/30 dark:to-accent4/30'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='mx-auto max-w-2xl text-center'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className='text-3xl font-bold tracking-tight text-dark-800 dark:text-light-300 sm:text-4xl'>
              Ready to experience DocuBot?
            </h2>
            <p className='mt-4 text-lg text-dark-600 dark:text-light-400'>
              Join thousands of professionals who are transforming how they work with documents.
            </p>
            <div className='mt-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0'>
              <Button
                asChild
                size='lg'
                className='bg-accent2 px-8 hover:bg-accent2/90 dark:bg-accent dark:hover:bg-accent/90'
              >
                <Link href='/sign-up'>Get Started for Free</Link>
              </Button>
              <Button
                asChild
                variant='outline'
                size='lg'
                className='border-accent2 px-8 dark:border-accent'
              >
                <Link href='/pricing'>View Pricing Plans</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Custom Trophy icon component
const Trophy = ({ className }: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <path d='M6 9H4.5a2.5 2.5 0 0 1 0-5H6' />
    <path d='M18 9h1.5a2.5 2.5 0 0 0 0-5H18' />
    <path d='M4 22h16' />
    <path d='M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22' />
    <path d='M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22' />
    <path d='M18 2H6v7a6 6 0 0 0 12 0V2Z' />
  </svg>
);

export default AboutPage;
