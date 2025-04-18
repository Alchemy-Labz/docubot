// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Global/Footer';
import FeatureCards from '@/components/Cards/FeatureCards';
import {
  ArrowRight,
  BookOpen,
  Brain,
  MessageSquareText,
  FileText,
  Clock,
  Search,
} from 'lucide-react';

const Home = () => {
  return (
    <main className='flex flex-col overflow-x-hidden'>
      {/* Hero Section with gradient background */}
      <section className='relative w-full overflow-hidden bg-gradient-to-br from-accent2/40 to-accent/40 dark:from-accent3/30 dark:to-accent4/30'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid items-center gap-12 py-16 md:grid-cols-2 md:py-24'>
            {/* Left column with text content */}
            <div className='flex flex-col space-y-8'>
              <div>
                <h1 className='text-4xl font-extrabold tracking-tight text-dark-800 dark:text-light-300 sm:text-5xl md:text-6xl'>
                  <span className='block text-accent2 dark:text-accent'>Transform</span>
                  <span className='block'>Documents into Conversations</span>
                </h1>
                <p className='mt-6 max-w-3xl text-lg text-dark-600 dark:text-light-400'>
                  DocuBot uses advanced AI to let you chat with your PDFs. Upload documents and get
                  instant answers to your questions, extract insights, and save hours of reading
                  time.
                </p>
              </div>

              <div className='flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
                <Button
                  asChild
                  size='lg'
                  className='bg-accent2 px-8 py-6 text-lg hover:bg-accent2/90 dark:bg-accent dark:hover:bg-accent/90'
                >
                  <Link href='/sign-up'>
                    Try Free <ArrowRight className='ml-2 h-5 w-5' />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  size='lg'
                  className='border-accent2 px-8 py-6 text-lg dark:border-accent'
                >
                  <Link href='#demo'>See Demo</Link>
                </Button>
              </div>

              <div className='flex items-center space-x-2 text-dark-600 dark:text-light-400'>
                <div className='flex -space-x-2'>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className='inline-block h-8 w-8 rounded-full bg-accent/80 ring-2 ring-white dark:bg-accent2/80'
                    >
                      <span className='sr-only'>User avatar</span>
                    </div>
                  ))}
                </div>
                <span className='text-sm font-medium'>
                  Join 2,000+ users already using DocuBot
                </span>
              </div>
            </div>

            {/* Right column with image */}
            <div className='relative mt-8 md:mt-0'>
              <div className='relative overflow-hidden rounded-xl shadow-2xl ring-1 ring-accent2/30 dark:ring-accent/20'>
                <Image
                  src='/screencap.webp'
                  alt='DocuBot interface showing document chat'
                  width={900}
                  height={600}
                  className='w-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-dark-900/40 to-transparent' />
              </div>

              {/* Floating feature badges */}
              <div className='absolute -right-4 -top-4 rounded-lg bg-accent2/90 p-3 shadow-lg dark:bg-accent/90'>
                <Brain className='h-6 w-6 text-light-100' />
                <span className='sr-only'>AI-Powered</span>
              </div>
              <div className='absolute -left-4 bottom-1/3 rounded-lg bg-white/90 p-3 shadow-lg dark:bg-dark-700/90'>
                <MessageSquareText className='h-6 w-6 text-accent2 dark:text-accent' />
                <span className='sr-only'>Chat Interface</span>
              </div>
            </div>
          </div>
        </div>

        {/* Curved separator */}
        <div className='absolute bottom-0 left-0 right-0'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1440 64'
            className='h-16 w-full fill-light-400/30 dark:fill-dark-700/30'
          >
            <path d='M0,32L60,37.3C120,43,240,53,360,53.3C480,53,600,43,720,37.3C840,32,960,32,1080,37.3C1200,43,1320,53,1380,58.7L1440,64L1440,64L1380,64C1320,64,1200,64,1080,64C960,64,840,64,720,64C600,64,480,64,360,64C240,64,120,64,60,64L0,64Z' />
          </svg>
        </div>
      </section>

      {/* Social proof section */}
      <section className='bg-light-400/30 py-12 dark:bg-dark-700/30'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <p className='text-base font-semibold uppercase tracking-wide text-accent2 dark:text-accent'>
              Trusted by professionals
            </p>
            <div className='mt-6 flex flex-wrap justify-center gap-x-8 gap-y-4'>
              {['Company 1', 'Company 2', 'Company 3', 'Company 4', 'Company 5'].map((company) => (
                <div key={company} className='flex items-center justify-center'>
                  <span className='text-lg font-bold text-dark-600/70 dark:text-light-400/70'>
                    {company}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id='how-it-works' className='bg-light-500/70 py-20 dark:bg-dark-800/70'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-16 text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-dark-800 dark:text-light-300 sm:text-4xl'>
              How DocuBot Works
            </h2>
            <p className='mx-auto mt-4 max-w-2xl text-lg text-dark-600 dark:text-light-400'>
              Three simple steps to start chatting with your documents
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-3'>
            {[
              {
                icon: <FileText className='h-10 w-10 text-accent2 dark:text-accent' />,
                title: 'Upload Your Document',
                description: "Upload any PDF document to DocuBot's secure platform.",
              },
              {
                icon: <Brain className='h-10 w-10 text-accent2 dark:text-accent' />,
                title: 'AI Processes Content',
                description:
                  'Our advanced AI analyzes and indexes your document for instant retrieval.',
              },
              {
                icon: <MessageSquareText className='h-10 w-10 text-accent2 dark:text-accent' />,
                title: 'Chat & Extract Insights',
                description:
                  'Ask questions in natural language and get accurate answers instantly.',
              },
            ].map((step, index) => (
              <div
                key={index}
                className='relative flex flex-col rounded-lg border border-accent2/20 bg-light-100/50 p-6 shadow-lg transition-all hover:shadow-xl dark:border-accent/20 dark:bg-dark-700/50'
              >
                <div className='mb-4'>{step.icon}</div>
                <span className='absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-accent2/10 font-bold text-accent2 dark:bg-accent/10 dark:text-accent'>
                  {index + 1}
                </span>
                <h3 className='text-xl font-bold text-dark-800 dark:text-light-300'>
                  {step.title}
                </h3>
                <p className='mt-2 text-dark-600 dark:text-light-400'>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key benefits section */}
      <section className='bg-light-200/30 py-20 dark:bg-dark-900/30'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-16 text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-dark-800 dark:text-light-300 sm:text-4xl'>
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
                icon: <MessageSquareText className='h-8 w-8 text-accent2 dark:text-accent' />,
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
                className='flex items-start space-x-4 rounded-lg border border-accent2/10 bg-light-100/70 p-6 shadow transition-all hover:bg-light-200/80 dark:border-accent/10 dark:bg-dark-700/70 dark:hover:bg-dark-600/80'
              >
                <div className='mt-1 flex-shrink-0'>{benefit.icon}</div>
                <div>
                  <h3 className='text-lg font-bold text-dark-800 dark:text-light-300'>
                    {benefit.title}
                  </h3>
                  <p className='mt-2 text-dark-600 dark:text-light-400'>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature card section */}
      <section className='bg-light-500/70 py-20 dark:bg-dark-800/70'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-dark-800 dark:text-light-300 sm:text-4xl'>
              Powerful Features
            </h2>
            <p className='mx-auto mt-4 max-w-2xl text-lg text-dark-600 dark:text-light-400'>
              Everything you need to extract knowledge from your documents
            </p>
          </div>

          <FeatureCards />
        </div>
      </section>

      {/* Demo section */}
      <section id='demo' className='bg-light-200/30 py-20 dark:bg-dark-900/30'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col items-center gap-12 md:flex-row'>
            <div className='flex-1'>
              <h2 className='text-3xl font-bold tracking-tight text-dark-800 dark:text-light-300 sm:text-4xl'>
                See DocuBot in Action
              </h2>
              <p className='mt-4 text-lg text-dark-600 dark:text-light-400'>
                Watch how DocuBot transforms the way you interact with your documents. Instantly
                extract insights, find answers, and save hours of reading time.
              </p>
              <div className='mt-8'>
                <Button
                  asChild
                  size='lg'
                  className='bg-accent2 hover:bg-accent2/90 dark:bg-accent dark:hover:bg-accent/90'
                >
                  <Link href='/sign-up'>Try for Free</Link>
                </Button>
              </div>
            </div>

            <div className='relative flex-1 overflow-hidden rounded-xl shadow-2xl'>
              <div className='aspect-w-16 aspect-h-9 w-full'>
                <Image
                  src='/screencap.webp'
                  alt='DocuBot demo'
                  width={900}
                  height={500}
                  className='object-cover'
                />
                {/* Play button overlay */}
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='cursor-pointer rounded-full bg-accent2/90 p-4 shadow-lg dark:bg-accent/90'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='48'
                      height='48'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      className='text-light-100'
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='bg-light-500/70 py-20 dark:bg-dark-800/70'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-16 text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-dark-800 dark:text-light-300 sm:text-4xl'>
              What Our Users Say
            </h2>
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
                className='flex flex-col rounded-lg border border-accent2/20 bg-light-100/50 p-6 shadow-lg dark:border-accent/20 dark:bg-dark-700/50'
              >
                <div className='flex-1'>
                  <svg
                    className='mb-4 h-8 w-8 text-accent2/60 dark:text-accent/60'
                    fill='currentColor'
                    viewBox='0 0 32 32'
                  >
                    <path d='M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z' />
                  </svg>
                  <p className='text-dark-600 dark:text-light-400'>{testimonial.text}</p>
                </div>
                <div className='mt-6'>
                  <div className='font-semibold text-dark-800 dark:text-light-300'>
                    {testimonial.author}
                  </div>
                  <div className='text-sm text-dark-500 dark:text-light-500'>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className='bg-gradient-to-br from-accent2/40 to-accent/40 py-20 dark:from-accent3/30 dark:to-accent4/30'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-dark-800 dark:text-light-300 sm:text-4xl'>
              Ready to transform how you work with documents?
            </h2>
            <p className='mt-4 text-lg text-dark-600 dark:text-light-400'>
              Join thousands of professionals using DocuBot to save time and extract valuable
              insights from their documents.
            </p>
            <div className='mt-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0'>
              <Button
                asChild
                size='lg'
                className='bg-accent2 px-8 py-6 text-lg hover:bg-accent2/90 dark:bg-accent dark:hover:bg-accent/90'
              >
                <Link href='/sign-up'>Start Free Trial</Link>
              </Button>
              <Button
                asChild
                variant='outline'
                size='lg'
                className='border-accent2 px-8 py-6 text-lg dark:border-accent'
              >
                <Link href='/about/pricing'>View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Home;
