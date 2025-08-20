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
      <dl className='business-light:text-muted-foreground business-dark:text-muted-foreground neon-light:text-muted-foreground neon-dark:text-slate-300 mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 px-6 text-base sm:grid-cols-2 lg:mx-0 lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16 lg:px-8'>
        {features.map((feature, i) => (
          <div
            key={i}
            className='business-light:border-border business-light:bg-card business-dark:border-border business-dark:bg-card neon-light:border-accent/20 neon-light:bg-card neon-dark:border-accent/30 neon-dark:bg-slate-800/80 relative rounded-lg border px-2 py-4 shadow-lg drop-shadow-md'
          >
            <dt className='business-light:text-foreground business-dark:text-foreground neon-light:text-foreground neon-dark:text-slate-100 inline font-semibold'>
              <feature.icon
                className='business-light:text-primary business-dark:text-primary neon-light:text-accent neon-dark:text-accent absolute left-3 top-5 h-10 w-10'
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
