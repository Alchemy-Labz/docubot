// src/app/(landing)/investor-relations/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  Target,
  Rocket,
  Globe,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Footer from '@/components/Global/Footer';
import { addDoc, collection } from '@firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import toast from 'react-hot-toast';

interface InvestorInquiryData {
  name: string;
  email: string;
  company: string;
  position: string;
  phone: string;
  investorType: string;
  investmentRange: string;
  investmentTimeline: string;
  areasOfInterest: string;
  experience: string;
  message: string;
  linkedinUrl: string;
  websiteUrl: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  investorType?: string;
  message?: string;
}

const InvestorRelationsPage: React.FC = () => {
  const [formData, setFormData] = useState<InvestorInquiryData>({
    name: '',
    email: '',
    company: '',
    position: '',
    phone: '',
    investorType: '',
    investmentRange: '',
    investmentTimeline: '',
    areasOfInterest: '',
    experience: '',
    message: '',
    linkedinUrl: '',
    websiteUrl: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const investorTypes = [
    { value: 'angel', label: 'Angel Investor' },
    { value: 'vc', label: 'Venture Capital' },
    { value: 'pe', label: 'Private Equity' },
    { value: 'corporate', label: 'Corporate Venture' },
    { value: 'family-office', label: 'Family Office' },
    { value: 'strategic', label: 'Strategic Investor' },
    { value: 'accelerator', label: 'Accelerator/Incubator' },
    { value: 'other', label: 'Other' },
  ];

  const investmentRanges = [
    { value: 'under-100k', label: 'Under $100K' },
    { value: '100k-500k', label: '$100K - $500K' },
    { value: '500k-1m', label: '$500K - $1M' },
    { value: '1m-5m', label: '$1M - $5M' },
    { value: '5m-10m', label: '$5M - $10M' },
    { value: 'over-10m', label: 'Over $10M' },
    { value: 'flexible', label: 'Flexible' },
  ];

  const timelines = [
    { value: 'immediate', label: 'Immediate (0-3 months)' },
    { value: 'short-term', label: 'Short-term (3-6 months)' },
    { value: 'medium-term', label: 'Medium-term (6-12 months)' },
    { value: 'long-term', label: 'Long-term (12+ months)' },
    { value: 'exploring', label: 'Just exploring' },
  ];

  const companyHighlights = [
    {
      icon: <TrendingUp className='h-8 w-8' />,
      title: 'Rapid Growth',
      value: '300%',
      description: 'Year-over-year user growth',
    },
    {
      icon: <Users className='h-8 w-8' />,
      title: 'Active Users',
      value: '50K+',
      description: 'Monthly active users',
    },
    {
      icon: <DollarSign className='h-8 w-8' />,
      title: 'ARR Growth',
      value: '250%',
      description: 'Annual recurring revenue growth',
    },
    {
      icon: <Award className='h-8 w-8' />,
      title: 'Enterprise Clients',
      value: '100+',
      description: 'Fortune 500 companies using DocuBot',
    },
  ];

  const investmentOpportunity = [
    {
      icon: <Globe className='h-6 w-6' />,
      title: 'Market Opportunity',
      description:
        'The global document AI market is projected to reach $10.1B by 2026, growing at 31.5% CAGR.',
    },
    {
      icon: <Rocket className='h-6 w-6' />,
      title: 'Technology Leadership',
      description:
        'Proprietary AI technology with advanced RAG pipeline and vector embeddings for superior accuracy.',
    },
    {
      icon: <Target className='h-6 w-6' />,
      title: 'Product-Market Fit',
      description:
        'Strong customer retention, expanding use cases, and proven scalability across enterprise segments.',
    },
    {
      icon: <BarChart3 className='h-6 w-6' />,
      title: 'Revenue Growth',
      description:
        'Consistent revenue growth with multiple monetization streams and expanding enterprise partnerships.',
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company/Organization is required';
    }

    if (!formData.investorType) {
      newErrors.investorType = 'Please select investor type';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'investorType' && errors.investorType) {
      setErrors((prev) => ({ ...prev, investorType: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Add document to Firebase
      await addDoc(collection(db, 'investor-inquiries'), {
        ...formData,
        timestamp: new Date(),
        status: 'new',
        source: 'investor-relations-page',
        inquiryId: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, '0')}`,
      });

      setIsSubmitted(true);
      toast.success(
        "Inquiry submitted successfully! We'll be in touch soon to discuss investment opportunities."
      );

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          company: '',
          position: '',
          phone: '',
          investorType: '',
          investmentRange: '',
          investmentTimeline: '',
          areasOfInterest: '',
          experience: '',
          message: '',
          linkedinUrl: '',
          websiteUrl: '',
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting investor inquiry:', error);
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className='flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-br from-accent2/20 to-accent/20 dark:from-accent3/20 dark:to-accent4/20'>
      <div className='flex-grow'>
        <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
          {/* Header */}
          <motion.div className='text-center' initial='hidden' animate='visible' variants={fadeIn}>
            <h1 className='text-4xl font-extrabold tracking-tight text-dark-800 dark:text-light-300 sm:text-5xl lg:text-6xl'>
              Investor Relations
            </h1>
            <p className='mx-auto mt-6 max-w-2xl text-xl text-dark-600 dark:text-light-400'>
              Join us in revolutionizing document AI. Explore investment opportunities in the
              future of intelligent document processing.
            </p>
          </motion.div>

          {/* Company Highlights */}
          <motion.div
            className='mt-20'
            initial='hidden'
            animate='visible'
            variants={staggerContainer}
          >
            <h2 className='mb-12 text-center text-3xl font-bold text-dark-800 dark:text-light-300'>
              Company Highlights
            </h2>
            <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
              {companyHighlights.map((highlight, index) => (
                <motion.div key={index} variants={fadeIn}>
                  <Card className='h-full bg-light-400/30 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
                    <CardContent className='p-6 text-center'>
                      <div className='mb-4 flex justify-center'>
                        <div className='flex h-16 w-16 items-center justify-center rounded-lg bg-accent2/10 text-accent2 dark:bg-accent/10 dark:text-accent'>
                          {highlight.icon}
                        </div>
                      </div>
                      <h3 className='mb-2 text-3xl font-bold text-dark-800 dark:text-light-300'>
                        {highlight.value}
                      </h3>
                      <p className='mb-1 text-lg font-semibold text-accent2 dark:text-accent'>
                        {highlight.title}
                      </p>
                      <p className='text-sm text-dark-600 dark:text-light-400'>
                        {highlight.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Investment Opportunity */}
          <motion.div
            className='mt-20'
            initial='hidden'
            animate='visible'
            variants={staggerContainer}
          >
            <h2 className='mb-12 text-center text-3xl font-bold text-dark-800 dark:text-light-300'>
              Investment Opportunity
            </h2>
            <div className='grid gap-8 md:grid-cols-2'>
              {investmentOpportunity.map((opportunity, index) => (
                <motion.div key={index} variants={fadeIn}>
                  <Card className='h-full bg-light-400/30 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
                    <CardContent className='p-6'>
                      <div className='mb-4 flex items-center space-x-4'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-accent2/10 text-accent2 dark:bg-accent/10 dark:text-accent'>
                          {opportunity.icon}
                        </div>
                        <h3 className='text-lg font-semibold text-dark-800 dark:text-light-300'>
                          {opportunity.title}
                        </h3>
                      </div>
                      <p className='text-dark-600 dark:text-light-400'>
                        {opportunity.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className='mt-20 grid gap-12 lg:grid-cols-3'>
            {/* Investment Information */}
            <motion.div
              className='lg:col-span-1'
              initial='hidden'
              animate='visible'
              variants={staggerContainer}
            >
              <h2 className='text-2xl font-bold text-dark-800 dark:text-light-300'>
                Why Invest in DocuBot?
              </h2>
              <p className='mt-3 text-lg text-dark-600 dark:text-light-400'>
                Position yourself at the forefront of the AI revolution
              </p>

              <div className='mt-8 space-y-6'>
                <motion.div variants={fadeIn} className='flex items-start space-x-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-accent2/10 text-accent2 dark:bg-accent/10 dark:text-accent'>
                    <TrendingUp className='h-6 w-6' />
                  </div>
                  <div>
                    <h3 className='text-lg font-medium text-dark-800 dark:text-light-300'>
                      Scalable Technology
                    </h3>
                    <p className='text-accent2 dark:text-accent'>Built for enterprise scale</p>
                    <p className='text-sm text-dark-600 dark:text-light-400'>
                      Our platform processes millions of documents with sub-second response times
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={fadeIn} className='flex items-start space-x-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-accent2/10 text-accent2 dark:bg-accent/10 dark:text-accent'>
                    <Target className='h-6 w-6' />
                  </div>
                  <div>
                    <h3 className='text-lg font-medium text-dark-800 dark:text-light-300'>
                      Market Leadership
                    </h3>
                    <p className='text-accent2 dark:text-accent'>First-mover advantage</p>
                    <p className='text-sm text-dark-600 dark:text-light-400'>
                      Leading the document AI space with proprietary technology and proven results
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={fadeIn} className='flex items-start space-x-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-accent2/10 text-accent2 dark:bg-accent/10 dark:text-accent'>
                    <Rocket className='h-6 w-6' />
                  </div>
                  <div>
                    <h3 className='text-lg font-medium text-dark-800 dark:text-light-300'>
                      Growth Trajectory
                    </h3>
                    <p className='text-accent2 dark:text-accent'>Exponential growth potential</p>
                    <p className='text-sm text-dark-600 dark:text-light-400'>
                      Expanding into new markets with multiple revenue streams and partnerships
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Investor Inquiry Form */}
            <motion.div
              className='lg:col-span-2'
              initial='hidden'
              animate='visible'
              variants={fadeIn}
            >
              <Card className='bg-light-400/30 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
                <CardHeader>
                  <CardTitle className='flex items-center space-x-2 text-dark-800 dark:text-light-300'>
                    <DollarSign className='h-6 w-6' />
                    <span>Investment Inquiry</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <motion.div
                      className='flex flex-col items-center justify-center space-y-4 py-8'
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle className='h-16 w-16 text-green-500' />
                      <h3 className='text-xl font-semibold text-dark-800 dark:text-light-300'>
                        Inquiry Submitted!
                      </h3>
                      <p className='text-center text-dark-600 dark:text-light-400'>
                        Thank you for your interest in investing in DocuBot. Our team will review
                        your inquiry and get back to you soon.
                      </p>
                    </motion.div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className='space-y-6'
                      aria-label='Investor inquiry form'
                    >
                      <div className='grid gap-6 sm:grid-cols-2'>
                        <div className='space-y-2'>
                          <Label htmlFor='name'>
                            Full Name <span className='text-red-500'>*</span>
                          </Label>
                          <Input
                            id='name'
                            name='name'
                            type='text'
                            value={formData.name}
                            onChange={handleInputChange}
                            className={errors.name ? 'border-red-500' : ''}
                            disabled={isSubmitting}
                            aria-required='true'
                            aria-describedby={errors.name ? 'name-error' : undefined}
                          />
                          {errors.name && (
                            <div
                              id='name-error'
                              className='flex items-center text-sm text-red-500'
                            >
                              <AlertCircle className='mr-1 h-4 w-4' />
                              {errors.name}
                            </div>
                          )}
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='email'>
                            Email Address <span className='text-red-500'>*</span>
                          </Label>
                          <Input
                            id='email'
                            name='email'
                            type='email'
                            value={formData.email}
                            onChange={handleInputChange}
                            className={errors.email ? 'border-red-500' : ''}
                            disabled={isSubmitting}
                            aria-required='true'
                            aria-describedby={errors.email ? 'email-error' : undefined}
                          />
                          {errors.email && (
                            <div
                              id='email-error'
                              className='flex items-center text-sm text-red-500'
                            >
                              <AlertCircle className='mr-1 h-4 w-4' />
                              {errors.email}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='grid gap-6 sm:grid-cols-2'>
                        <div className='space-y-2'>
                          <Label htmlFor='company'>
                            Company/Organization <span className='text-red-500'>*</span>
                          </Label>
                          <Input
                            id='company'
                            name='company'
                            type='text'
                            value={formData.company}
                            onChange={handleInputChange}
                            className={errors.company ? 'border-red-500' : ''}
                            disabled={isSubmitting}
                            aria-required='true'
                            aria-describedby={errors.company ? 'company-error' : undefined}
                          />
                          {errors.company && (
                            <div
                              id='company-error'
                              className='flex items-center text-sm text-red-500'
                            >
                              <AlertCircle className='mr-1 h-4 w-4' />
                              {errors.company}
                            </div>
                          )}
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='position'>Position/Title</Label>
                          <Input
                            id='position'
                            name='position'
                            type='text'
                            value={formData.position}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className='grid gap-6 sm:grid-cols-2'>
                        <div className='space-y-2'>
                          <Label htmlFor='investorType'>
                            Investor Type <span className='text-red-500'>*</span>
                          </Label>
                          <Select
                            onValueChange={handleSelectChange('investorType')}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger className={errors.investorType ? 'border-red-500' : ''}>
                              <SelectValue placeholder='Select investor type' />
                            </SelectTrigger>
                            <SelectContent>
                              {investorTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.investorType && (
                            <div className='flex items-center text-sm text-red-500'>
                              <AlertCircle className='mr-1 h-4 w-4' />
                              {errors.investorType}
                            </div>
                          )}
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='investmentRange'>Investment Range</Label>
                          <Select
                            onValueChange={handleSelectChange('investmentRange')}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Select investment range' />
                            </SelectTrigger>
                            <SelectContent>
                              {investmentRanges.map((range) => (
                                <SelectItem key={range.value} value={range.value}>
                                  {range.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className='grid gap-6 sm:grid-cols-2'>
                        <div className='space-y-2'>
                          <Label htmlFor='investmentTimeline'>Investment Timeline</Label>
                          <Select
                            onValueChange={handleSelectChange('investmentTimeline')}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Select timeline' />
                            </SelectTrigger>
                            <SelectContent>
                              {timelines.map((timeline) => (
                                <SelectItem key={timeline.value} value={timeline.value}>
                                  {timeline.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='phone'>Phone Number</Label>
                          <Input
                            id='phone'
                            name='phone'
                            type='tel'
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className='grid gap-6 sm:grid-cols-2'>
                        <div className='space-y-2'>
                          <Label htmlFor='linkedinUrl'>LinkedIn Profile</Label>
                          <Input
                            id='linkedinUrl'
                            name='linkedinUrl'
                            type='url'
                            placeholder='https://linkedin.com/in/yourprofile'
                            value={formData.linkedinUrl}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='websiteUrl'>Company Website</Label>
                          <Input
                            id='websiteUrl'
                            name='websiteUrl'
                            type='url'
                            placeholder='https://yourcompany.com'
                            value={formData.websiteUrl}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='areasOfInterest'>Areas of Interest</Label>
                        <Textarea
                          id='areasOfInterest'
                          name='areasOfInterest'
                          placeholder='e.g., AI/ML technologies, SaaS platforms, B2B software, enterprise solutions...'
                          value={formData.areasOfInterest}
                          onChange={handleInputChange}
                          rows={3}
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='experience'>Investment Experience</Label>
                        <Textarea
                          id='experience'
                          name='experience'
                          placeholder='Brief overview of your investment experience and portfolio...'
                          value={formData.experience}
                          onChange={handleInputChange}
                          rows={3}
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='message'>
                          Message <span className='text-red-500'>*</span>
                        </Label>
                        <Textarea
                          id='message'
                          name='message'
                          placeholder="Tell us about your investment interests, specific questions about DocuBot, or how you'd like to get involved..."
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={5}
                          className={errors.message ? 'border-red-500' : ''}
                          disabled={isSubmitting}
                          aria-required='true'
                          aria-describedby={errors.message ? 'message-error' : undefined}
                        />
                        {errors.message && (
                          <div
                            id='message-error'
                            className='flex items-center text-sm text-red-500'
                          >
                            <AlertCircle className='mr-1 h-4 w-4' />
                            {errors.message}
                          </div>
                        )}
                      </div>

                      <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='w-full bg-accent text-light-100 hover:bg-accent2'
                        aria-label={isSubmitting ? 'Submitting inquiry...' : 'Submit inquiry'}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' aria-hidden='true' />
                            Submitting Inquiry...
                          </>
                        ) : (
                          <>
                            <Send className='mr-2 h-4 w-4' aria-hidden='true' />
                            Submit Inquiry
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InvestorRelationsPage;
