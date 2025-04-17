import Image from 'next/image';

import Footer from '@/components/Global/Footer';

import HeroSection from '@/components/Home/HeroSection';
import FeatureCards from '@/components/Cards/FeatureCards';

const Home = () => {
  return (
    <>
      <main className='flex flex-col items-center overflow-scroll overflow-x-hidden bg-gradient-to-br from-accent2/40 to-accent/40 dark:from-accent3/30 dark:to-accent4/30'>
        <div className='flex flex-col items-center justify-center space-y-15 p-2 lg:p-5 xl:p-12'>
          <HeroSection />

          <div className='relavtive overflow-hidden rounded-xl p-[1px] shadow-2xl'>
            <div className='mx-auto max-w-[1500px]'>
              <Image
                src='/screencap.webp'
                alt='illustration'
                width={1906}
                height={910}
                className='rounded-xl ring ring-accent2 dark:ring-accent4/60'
              />

              <div aria-hidden='true' className='relative'>
                <div className='-x-inset-32 absolute bottom-0 mb-[-0%] w-full rounded-xl bg-gradient-to-t from-light-200/85 pt-[5%] dark:from-dark-700/90' />
              </div>
            </div>
          </div>

          {/* map thru features  */}

          <FeatureCards />
        </div>
        <Footer />
      </main>
    </>
  );
};

export default Home;
