// Enhanced landing page component
import Footer from '@/components/Global/Footer';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon, RocketIcon, StarIcon, PuzzleIcon, BoltIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className='flex flex-col items-center overflow-x-hidden bg-gradient-to-br from-accent2/40 to-accent/40 dark:from-accent3/30 dark:to-accent4/30'>
      {/* Hero Section */}
      <section className='relative w-full py-12 md:py-24 lg:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16'>
            <div className='flex flex-col justify-center space-y-4'>
              <div className='space-y-2'>
                <h1 className='text-4xl font-bold tracking-tighter text-gradient-lime-violet sm:text-5xl md:text-6xl'>
                  Transform Your PDFs Into Interactive Conversations
                </h1>
                <p className='max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Upload your documents and let DocuBot answer all your questions using advanced
                  AI. Get instant insights without reading hundreds of pages.
                </p>
              </div>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                <Button asChild size='lg' className='bg-accent text-white hover:bg-accent2'>
                  <Link href='/dashboard'>
                    Try DocuBot for Free <ChevronRightIcon className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
                <Button asChild variant='outline' size='lg'>
                  <Link href='#how-it-works'>See How It Works</Link>
                </Button>
              </div>
              <div className='flex items-center gap-4 text-sm'>
                <div className='flex items-center gap-1'>
                  <StarIcon className='h-4 w-4 fill-accent' />
                  <StarIcon className='h-4 w-4 fill-accent' />
                  <StarIcon className='h-4 w-4 fill-accent' />
                  <StarIcon className='h-4 w-4 fill-accent' />
                  <StarIcon className='h-4 w-4 fill-accent' />
                </div>
                <div className='text-gray-500 dark:text-gray-400'>
                  Trusted by thousands of users worldwide
                </div>
              </div>
            </div>
            <div className='flex items-center justify-center'>
              <div className='relative h-[450px] w-[450px] rounded-full bg-gradient-to-b from-accent/20 to-accent2/20 p-4'>
                <Image
                  src='/logo.png'
                  alt='DocuBot'
                  width={400}
                  height={400}
                  className='animate-float rounded-full object-cover'
                />
              </div>
            </div>
          </div>
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
              <div className='inline-block rounded-lg bg-accent px-3 py-1 text-sm text-white'>
                AI-Powered Document Analysis
              </div>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                How DocuBot Works
              </h2>
              <p className='max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Our advanced AI technology transforms static documents into interactive knowledge
                bases you can chat with
              </p>
            </div>
          </div>
          <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12'>
            <div className='flex flex-col items-center space-y-2 rounded-lg border border-accent2/60 bg-light-500/70 p-4 shadow-xl dark:border-accent/40 dark:bg-dark-700/85'>
              <RocketIcon className='h-12 w-12 text-accent' />
              <h3 className='text-xl font-bold'>1. Upload</h3>
              <p className='text-center text-gray-500 dark:text-gray-400'>
                Securely upload your PDF documents to DocuBot&apos;s platform
              </p>
            </div>
            <div className='flex flex-col items-center space-y-2 rounded-lg border border-accent2/60 bg-light-500/70 p-4 shadow-xl dark:border-accent/40 dark:bg-dark-700/85'>
              <PuzzleIcon className='h-12 w-12 text-accent2' />
              <h3 className='text-xl font-bold'>2. AI Analysis</h3>
              <p className='text-center text-gray-500 dark:text-gray-400'>
                Our AI analyzes and understands your document content using vector embeddings
              </p>
            </div>
            <div className='flex flex-col items-center space-y-2 rounded-lg border border-accent2/60 bg-light-500/70 p-4 shadow-xl dark:border-accent/40 dark:bg-dark-700/85'>
              <BoltIcon className='h-12 w-12 text-accent' />
              <h3 className='text-xl font-bold'>3. Chat & Extract</h3>
              <p className='text-center text-gray-500 dark:text-gray-400'>
                Ask questions and get accurate answers directly from your document content
              </p>
            </div>
          </div>
          <div className='flex justify-center'>
            <Button asChild size='lg' className='bg-accent2 text-white hover:bg-accent'>
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
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                  See DocuBot in Action
                </h2>
                <p className='max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Upload your PDFs and start asking questions. DocuBot will analyze your documents
                  and provide accurate, context-aware answers instantly.
                </p>
              </div>
              <ul className='grid gap-2'>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent' />
                  <span>Advanced document analysis with vector embeddings</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent' />
                  <span>Natural language conversation with your documents</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent' />
                  <span>Extract insights without reading hundreds of pages</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent' />
                  <span>Compatible with any PDF document type</span>
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
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='w-full bg-light-500/70 py-12 dark:bg-dark-700/50 md:py-24 lg:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                What Our Users Say
              </h2>
              <p className='max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                DocuBot is helping professionals across industries save time and gain insights
              </p>
            </div>
          </div>
          <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12'>
            {/* Testimonial cards would go here */}
            <TestimonialCard
              quote='DocuBot has revolutionized how I review legal documents. I can find specific clauses in seconds instead of hours.'
              author='Sarah J.'
              role='Legal Professional'
            />
            <TestimonialCard
              quote="As a researcher, I use DocuBot daily to extract insights from academic papers. It's like having a research assistant 24/7."
              author='Dr. Michael T.'
              role='Academic Researcher'
            />
            <TestimonialCard
              quote="DocuBot helps me quickly understand complex technical documentation for client projects. It's a game-changer."
              author='Alex K.'
              role='Software Engineer'
            />
          </div>
        </div>
      </section>

      {/* Pricing Section Teaser */}
      <section className='w-full py-12 md:py-24 lg:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                Simple, Transparent Pricing
              </h2>
              <p className='max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Start for free, upgrade when you need more power
              </p>
            </div>
          </div>
          <div className='mx-auto flex max-w-5xl flex-col gap-6 py-12 md:flex-row md:gap-12'>
            <div className='flex flex-1 flex-col rounded-xl border border-accent2/60 bg-light-500/70 p-6 shadow-xl dark:border-accent/40 dark:bg-dark-700/85'>
              <div className='mb-4 flex items-center gap-2'>
                <div className='rounded-full bg-accent/10 p-2 text-accent'>
                  <PackageIcon className='h-6 w-6' />
                </div>
                <h3 className='text-xl font-bold'>Free</h3>
              </div>
              <div className='mb-4'>
                <span className='text-3xl font-bold'>$0</span>
                <span className='text-gray-500 dark:text-gray-400'>/month</span>
              </div>
              <ul className='mb-6 flex flex-col gap-2'>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent' />
                  <span>Up to 5 documents</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent' />
                  <span>3 messages per document</span>
                </li>
              </ul>
              <Button asChild className='mt-auto'>
                <Link href='/dashboard'>Get Started</Link>
              </Button>
            </div>
            <div className='relative flex flex-1 flex-col rounded-xl border-2 border-accent bg-light-500/70 p-6 shadow-xl dark:border-accent dark:bg-dark-700/85'>
              <div className='absolute -top-4 right-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white'>
                MOST POPULAR
              </div>
              <div className='mb-4 flex items-center gap-2'>
                <div className='rounded-full bg-accent2/10 p-2 text-accent2'>
                  <StarIcon className='h-6 w-6' />
                </div>
                <h3 className='text-xl font-bold'>Pro</h3>
              </div>
              <div className='mb-4'>
                <span className='text-3xl font-bold'>$7.99</span>
                <span className='text-gray-500 dark:text-gray-400'>/month</span>
              </div>
              <ul className='mb-6 flex flex-col gap-2'>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent2' />
                  <span>Up to 12 documents</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent2' />
                  <span>15 messages per document</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent2' />
                  <span>Document deletion</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='h-5 w-5 text-accent2' />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button asChild className='mt-auto bg-accent2 text-white hover:bg-accent'>
                <Link href='/dashboard/upgrade'>Upgrade to Pro</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className='w-full bg-gradient-to-r from-accent/20 to-accent2/20 py-12 md:py-24 lg:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                Ready to Transform Your Document Experience?
              </h2>
              <p className='max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Join thousands of professionals who are saving time and gaining insights with
                DocuBot
              </p>
            </div>
            <Button asChild size='lg' className='bg-accent text-white hover:bg-accent2'>
              <Link href='/dashboard'>Try DocuBot for Free</Link>
            </Button>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              No credit card required. Start with our free plan today.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

