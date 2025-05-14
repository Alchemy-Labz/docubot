import React from 'react';
import featuresData from '@/util/constants.json';
import { FilePlus2, TextSearch, Binary, DatabaseZap, FileOutput, Eye } from 'lucide-react';
const iconMap = {
  FilePlus2,
  TextSearch,
  Binary,
  DatabaseZap,
  FileOutput,
  Eye,
};

const FeatureCards = () => {
  const features = featuresData.features.map((feature) => ({
    ...feature,
    icon: iconMap[feature.icon as keyof typeof iconMap],
  }));
  return (
    <div className='mb-3 md:mb-6 lg:mb-10'>
      <dl className='mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 px-6 text-base text-dark-700 dark:text-light-700 sm:grid-cols-2 lg:mx-0 lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16 lg:px-8'>
        {features.map((feature, i) => (
          <div
            key={i}
            className='relative rounded-lg border border-accent2/80 bg-light-500/30 px-2 py-4 shadow-lg shadow-dark-900/30 drop-shadow-md dark:border-accent/80 dark:bg-dark-700/50'
          >
            <dt className='inline font-semibold text-dark-800 dark:text-light-600'>
              <feature.icon
                className='absolute left-3 top-5 h-10 w-10 text-accent4 dark:text-accent2'
                aria-hidden='true'
              />

              <p className='ml-16 text-lg font-medium leading-6'>{feature.title}</p>
            </dt>
            <dd className='ml-16 mt-2 text-base'>{feature.description}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default FeatureCards;
