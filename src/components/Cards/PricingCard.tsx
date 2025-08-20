import React from 'react';

interface PricingCardProps {
  plan: string;
  price: string;
  features: string[];
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, features }) => {
  return (
    <div className='business-light:border-border business-light:bg-card business-dark:border-border business-dark:bg-card neon-light:border-accent/20 neon-light:bg-card neon-dark:border-accent/30 neon-dark:bg-card flex max-w-md flex-col justify-between rounded-lg border shadow-lg drop-shadow-md'>
      <div className='px-6 py-8'>
        <h3 className='business-light:text-primary business-dark:text-primary neon-light:text-accent neon-dark:text-accent mb-4 text-2xl font-bold'>
          {plan}
        </h3>
        <p className='business-light:text-foreground business-dark:text-foreground neon-light:text-foreground neon-dark:text-foreground text-3xl font-semibold'>
          {price}
        </p>
      </div>
      <div className='px-6 pb-8'>
        <ul className='space-y-4'>
          {features.map((feature, index) => (
            <li
              key={index}
              className='business-light:text-muted-foreground business-dark:text-muted-foreground neon-light:text-muted-foreground neon-dark:text-muted-foreground flex items-center text-sm font-light'
            >
              <span className='business-light:bg-primary business-dark:bg-primary neon-light:bg-accent neon-dark:bg-accent mr-3 h-5 w-5 flex-none rounded-full' />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className='flex w-full flex-1 items-end justify-end px-6 pb-8 pt-4 text-center'>
        <button className='business-light:bg-primary business-light:hover:bg-primary/90 business-dark:bg-primary business-dark:hover:bg-primary/90 neon-light:bg-accent neon-light:hover:bg-accent/90 neon-dark:bg-accent neon-dark:hover:bg-accent/90 h-min rounded-md px-6 py-3 font-semibold text-white transition-colors duration-300'>
          Select Plan
        </button>
      </div>
    </div>
  );
};

export default PricingCard;
