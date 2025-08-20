'use client';

// app/page.tsx or app/landing-page/page.tsx (depending on your routing preference)
import React, { useState, useEffect } from 'react';
import FeatureCards from '@/components/Cards/FeatureCards';
import Footer from '@/components/Global/Footer';
import { Button } from '@/components/ui/button';
import { useThemeClasses } from '@/components/Global/ThemeAwareWrapper';
import {
  ChevronRight,
  Rocket,
  ChevronLeft,
  Quote,
  Star,
  Puzzle,
  Zap,
  Brain,
  MessageSquare,
  FileText,
  BookOpen,
  Search,
  Clock,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import TestimonialsCarousel from '@/components/Landing/Testimonials';

const LandingPage = () => {
  const { getClasses } = useThemeClasses();

  return (
    <div
      className={getClasses({
        base: 'flex flex-col items-center overflow-x-auto',
        business: 'bg-background',
        neon: 'bg-gradient-to-br from-accent2/40 to-accent/40 dark:from-accent3/30 dark:to-accent4/30',
      })}
    >
      {/* Hero Section */}
      <section className='relative w-full py-12 md:py-18 md:pl-8 lg:py-24'>
        <div className='container flex max-w-[1500px] flex-col items-center justify-center space-y-4 px-4 md:px-6'>
          <div className='grid gap-3 lg:grid-cols-2 lg:gap-6 xl:gap-8'>
            <div className='flex max-w-xl flex-col justify-center space-y-4'>
              <div className='flex items-center space-x-2 overflow-hidden'>
                <div
                  className={getClasses({
                    base: 'rounded px-2 py-1 text-sm font-bold',
                    business: 'bg-primary text-primary-foreground',
                    neon: 'bg-accent text-light-100',
                  })}
                >
                  NEW
                </div>
                <div className='relative h-8 w-full overflow-hidden'>
                  <div className='animate-banner-scroll absolute w-full'>
                    <div
                      className={getClasses({
                        base: 'flex h-8 items-center whitespace-nowrap',
                        business: 'text-muted-foreground',
                        neon: 'text-dark-700 dark:text-light-300',
                      })}
                    >
                      Enhanced Document Support
                    </div>
                    <div
                      className={getClasses({
                        base: 'flex h-8 items-center whitespace-nowrap',
                        business: 'text-muted-foreground',
                        neon: 'text-dark-700 dark:text-light-300',
                      })}
                    >
                      Multi-language Support Added
                    </div>
                    <div
                      className={getClasses({
                        base: 'flex h-8 items-center whitespace-nowrap',
                        business: 'text-muted-foreground',
                        neon: 'text-dark-700 dark:text-light-300',
                      })}
                    >
                      Advanced Search Reranking
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex w-full justify-start'>
                <Link
                  href='https://www.producthunt.com/products/docubot-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-docubot&#0045;2'
                  target='_blank'
                  className='group'
                  aria-label='View DocuBot on Product Hunt'
                >
                  <div className='flex flex-col items-start gap-2 rounded-lg border border-accent2/60 bg-light-500 px-3 py-2 shadow-md transition hover:shadow-xl dark:border-accent/40 dark:bg-dark-600 sm:flex-row sm:items-center sm:gap-3 sm:py-1'>
                    <span className='whitespace-nowrap text-sm font-semibold text-accent2 dark:text-accent'>
                      Discount Code on Product Hunt
                    </span>
                    <Image
                      src='https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=996701&theme=light&t=1754161931882'
                      alt='DocuBot on Product Hunt'
                      width={200}
                      height={42}
                      className='block rounded-lg border border-accent/60 dark:hidden'
                      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))' }}
                    />
                    <Image
                      src='https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=996701&theme=dark&t=1754161931882'
                      alt='DocuBot on Product Hunt'
                      width={200}
                      height={42}
                      className='hidden rounded-lg border border-accent2/60 dark:block'
                      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.18))' }}
                    />
                  </div>
                </Link>
              </div>
              <div className='space-y-2'>
                <h1
                  className={getClasses({
                    base: 'text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl',
                    business: 'text-foreground',
                    neon: 'text-gradient-lime-violet',
                  })}
                >
                  Transform Your PDFs Into Interactive Conversations
                </h1>
                <p
                  className={getClasses({
                    base: 'max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed',
                    business: 'text-muted-foreground',
                    neon: 'text-dark-700 dark:text-light-300',
                  })}
                >
                  Upload your documents and let DocuBot answer all your questions using advanced AI
                  with RAG Re-Ranking. Get instant insights using natural language without reading
                  hundreds of pages.
                </p>
              </div>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                <Button
                  asChild
                  size='lg'
                  className={getClasses({
                    base: '',
                    business: 'bg-primary text-primary-foreground hover:bg-primary/90',
                    neon: 'bg-accent text-light-100 hover:bg-accent2',
                  })}
                >
                  <Link href='/dashboard'>
                    Try DocuBot for Free <ChevronRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  size='lg'
                  className={getClasses({
                    base: '',
                    business: 'border-border text-foreground',
                    neon: 'border-accent2 text-dark-700 dark:border-accent dark:text-light-300',
                  })}
                >
                  <Link href='#how-it-works'>See How It Works</Link>
                </Button>
              </div>
              <div className='flex items-center gap-4 text-sm'>
                <div className='flex items-center gap-1'>
                  <Star
                    className={getClasses({
                      base: 'h-4 w-4',
                      business: 'fill-primary',
                      neon: 'fill-accent',
                    })}
                  />
                  <Star
                    className={getClasses({
                      base: 'h-4 w-4',
                      business: 'fill-primary',
                      neon: 'fill-accent',
                    })}
                  />
                  <Star
                    className={getClasses({
                      base: 'h-4 w-4',
                      business: 'fill-primary',
                      neon: 'fill-accent',
                    })}
                  />
                  <Star
                    className={getClasses({
                      base: 'h-4 w-4',
                      business: 'fill-primary',
                      neon: 'fill-accent',
                    })}
                  />
                  <Star
                    className={getClasses({
                      base: 'h-4 w-4',
                      business: 'fill-primary',
                      neon: 'fill-accent',
                    })}
                  />
                </div>
                <div
                  className={getClasses({
                    base: '',
                    business: 'text-muted-foreground',
                    neon: 'text-dark-600 dark:text-light-400',
                  })}
                >
                  Trusted by thousands of users worldwide
                </div>
              </div>
            </div>
            <div className='flex items-center justify-center'>
              <Image
                src='/screenshots/Tailwind.png'
                alt='DocuBot'
                width={1200}
                height={720}
                className='flex h-auto max-w-full object-cover'
              />
            </div>
          </div>
        </div>
        {/* Curved separator */}{' '}
        <div className='absolute bottom-0 left-0 right-0 w-full overflow-hidden'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1440 64'
            className={getClasses({
              base: 'h-16 w-screen',
              business: 'fill-muted/30',
              neon: 'fill-light-400/30 dark:fill-dark-700/30',
            })}
            preserveAspectRatio='none'
            aria-hidden='true'
          >
            <path d='M0,32L60,37.3C120,43,240,53,360,53.3C480,53,600,43,720,37.3C840,32,960,32,1080,37.3C1200,43,1320,53,1380,58.7L1440,64L1440,64L1380,64C1320,64,1200,64,1080,64C960,64,840,64,720,64C600,64,480,64,360,64C240,64,120,64,60,64L0,64Z' />
          </svg>
        </div>
      </section>

      {/* Feature card section */}
      <section
        className={getClasses({
          base: 'w-full py-12 md:py-18 lg:py-24',
          business: 'bg-muted/30',
          neon: 'bg-light-500/70 dark:bg-dark-800/70',
        })}
      >
        <div className='mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8'>
          <div
            className={getClasses({
              base: 'mx-auto flex w-64 items-center justify-center rounded-lg px-3 py-1 text-sm',
              business: 'bg-primary text-primary-foreground',
              neon: 'bg-accent text-light-100',
            })}
          >
            AI-Powered Document Analysis
          </div>
          <div className='space-y-4 text-center'>
            <h2
              className={getClasses({
                base: 'text-3xl font-bold tracking-tight sm:text-4xl',
                business: 'text-foreground',
                neon: 'text-dark-800 dark:text-light-200',
              })}
            >
              Powerful Features
            </h2>
            <p
              className={getClasses({
                base: 'mx-auto mt-4 max-w-2xl text-lg',
                business: 'text-muted-foreground',
                neon: 'text-dark-700 dark:text-light-300',
              })}
            >
              Everything you need to extract knowledge from your documents
            </p>
          </div>

          <FeatureCards />
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsCarousel />

      {/* Feature Highlights */}
      <section
        id='how-it-works'
        className='w-full bg-light-500/70 py-12 dark:bg-dark-700/50 md:py-18 lg:py-24'
      >
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2'>
              <div className='inline-block rounded-lg bg-accent px-3 py-1 text-sm text-light-100'>
                AI-Powered Document Analysis
              </div>
              <h2 className='text-3xl font-bold tracking-tighter text-dark-800 dark:text-light-200 sm:text-5xl'>
                How DocuBot Works
              </h2>
              <p className='max-w-[900px] text-dark-700 dark:text-light-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Our advanced AI technology transforms static documents into interactive knowledge
                bases you can chat with
              </p>
            </div>
          </div>
          <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12'>
            <div className='flex flex-col items-center space-y-2 rounded-lg border border-accent2/60 bg-light-500/70 p-6 shadow-xl dark:border-accent/40 dark:bg-dark-700/85'>
              <Rocket className='h-12 w-12 text-accent dark:text-accent4' />
              <h3 className='text-xl font-bold text-dark-800 dark:text-light-200'>
                1. Upload & Ingest
              </h3>
              <p className='text-center text-dark-700 dark:text-light-300'>
                Securely upload your PDF documents to DocuBot. Each document is automatically
                split, parsed, and converted into vector embeddings for fast, intelligent
                retrieval.
              </p>
            </div>
            <div className='flex flex-col items-center space-y-2 rounded-lg border border-accent2/60 bg-light-500/70 p-6 shadow-xl dark:border-accent/40 dark:bg-dark-700/85'>
              <Puzzle className='h-12 w-12 text-accent2 dark:text-accent' />
              <h3 className='text-xl font-bold text-dark-800 dark:text-light-200'>
                2. RAG & Reranking
              </h3>
              <p className='text-center text-dark-700 dark:text-light-300'>
                DocuBot uses Retrieval-Augmented Generation (RAG) and Pinecone-powered results
                reranking to find the most relevant information from your documents.
              </p>
            </div>
            <div className='flex flex-col items-center space-y-2 rounded-lg border border-accent2/60 bg-light-500/70 p-6 shadow-xl dark:border-accent/40 dark:bg-dark-700/85'>
              <Zap className='h-12 w-12 text-accent dark:text-accent4' />
              <h3 className='text-xl font-bold text-dark-800 dark:text-light-200'>
                3. Chat & Extract Insights
              </h3>
              <p className='text-center text-dark-700 dark:text-light-300'>
                Ask questions in natural language and receive instant, context-aware answers.
                Extract summaries, key facts, and actionable insights directly from your document
                content.
              </p>
            </div>
          </div>
          <div className='flex justify-center'>
            <Button asChild size='lg' className='bg-accent2 text-light-100 hover:bg-accent'>
              <Link href='/dashboard'>Start Using DocuBot Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Key benefits section */}
      <section className='w-full bg-light-200/30 py-12 dark:bg-dark-900/30 md:py-18 lg:py-24'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-16 text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-dark-800 dark:text-light-200 sm:text-4xl'>
              Why Choose DocuBot?
            </h2>
          </div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {[
              {
                icon: <Clock className='h-8 w-8 text-accent2 dark:text-accent' />,
                title: 'Save Time',
                description: 'Extract key information in seconds instead of hours of reading.',
              },
              {
                icon: <Search className='h-8 w-8 text-accent2 dark:text-accent' />,
                title: 'Find Exact Answers',
                description: 'Get precise answers to your questions directly from your documents.',
              },
              {
                icon: <Brain className='h-8 w-8 text-accent2 dark:text-accent' />,
                title: 'AI-Powered Insights',
                description: 'Discover connections and insights you might have missed.',
              },
              {
                icon: <BookOpen className='h-8 w-8 text-accent2 dark:text-accent' />,
                title: 'Handle Multiple Documents',
                description: 'Upload and analyze multiple documents with ease.',
              },
              {
                icon: <MessageSquare className='h-8 w-8 text-accent2 dark:text-accent' />,
                title: 'Natural Conversations',
                description: 'Chat with your documents using natural language questions.',
              },
              {
                icon: <FileText className='h-8 w-8 text-accent2 dark:text-accent' />,
                title: 'Secure & Private',
                description: 'Your documents are encrypted and securely stored.',
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className='flex items-start space-x-4 rounded-lg border border-accent2/10 bg-light-100/70 p-6 shadow transition-all hover:bg-light-200/80 hover:shadow-md dark:border-accent/10 dark:bg-dark-700/70 dark:hover:bg-dark-600/80'
              >
                <div className='mt-1 flex-shrink-0'>{benefit.icon}</div>
                <div>
                  <h3 className='text-lg font-bold text-dark-800 dark:text-light-200'>
                    {benefit.title}
                  </h3>
                  <p className='mt-2 text-dark-700 dark:text-light-300'>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className={getClasses({
          base: 'w-full py-12 md:py-18 lg:py-24',
          business: 'bg-muted/50',
          neon: 'bg-gradient-to-r from-accent/20 to-accent2/20 dark:from-accent3/20 dark:to-accent4/20',
        })}
      >
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2'>
              <h2
                className={getClasses({
                  base: 'text-3xl font-bold tracking-tighter sm:text-5xl',
                  business: 'text-foreground',
                  neon: 'text-dark-800 dark:text-light-200',
                })}
              >
                Ready to Transform Your Document Experience?
              </h2>
              <p
                className={getClasses({
                  base: 'max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed',
                  business: 'text-muted-foreground',
                  neon: 'text-dark-700 dark:text-light-300',
                })}
              >
                Join thousands of professionals who are saving time and gaining insights with
                DocuBot
              </p>
            </div>
            <div className='flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
              <Button
                asChild
                size='lg'
                className={getClasses({
                  base: 'w-full sm:w-auto',
                  business: 'bg-primary text-primary-foreground hover:bg-primary/90',
                  neon: 'bg-accent text-light-100 hover:bg-accent2',
                })}
              >
                <Link href='/dashboard'>Try DocuBot for Free</Link>
              </Button>
              <Button
                asChild
                variant='outline'
                size='lg'
                className={getClasses({
                  base: 'w-full sm:w-auto',
                  business: 'border-border text-foreground',
                  neon: 'border-accent2 text-dark-700 dark:border-accent dark:text-light-300',
                })}
              >
                <Link href='/pricing'>View Pricing</Link>
              </Button>
            </div>
            <p
              className={getClasses({
                base: 'text-sm',
                business: 'text-muted-foreground',
                neon: 'text-dark-600 dark:text-light-400',
              })}
            >
              No credit card required. Start with our free plan today.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;
