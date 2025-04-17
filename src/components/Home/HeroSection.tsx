import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className='mx-auto flex max-w-7xl flex-col items-center justify-center rounded-xl border border-accent2/60 bg-light-500/70 px-6 py-16 shadow-xl shadow-dark-800/30 drop-shadow-xl dark:border-accent/40 dark:bg-dark-700/85 sm:py-8 lg:px-8'>
      <div className='mx-auto flex max-w-2xl flex-col items-center justify-center sm:text-center'>
        <h4 className='text-base font-semibold leading-7 text-accent2 dark:text-accent'>
          <span className='text-2xl font-extrabold text-accent text-stroke-2 text-stroke-accent2 dark:text-accent2 dark:text-stroke-accent'>
            DocuBot
          </span>
          {' - '}
          Your Interactive Document Companion
        </h4>
        <h1 className='my-2 text-3xl font-bold tracking-tight text-gradient-lime-violet sm:text-4xl'>
          Transform Your PDFs into Interactive Conversations
        </h1>
        <Image src='/logo.png' alt='logo' width={124} height={124} />
        <h2 className='my-3 text-2xl font-semibold'>
          Leverage AI to Analyze, Understand, and Interact with Your Documents
        </h2>
        <p className='mb-2 py-4 text-base leading-8 text-dark-600 dark:text-light-400 lg:mb-4'>
          Introducing <span className='font-bold text-accent'>DocuBot</span>
          <br /> Upload your PDF documents, and let DocuBot answer all your questions.
          <br /> With its ease of use, <span className='font-bold text-accent'>DocuBot</span> is
          perfect for everyone.
          <br /> Turn your static documents into
          <span className='font-bold text-accent3'> dynamic conversations</span> and effortlessly
          boost your productivity.
        </p>
      </div>
      <div className='my-2 flex items-center justify-center space-x-6'>
        <Button>
          <Link href='/dashboard'>Try DocuBot Now</Link>
        </Button>
        <Button>
          <Link href='/about/pricing'>See Pricing</Link>
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
