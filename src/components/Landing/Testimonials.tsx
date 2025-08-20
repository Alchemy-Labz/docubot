'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, PauseCircle, PlayCircle, Quote } from 'lucide-react';

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      text: "Very effective way to quickly get important information from documents. An example use case for me was exporting 2 firewall configs, a working one and one that wasn't working, to quickly compare the differences",
      author: 'George Watkins',
      role: 'Systems Engineer',
    },
    {
      text: "DocuBot has been a game-changer for my research work. I've been using it to analyze complex academic papers and research documents. The ability to quickly process and understand multiple papers simultaneously has completely transformed my workflow and research methodology",
      author: 'Lillian Ware',
      role: 'PhD Researcher',
    },
    {
      text: "As a lawyer handling complex corporate cases, I deal with lengthy legal documents and contracts daily. DocuBot has revolutionized how I work by helping me extract specific clauses and legal terminology instantly. It's particularly useful when comparing multiple contract versions",
      author: 'Alfonso Phillips',
      role: 'Corporate Attorney',
    },
    {
      text: "The ability to ask questions about my technical documentation has transformed our development process. My team now saves countless hours by quickly finding specific implementation details and troubleshooting information. It's like having an expert system administrator always available",
      author: 'James Lockridge',
      role: 'Technical Lead',
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, testimonials.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: React.SetStateAction<number>) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className='business-light:bg-background business-dark:bg-background neon-light:bg-gradient-to-br neon-light:from-accent/10 neon-light:to-accent2/10 neon-dark:bg-gradient-to-br neon-dark:from-accent/60 neon-dark:to-accent2/60 w-full py-16'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h2 className='business-light:text-foreground business-dark:text-foreground neon-light:text-foreground neon-dark:text-light-100 text-4xl font-bold tracking-tight sm:text-5xl'>
            What Our Users Say
          </h2>
          <p className='business-light:text-muted-foreground business-dark:text-muted-foreground neon-light:text-muted-foreground neon-dark:text-light-300 mx-auto mt-4 max-w-2xl text-lg'>
            DocuBot is helping professionals across industries save time and gain insights
          </p>
        </div>

        {/* Carousel Container */}
        <div className='relative mx-auto max-w-4xl'>
          {/* Main Testimonial Card */}
          <div className='business-light:bg-card business-dark:bg-card neon-light:bg-card neon-dark:bg-neon2-dark-800/80 relative overflow-hidden rounded-2xl shadow-2xl'>
            <div
              className='flex transition-transform duration-500 ease-in-out'
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className='w-full flex-shrink-0 p-8 md:p-12'>
                  <div className='flex flex-col items-center text-center'>
                    {/* Quote Icon */}
                    <div className='business-light:bg-primary/10 business-dark:bg-primary/10 neon-light:bg-accent/10 neon-dark:bg-accent/10 mb-6 flex h-12 w-12 items-center justify-center rounded-full'>
                      <Quote className='business-light:text-primary business-dark:text-primary neon-light:text-accent neon-dark:text-accent h-6 w-6 text-accent' />
                    </div>

                    {/* Quote Text */}
                    <blockquote className='neon-dark:text-light-300 max-w-3xl text-lg leading-relaxed text-slate-700 md:text-xl'>
                      "{testimonial.text}"
                    </blockquote>

                    {/* Author Info */}
                    <div className='mt-8 flex flex-col items-center'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent2 text-lg font-semibold text-white'>
                        {testimonial.author
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div className='mt-3'>
                        <div className='neon-dark:text-light-100 font-semibold text-slate-900'>
                          {testimonial.author}
                        </div>
                        <div className='neon-dark:text-light-400 text-sm text-slate-500'>
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className='absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-accent shadow-lg transition-all hover:scale-110 hover:bg-accent/60 focus:outline-none focus:ring-2 focus:ring-accent2 dark:bg-slate-700 dark:hover:bg-slate-600'
            aria-label='Previous testimonial'
          >
            <ChevronLeft className='h-5 w-5 text-slate-600 dark:text-slate-300' />
          </button>

          <button
            onClick={goToNext}
            className='absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-accent shadow-lg transition-all hover:scale-110 hover:bg-accent/60 focus:outline-none focus:ring-2 focus:ring-accent2 dark:bg-slate-700 dark:hover:bg-slate-600'
            aria-label='Next testimonial'
          >
            <ChevronRight className='h-5 w-5 text-slate-600 dark:text-slate-300' />
          </button>
        </div>

        <div className='mt-6 flex items-center justify-center space-x-8'>
          {/* Dots Indicator */}
          <div className='flex justify-center space-x-2'>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 w-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  index === currentIndex
                    ? 'scale-110 bg-accent dark:bg-accent'
                    : 'bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className='flex justify-center'>
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className='text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
            >
              {isAutoPlaying ? (
                <PlayCircle className='h-6 w-6' />
              ) : (
                <PauseCircle className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
