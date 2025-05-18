'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const answerRef = useRef<HTMLDivElement>(null);
  const buttonId = `faq-button-${question.replace(/\s+/g, '-').toLowerCase()}`;
  const contentId = `faq-content-${question.replace(/\s+/g, '-').toLowerCase()}`;

  useEffect(() => {
    if (answerRef.current) {
      setHeight(isOpen ? answerRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleOpen();
    }
  };

  return (
    <div className='border-b border-accent2/20 last:border-b-0'>
      <h3>
        <button
          id={buttonId}
          className='flex w-full items-center justify-between rounded-md py-4 text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'
          onClick={toggleOpen}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls={contentId}
          aria-describedby={`${contentId}-description`}
        >
          <span className='text-lg font-semibold text-dark-800 dark:text-light-300'>
            {question}
          </span>
          <span aria-hidden='true'>
            {isOpen ? (
              <ChevronUp className='h-5 w-5 text-accent' />
            ) : (
              <ChevronDown className='h-5 w-5 text-accent' />
            )}
          </span>
          <span className='sr-only'>{isOpen ? 'Collapse answer' : 'Expand answer'}</span>
        </button>
      </h3>

      <div
        id={contentId}
        role='region'
        aria-labelledby={buttonId}
        style={{ height: `${height}px` }}
        className='overflow-hidden transition-all duration-300 ease-in-out'
        aria-hidden={!isOpen}
      >
        <div
          ref={answerRef}
          className='pb-4 text-dark-600 dark:text-light-400'
          id={`${contentId}-description`}
        >
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
