// app/about/faq/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Search,
  MessageSquare,
  Book,
  Upload,
  Brain,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Footer from '@/components/Global/Footer';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqs: FAQItem[] = [
    {
      question: 'What is DocuBot?',
      answer:
        'DocuBot is an AI-powered tool that allows you to interact with and extract information from your PDF documents using natural language conversations. Simply upload your documents and start asking questions to get instant, accurate answers based on your content.',
      category: 'general',
    },
    {
      question: 'How does DocuBot work?',
      answer:
        'DocuBot uses advanced natural language processing and machine learning algorithms to analyze your PDF documents. When you upload a document, our AI creates vector embeddings of the content, enabling semantic search. You can then ask questions or request information in natural language, and the AI will provide relevant answers based on the content of your PDFs.',
      category: 'general',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Yes, we take data security very seriously. All uploaded documents and conversations are encrypted both in transit and at rest using industry-standard encryption. We do not share your data with any third parties. Your documents are stored in secure cloud storage with strict access controls, and you can delete your documents at any time.',
      category: 'security',
    },
    {
      question: 'What types of PDFs can I use with DocuBot?',
      answer:
        'DocuBot works with most types of PDF documents, including text-based PDFs, scanned documents (with OCR), and even PDFs with images and tables. The AI performs best with clearly formatted text but can handle a wide variety of document types, including research papers, legal documents, technical manuals, and more.',
      category: 'usage',
    },
    {
      question: 'Do I need to install any software to use DocuBot?',
      answer:
        'No, DocuBot is a web-based application that runs entirely in your browser. You can access it through any modern web browser (Chrome, Firefox, Safari, Edge) on any device without needing to install any additional software.',
      category: 'general',
    },
    {
      question: 'Can I use DocuBot on mobile devices?',
      answer:
        'Yes, DocuBot is fully responsive and works on mobile devices. You can access and use it on your smartphone or tablet through a web browser, making it convenient to chat with your documents wherever you are.',
      category: 'usage',
    },
    {
      question: 'Is there a limit to the number of PDFs I can analyze?',
      answer:
        'The number of PDFs you can analyze depends on your subscription plan. The Free plan allows up to 5 documents, the Professional plan allows up to 12 documents, and our upcoming Developer plan will support up to 50 documents. You can always upgrade your plan if you need to process more documents.',
      category: 'plans',
    },
    {
      question: 'How large can my PDF documents be?',
      answer:
        'DocuBot currently supports PDF files up to 15MB in size. If your document is larger than this, you may need to optimize it or split it into smaller parts before uploading.',
      category: 'usage',
    },
    {
      question: 'How accurate is the information provided by DocuBot?',
      answer:
        "DocuBot strives for high accuracy by using advanced AI models and vector search technology. However, as with any AI system, it's not 100% perfect. The accuracy depends on the quality and clarity of your uploaded documents. We recommend using it as a tool to assist your research and always verifying important information manually.",
      category: 'usage',
    },
    {
      question: 'Can I delete my documents after uploading?',
      answer:
        "Yes, you can delete your documents at any time if you're on the Professional plan. Free plan users cannot delete documents once uploaded, which is one of the advantages of upgrading to our paid plan.",
      category: 'usage',
    },
    {
      question: 'How many questions can I ask about each document?',
      answer:
        'The number of questions (messages) you can ask per document depends on your plan. Free users can ask up to 3 questions per document, while Professional users can ask up to 15 questions per document. Our upcoming Developer plan will offer unlimited questions.',
      category: 'plans',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure payment processor, Stripe. All transactions are encrypted and secure.',
      category: 'billing',
    },
    {
      question: 'Can I cancel my subscription at any time?',
      answer:
        "Yes, you can cancel your subscription at any time from your account settings. After cancellation, you'll continue to have access to your paid features until the end of your current billing period.",
      category: 'billing',
    },
    {
      question: 'Is there a free trial?',
      answer:
        "Yes, our Free plan essentially serves as an unlimited trial with some limitations. It allows you to upload up to 5 documents and ask 3 questions per document, giving you a good sense of DocuBot's capabilities before deciding to upgrade.",
      category: 'plans',
    },
    {
      question: 'How do I get help if I encounter an issue?',
      answer:
        'You can reach our support team by visiting the Help Center or by emailing support@docubot.app. Professional plan users receive priority support with faster response times.',
      category: 'support',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'general', name: 'General', icon: Book },
    { id: 'usage', name: 'Using DocuBot', icon: MessageSquare },
    { id: 'plans', name: 'Plans & Features', icon: Brain },
    { id: 'security', name: 'Security & Privacy', icon: Shield },
    { id: 'billing', name: 'Billing', icon: Upload },
    { id: 'support', name: 'Support', icon: MessageSquare },
  ];

  const filteredFaqs = faqs
    .filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((faq) => activeCategory === 'all' || faq.category === activeCategory);

  return (
    <div className='flex min-h-screen flex-col items-center overflow-x-hidden bg-gradient-to-br from-accent2/20 to-accent/20 dark:from-accent3/20 dark:to-accent4/20'>
      <div className='w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        {/* Header */}
        <motion.div
          className='text-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className='text-4xl font-extrabold tracking-tight text-dark-800 dark:text-light-300 sm:text-5xl'>
            Frequently Asked Questions
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-xl text-dark-600 dark:text-light-400'>
            Find answers to common questions about DocuBot
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          className='mx-auto mt-12 max-w-2xl'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400 dark:text-light-600' />
            <Input
              type='text'
              placeholder='Search for questions...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='border-accent2/20 bg-light-100/80 py-6 pl-10 dark:border-accent/20 dark:bg-dark-700/80'
            />
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          className='mt-10 border-b border-accent2/20 pb-10 dark:border-accent/20'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className='flex flex-wrap justify-center gap-3'>
            {categories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'default' : 'outline'}
                  className={`rounded-full px-4 py-2 ${
                    activeCategory === category.id
                      ? 'bg-accent2 text-light-100 dark:bg-accent'
                      : 'bg-light-100/80 dark:bg-dark-700/80'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <CategoryIcon className='mr-2 h-4 w-4' />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          className='mt-10 space-y-6'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {filteredFaqs.length === 0 ? (
            <div className='py-10 text-center'>
              <HelpCircle className='mx-auto h-12 w-12 text-accent2/60 dark:text-accent/60' />
              <h3 className='mt-4 text-lg font-medium text-dark-800 dark:text-light-300'>
                No questions found
              </h3>
              <p className='mt-2 text-dark-600 dark:text-light-400'>
                Try adjusting your search or category filter
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className='mt-4'
              >
                Reset filters
              </Button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className='overflow-hidden rounded-lg border border-accent2/20 bg-light-100/80 dark:border-accent/20 dark:bg-dark-700/80'
              >
                <button
                  className='flex w-full items-center justify-between px-6 py-4 text-left'
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className='text-lg font-semibold text-dark-800 dark:text-light-300'>
                    {faq.question}
                  </h3>
                  {expandedIndex === index ? (
                    <ChevronUp className='h-5 w-5 text-accent2 dark:text-accent' />
                  ) : (
                    <ChevronDown className='h-5 w-5 text-accent2 dark:text-accent' />
                  )}
                </button>

                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className='px-6 pb-6 text-dark-600 dark:text-light-400'>
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Still have questions section */}
        <motion.div
          className='mt-20 rounded-2xl bg-gradient-to-br from-accent2/40 to-accent/40 p-10 text-center dark:from-accent3/30 dark:to-accent4/30'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className='text-2xl font-bold text-dark-800 dark:text-light-300'>
            Still have questions?
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-lg text-dark-600 dark:text-light-400'>
            Can&apos;t find the answer you&apos;re looking for? Reach out to our support team.
          </p>
          <div className='mt-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0'>
            <Button
              asChild
              size='lg'
              className='bg-accent2 hover:bg-accent2/90 dark:bg-accent dark:hover:bg-accent/90'
            >
              <Link href='/about/support'>Contact Support</Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='border-accent2 dark:border-accent'
            >
              <Link href='/about/help-center'>Browse Help Center</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQPage;
