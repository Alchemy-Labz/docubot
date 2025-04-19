// app/page.tsx or app/landing-page/page.tsx (depending on your routing preference)
import FeatureCards from '@/components/Cards/FeatureCards';
import Footer from '@/components/Global/Footer';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Rocket,
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

// Helper components
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <polyline points='20 6 9 17 4 12' />
  </svg>
);

const PackageIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <path d='M16.5 9.4l-9-5.19' />
    <path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' />
    <polyline points='3.27 6.96 12 12.01 20.73 6.96' />
    <line x1='12' y1='22.08' x2='12' y2='12' />
  </svg>
);

const LandingPage = () => {
  return (
    <div className='flex flex-col items-center overflow-x-auto bg-gradient-to-br from-accent2/40 to-accent/40 dark:from-accent3/30 dark:to-accent4/30'>
      {/* Hero Section */}
      <section className='relative w-full py-12 md:py-24 md:pl-8 lg:py-32'>
        <div className='container flex max-w-7xl flex-col items-center justify-center space-y-4 px-4 md:px-6'>
          <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16'>
            <div className='flex flex-col justify-center space-y-4'>
              <div className='space-y-2'>
                <h1 className='text-4xl font-bold tracking-tighter text-gradient-lime-violet sm:text-5xl md:text-6xl'>
                  Transform Your PDFs Into Interactive Conversations
                </h1>
                <p className='max-w-[600px] text-dark-700 dark:text-light-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Upload your documents and let DocuBot answer all your questions using advanced
                  AI. Get instant insights without reading hundreds of pages.
                </p>
              </div>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                <Button asChild size='lg' className='bg-accent text-light-100 hover:bg-accent2'>
                  <Link href='/dashboard'>
                    Try DocuBot for Free <ChevronRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  size='lg'
                  className='border-accent2 text-dark-700 dark:border-accent dark:text-light-300'
                >
                  <Link href='#how-it-works'>See How It Works</Link>
                </Button>
              </div>
              <div className='flex items-center gap-4 text-sm'>
                <div className='flex items-center gap-1'>
                  <Star className='h-4 w-4 fill-accent' />
                  <Star className='h-4 w-4 fill-accent' />
                  <Star className='h-4 w-4 fill-accent' />
                  <Star className='h-4 w-4 fill-accent' />
                  <Star className='h-4 w-4 fill-accent' />
                </div>
                <div className='text-dark-600 dark:text-light-400'>
                  Trusted by thousands of users worldwide
                </div>
              </div>
            </div>
            <div className='flex items-center justify-center'>
              <div className='relative flex h-[350px] w-[350px] items-center justify-center rounded-full bg-gradient-to-b from-accent/20 to-accent2/20 p-4 sm:h-[375px] sm:w-[375px]'>
                <Image
                  src='/logo.png'
                  alt='DocuBot'
                  width={300}
                  height={300}
                  className='rounded-full'
                />
              </div>
            </div>
          </div>
        </div>
        {/* Curved separator */}
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

      {/* Feature Highlights */}
      <section
        id='how-it-works'
        className='w-full bg-light-500/70 py-12 dark:bg-dark-700/50 md:py-24 lg:py-32'
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
              <h3 className='text-xl font-bold text-dark-800 dark:text-light-200'>1. Upload</h3>
              <p className='text-center text-dark-700 dark:text-light-300'>
                Securely upload your PDF documents to DocuBot&apos;s platform
              </p>
            </div>
            <div className='flex flex-col items-center space-y-2 rounded-lg border border-accent2/60 bg-light-500/70 p-6 shadow-xl dark:border-accent/40 dark:bg-dark-700/85'>
              <Puzzle className='h-12 w-12 text-accent2 dark:text-accent' />
              <h3 className='text-xl font-bold text-dark-800 dark:text-light-200'>
                2. AI Analysis
              </h3>
              <p className='text-center text-dark-700 dark:text-light-300'>
                Our AI analyzes and understands your document content using vector embeddings
              </p>
            </div>
            <div className='flex flex-col items-center space-y-2 rounded-lg border border-accent2/60 bg-light-500/70 p-6 shadow-xl dark:border-accent/40 dark:bg-dark-700/85'>
              <Zap className='h-12 w-12 text-accent dark:text-accent4' />
              <h3 className='text-xl font-bold text-dark-800 dark:text-light-200'>
                3. Chat & Extract
              </h3>
              <p className='text-center text-dark-700 dark:text-light-300'>
                Ask questions and get accurate answers directly from your document content
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

      {/* Product Showcase */}
      <section className='w-full py-12 md:py-24 lg:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='grid gap-6 lg:grid-cols-2 lg:gap-12'>
            <div className='flex flex-col justify-center space-y-4'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter text-dark-800 dark:text-light-200 sm:text-4xl md:text-5xl'>
                  See DocuBot in Action
                </h2>
                <p className='max-w-[600px] text-dark-700 dark:text-light-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Upload your PDFs and start asking questions. DocuBot will analyze your documents
                  and provide accurate, context-aware answers instantly.
                </p>
              </div>
              <ul className='grid gap-2'>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent dark:text-accent4' />
                  <span className='text-dark-700 dark:text-light-300'>
                    Advanced document analysis with vector embeddings
                  </span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent dark:text-accent4' />
                  <span className='text-dark-700 dark:text-light-300'>
                    Natural language conversation with your documents
                  </span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent dark:text-accent4' />
                  <span className='text-dark-700 dark:text-light-300'>
                    Extract insights without reading hundreds of pages
                  </span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent dark:text-accent4' />
                  <span className='text-dark-700 dark:text-light-300'>
                    Compatible with any PDF document type
                  </span>
                </li>
              </ul>
            </div>
            <div className='relative rounded-xl border border-accent2/60 bg-light-500/70 p-2 shadow-xl dark:border-accent/40 dark:bg-dark-700/85'>
              <Image
                src='/screencap.webp'
                alt='DocuBot interface screenshot'
                width={900}
                height={506}
                className='rounded-lg shadow-lg'
              />
              {/* Play button overlay */}
              <div className='absolute inset-0 flex items-center justify-center'>
                <button
                  className='cursor-pointer rounded-full bg-accent2/90 p-4 shadow-lg transition-transform hover:scale-105 dark:bg-accent/90'
                  aria-label='Play demo video'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='48'
                    height='48'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    className='text-light-100'
                    aria-hidden='true'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature card section */}
      <section className='w-full bg-light-500/70 py-20 dark:bg-dark-800/70'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-dark-800 dark:text-light-200 sm:text-4xl'>
              Powerful Features
            </h2>
            <p className='mx-auto mt-4 max-w-2xl text-lg text-dark-700 dark:text-light-300'>
              Everything you need to extract knowledge from your documents
            </p>
          </div>

          <FeatureCards />
        </div>
      </section>

      {/* Pricing Section Teaser */}
      <section className='w-full py-12 md:py-24 lg:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter text-dark-800 dark:text-light-200 sm:text-5xl'>
                Simple, Transparent Pricing
              </h2>
              <p className='max-w-[900px] text-dark-700 dark:text-light-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Start for free, upgrade when you need more power
              </p>
            </div>
          </div>
          <div className='mx-auto flex max-w-5xl flex-col gap-6 py-12 md:flex-row md:gap-12'>
            <div className='flex flex-1 flex-col rounded-xl border border-accent2/60 bg-light-500/70 p-6 shadow-xl dark:border-accent/40 dark:bg-dark-700/85'>
              <div className='mb-4 flex items-center gap-2'>
                <div className='rounded-full bg-accent/10 p-2 text-accent dark:text-accent4'>
                  <PackageIcon className='h-6 w-6' />
                </div>
                <h3 className='text-xl font-bold text-dark-800 dark:text-light-200'>Free</h3>
              </div>
              <div className='mb-4'>
                <span className='text-3xl font-bold text-dark-800 dark:text-light-200'>$0</span>
                <span className='text-dark-600 dark:text-light-400'>/month</span>
              </div>
              <ul className='mb-6 flex flex-col gap-2'>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent dark:text-accent4' />
                  <span className='text-dark-700 dark:text-light-300'>Up to 5 documents</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent dark:text-accent4' />
                  <span className='text-dark-700 dark:text-light-300'>
                    3 messages per document
                  </span>
                </li>
              </ul>
              <Button asChild className='mt-auto bg-accent text-light-100 hover:bg-accent2'>
                <Link href='/dashboard'>Get Started</Link>
              </Button>
            </div>
            <div className='relative flex flex-1 flex-col rounded-xl border-2 border-accent bg-light-500/70 p-6 shadow-xl dark:border-accent dark:bg-dark-700/85'>
              <div className='absolute -top-4 right-4 rounded-full bg-accent2 px-3 py-1 text-xs font-bold text-light-100 dark:bg-accent'>
                MOST POPULAR
              </div>
              <div className='mb-4 flex items-center gap-2'>
                <div className='rounded-full bg-accent2/10 p-2 text-accent2 dark:text-accent'>
                  <Star className='h-6 w-6' />
                </div>
                <h3 className='text-xl font-bold text-dark-800 dark:text-light-200'>Pro</h3>
              </div>
              <div className='mb-4'>
                <span className='text-3xl font-bold text-dark-800 dark:text-light-200'>$7.99</span>
                <span className='text-dark-600 dark:text-light-400'>/month</span>
              </div>
              <ul className='mb-6 flex flex-col gap-2'>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent2 dark:text-accent' />
                  <span className='text-dark-700 dark:text-light-300'>Up to 12 documents</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent2 dark:text-accent' />
                  <span className='text-dark-700 dark:text-light-300'>
                    15 messages per document
                  </span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent2 dark:text-accent' />
                  <span className='text-dark-700 dark:text-light-300'>Document deletion</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent2 dark:text-accent' />
                  <span className='text-dark-700 dark:text-light-300'>Priority support</span>
                </li>
              </ul>
              <Button asChild className='mt-auto bg-accent2 text-light-100 hover:bg-accent'>
                <Link href='/dashboard/upgrade'>Upgrade to Pro</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key benefits section */}
      <section className='w-full bg-light-200/30 py-20 dark:bg-dark-900/30'>
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

      {/* Testimonials */}
      <section className='w-full bg-light-500/70 py-12 dark:bg-dark-700/50 md:py-24 lg:py-32'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-14 flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter text-dark-800 dark:text-light-200 sm:text-5xl'>
                What Our Users Say
              </h2>
              <p className='max-w-[900px] text-dark-700 dark:text-light-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                DocuBot is helping professionals across industries save time and gain insights
              </p>
            </div>
          </div>

          <div className='grid gap-8 md:grid-cols-3'>
            {[
              {
                text: 'DocuBot has been a game-changer for my research. I can now process academic papers in minutes instead of hours.',
                author: 'Sarah K.',
                role: 'PhD Researcher',
              },
              {
                text: 'As a lawyer, I deal with lengthy documents daily. DocuBot helps me extract the exact clauses I need instantly.',
                author: 'Michael T.',
                role: 'Corporate Attorney',
              },
              {
                text: 'The ability to ask questions about my technical documentation has saved my team countless hours of reading time.',
                author: 'James L.',
                role: 'Technical Lead',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className='flex flex-col rounded-lg border border-l-2 border-accent2/60 bg-light-500/70 p-6 shadow-xl dark:border-l-2 dark:border-accent/40 dark:bg-dark-700/85'
              >
                <div className='flex-1'>
                  <svg
                    className='mb-4 h-8 w-8 text-accent2/60 dark:text-accent/60'
                    fill='currentColor'
                    viewBox='0 0 32 32'
                    aria-hidden='true'
                  >
                    <path d='M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z' />
                  </svg>
                  <p className='text-dark-700 dark:text-light-300'>{testimonial.text}</p>
                </div>
                <div className='mt-6'>
                  <div className='font-semibold text-dark-800 dark:text-light-200'>
                    {testimonial.author}
                  </div>
                  <div className='text-sm text-dark-600 dark:text-light-400'>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className='w-full bg-gradient-to-r from-accent/20 to-accent2/20 py-12 dark:from-accent3/20 dark:to-accent4/20 md:py-24 lg:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter text-dark-800 dark:text-light-200 sm:text-5xl'>
                Ready to Transform Your Document Experience?
              </h2>
              <p className='max-w-[900px] text-dark-700 dark:text-light-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Join thousands of professionals who are saving time and gaining insights with
                DocuBot
              </p>
            </div>
            <div className='flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
              <Button
                asChild
                size='lg'
                className='w-full bg-accent text-light-100 hover:bg-accent2 sm:w-auto'
              >
                <Link href='/dashboard'>Try DocuBot for Free</Link>
              </Button>
              <Button
                asChild
                variant='outline'
                size='lg'
                className='w-full border-accent2 text-dark-700 dark:border-accent dark:text-light-300 sm:w-auto'
              >
                <Link href='/about/pricing'>View Pricing</Link>
              </Button>
            </div>
            <p className='text-sm text-dark-600 dark:text-light-400'>
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