// Helper components
const CheckIcon = ({ className }: { className: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <polyline points='20 6 9 17 4 12' />
  </svg>
);
const PackageIcon = ({ className }: { className: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M16.5 9.4l-9-5.19' />
    <path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' />
    <polyline points='3.27 6.96 12 12.01 20.73 6.96' />
    <line x1='12' y1='22.08' x2='12' y2='12' />
  </svg>
);

const TestimonialCard = ({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) => (
  <div className='flex flex-col items-center space-y-2 rounded-lg border border-accent2/60 bg-light-500/70 p-6 text-center shadow-xl dark:border-accent/40 dark:bg-dark-700/85'>
    <div className='mb-2 text-accent2 dark:text-accent'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='currentColor'
        stroke='none'
      >
        <path d='M11.8 5c-1.4 0-2.7.3-3.9.8C6.4 6.6 5.1 7.7 4 9.2 3 10.7 2.4 12.3 2.4 14c0 2.5.8 4.3 2.4 5.6 1.4 1.1 3 1.7 4.8 1.7 1.7 0 3.1-.5 4.3-1.6 1.2-1.1 1.8-2.6 1.8-4.3 0-1.7-.6-3.1-1.8-4.2-1.2-1.1-2.6-1.7-4.3-1.7-.5 0-.9.1-1.4.2-.5.1-.8.2-1 .3.3-1.1.8-1.9 1.6-2.6.8-.7 1.7-1 2.8-1h.6c.1 0 .3-.1.3-.3V5.3c0-.2-.1-.3-.3-.3zm7.5 0c-1.4 0-2.7.3-3.9.8-1.5.8-2.8 1.9-3.9 3.4-1 1.5-1.6 3.1-1.6 4.8 0 2.5.8 4.3 2.4 5.6 1.4 1.1 3 1.7 4.8 1.7 1.7 0 3.1-.5 4.3-1.6 1.2-1.1 1.8-2.6 1.8-4.3 0-1.7-.6-3.1-1.8-4.2-1.2-1.1-2.6-1.7-4.3-1.7-.5 0-.9.1-1.4.2-.5.1-.8.2-1 .3.3-1.1.8-1.9 1.6-2.6.8-.7 1.7-1 2.8-1h.6c.1 0 .3-.1.3-.3V5.3c0-.2-.1-.3-.3-.3h-.4z' />
      </svg>
    </div>
    <p className='text-gray-500 dark:text-gray-400'>{quote}</p>
    <div className='mt-4'>
      <p className='font-semibold'>{author}</p>
      <p className='text-sm text-gray-500 dark:text-gray-400'>{role}</p>
    </div>
  </div>
);
export default LandingPage;
