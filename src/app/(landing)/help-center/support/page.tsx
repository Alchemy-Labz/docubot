'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Bug,
  CreditCard,
  Lightbulb,
  HelpCircle,
  Zap,
  Shield,
  Info,
  Clock,
  MessageSquare,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Footer from '@/components/Global/Footer';
import { addDoc, collection } from '@firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';

interface SupportFormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  priority: string;
  deviceInfo: string;
  steps: string;
  message: string;
  attachmentDescription: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  category?: string;
  message?: string;
}

const SupportTicketPage: React.FC = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState<SupportFormData>({
    name: user?.fullName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    subject: '',
    category: '',
    priority: 'medium',
    deviceInfo: '',
    steps: '',
    message: '',
    attachmentDescription: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const categories = [
    {
      value: 'technical',
      label: 'Technical Issue',
      icon: <Bug className='h-4 w-4' />,
      description: 'Problems with uploading, processing, or chatting with documents',
    },
    {
      value: 'billing',
      label: 'Billing & Subscription',
      icon: <CreditCard className='h-4 w-4' />,
      description: 'Payment issues, subscription changes, or refund requests',
    },
    {
      value: 'account',
      label: 'Account Issues',
      icon: <Shield className='h-4 w-4' />,
      description: 'Login problems, account settings, or security concerns',
    },
    {
      value: 'feature',
      label: 'Feature Request',
      icon: <Lightbulb className='h-4 w-4' />,
      description: 'Suggestions for new features or improvements',
    },
    {
      value: 'performance',
      label: 'Performance Issues',
      icon: <Zap className='h-4 w-4' />,
      description: 'Slow loading, timeouts, or other performance problems',
    },
    {
      value: 'other',
      label: 'Other',
      icon: <HelpCircle className='h-4 w-4' />,
      description: 'General questions or issues not covered above',
    },
  ];

  const priorities = [
    {
      value: 'low',
      label: 'Low',
      description: 'General questions or minor issues',
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      value: 'medium',
      label: 'Medium',
      description: 'Standard support requests',
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      value: 'high',
      label: 'High',
      description: 'Urgent issues affecting your work',
      color: 'text-red-600 dark:text-red-400',
    },
  ];

  const supportFeatures = [
    {
      icon: <Clock className='h-6 w-6 text-accent2 dark:text-accent' />,
      title: 'Fast Response',
      description: 'We respond to all tickets within 24 hours',
    },
    {
      icon: <MessageSquare className='h-6 w-6 text-accent2 dark:text-accent' />,
      title: 'Expert Support',
      description: 'Our team knows DocuBot inside and out',
    },
    {
      icon: <Shield className='h-6 w-6 text-accent2 dark:text-accent' />,
      title: 'Secure & Private',
      description: 'Your information is always protected',
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

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please describe your issue';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Please provide more details (at least 20 characters)';
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
    if (name === 'category' && errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }));
    }
  };

  const generateTicketNumber = (): string => {
    const prefix = 'DOCUB';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const ticketNum = generateTicketNumber();

      // Add document to Firebase
      await addDoc(collection(db, 'support-tickets'), {
        ...formData,
        ticketNumber: ticketNum,
        timestamp: new Date(),
        status: 'open',
        source: 'support-page',
        userId: user?.id || null,
        userAgent: navigator.userAgent,
        url: window.location.href,
      });

      setTicketNumber(ticketNum);
      setIsSubmitted(true);
      toast.success(`Support ticket created successfully! Ticket #${ticketNum}`);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: user?.fullName || '',
          email: user?.primaryEmailAddress?.emailAddress || '',
          subject: '',
          category: '',
          priority: 'medium',
          deviceInfo: '',
          steps: '',
          message: '',
          attachmentDescription: '',
        });
        setIsSubmitted(false);
        setTicketNumber('');
      }, 5000);
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      toast.error('Failed to create support ticket. Please try again.');
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
        <div className='mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
          {/* Header */}
          <motion.div className='text-center' initial='hidden' animate='visible' variants={fadeIn}>
            <h1 className='text-4xl font-extrabold tracking-tight text-dark-800 dark:text-light-300 sm:text-5xl'>
              Submit a Support Ticket
            </h1>
            <p className='mx-auto mt-6 max-w-2xl text-xl text-dark-600 dark:text-light-400'>
              Need help with DocuBot? Our support team is here to assist you. Please provide as
              much detail as possible to help us resolve your issue quickly.
            </p>
          </motion.div>

          {/* Support Features */}
          <motion.div
            className='mt-12 grid gap-6 sm:grid-cols-3'
            initial='hidden'
            animate='visible'
            variants={staggerContainer}
          >
            {supportFeatures.map((feature, index) => (
              <motion.div key={index} variants={fadeIn} className='text-center'>
                <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent2/10 dark:bg-accent/10'>
                  {feature.icon}
                </div>
                <h3 className='mt-4 text-lg font-medium text-dark-800 dark:text-light-300'>
                  {feature.title}
                </h3>
                <p className='mt-2 text-sm text-dark-600 dark:text-light-400'>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Support Form */}
          <motion.div className='mt-16' initial='hidden' animate='visible' variants={fadeIn}>
            <Card className='border-accent2/20 bg-light-100/80 shadow-xl dark:border-accent/20 dark:bg-dark-700/80'>
              <CardHeader>
                <CardTitle className='text-2xl text-dark-800 dark:text-light-300'>
                  Create Support Ticket
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='flex flex-col items-center py-12 text-center'
                  >
                    <CheckCircle className='h-16 w-16 text-emerald-500' />
                    <h3 className='mt-4 text-xl font-semibold text-dark-800 dark:text-light-300'>
                      Support Ticket Created!
                    </h3>
                    <p className='mt-2 text-dark-600 dark:text-light-400'>
                      Your ticket number is:{' '}
                      <span className='font-mono font-semibold text-accent2 dark:text-accent'>
                        #{ticketNumber}
                      </span>
                    </p>
                    <p className='mt-2 text-sm text-dark-500 dark:text-light-500'>
                      We&apos;ll respond within 24 hours. You&apos;ll receive an email confirmation
                      shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* Basic Information */}
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
                        />
                        {errors.name && (
                          <div className='flex items-center text-sm text-red-500'>
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
                        />
                        {errors.email && (
                          <div className='flex items-center text-sm text-red-500'>
                            <AlertCircle className='mr-1 h-4 w-4' />
                            {errors.email}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Issue Details */}
                    <div className='space-y-2'>
                      <Label htmlFor='subject'>
                        Subject <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='subject'
                        name='subject'
                        type='text'
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={errors.subject ? 'border-red-500' : ''}
                        disabled={isSubmitting}
                        placeholder='Brief description of your issue'
                      />
                      {errors.subject && (
                        <div className='flex items-center text-sm text-red-500'>
                          <AlertCircle className='mr-1 h-4 w-4' />
                          {errors.subject}
                        </div>
                      )}
                    </div>

                    <div className='grid gap-6 sm:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='category'>
                          Category <span className='text-red-500'>*</span>
                        </Label>
                        <Select
                          onValueChange={handleSelectChange('category')}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                            <SelectValue placeholder='Select category...' />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                <div className='flex items-center space-x-2'>
                                  {category.icon}
                                  <div>
                                    <div className='font-medium'>{category.label}</div>
                                    <div className='text-xs text-muted-foreground'>
                                      {category.description}
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.category && (
                          <div className='flex items-center text-sm text-red-500'>
                            <AlertCircle className='mr-1 h-4 w-4' />
                            {errors.category}
                          </div>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <div className='flex items-center space-x-2'>
                          <Label htmlFor='priority'>Priority</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className='h-4 w-4 text-dark-500 dark:text-light-500' />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className='w-64 text-sm'>
                                  Higher priority tickets are processed faster. Choose based on how
                                  urgently you need assistance.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Select
                          onValueChange={handleSelectChange('priority')}
                          defaultValue='medium'
                          disabled={isSubmitting}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {priorities.map((priority) => (
                              <SelectItem key={priority.value} value={priority.value}>
                                <div className='flex items-center justify-between'>
                                  <span className={priority.color}>{priority.label}</span>
                                  <span className='ml-2 text-xs text-muted-foreground'>
                                    {priority.description}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className='space-y-2'>
                      <Label htmlFor='deviceInfo'>Device & Browser Information</Label>
                      <Input
                        id='deviceInfo'
                        name='deviceInfo'
                        type='text'
                        value={formData.deviceInfo}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        placeholder='e.g., Chrome on Windows 11, Safari on iPhone'
                      />
                      <p className='text-xs text-dark-500 dark:text-light-500'>
                        This helps us reproduce and solve technical issues faster
                      </p>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='steps'>Steps to Reproduce (for technical issues)</Label>
                      <Textarea
                        id='steps'
                        name='steps'
                        rows={3}
                        value={formData.steps}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        placeholder='1. I uploaded a PDF document&#10;2. I asked a question&#10;3. The error occurred...'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='message'>
                        Detailed Description <span className='text-red-500'>*</span>
                      </Label>
                      <Textarea
                        id='message'
                        name='message'
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className={errors.message ? 'border-red-500' : ''}
                        disabled={isSubmitting}
                        placeholder="Please provide a detailed description of your issue, including any error messages you've seen..."
                      />
                      {errors.message && (
                        <div className='flex items-center text-sm text-red-500'>
                          <AlertCircle className='mr-1 h-4 w-4' />
                          {errors.message}
                        </div>
                      )}
                      <p className='text-sm text-dark-500 dark:text-light-500'>
                        {formData.message.length}/1000 characters
                      </p>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='attachmentDescription'>Attachments or Screenshots</Label>
                      <Textarea
                        id='attachmentDescription'
                        name='attachmentDescription'
                        rows={2}
                        value={formData.attachmentDescription}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        placeholder="Describe any screenshots or files you'd like to include (you can email them to us after submitting)"
                      />
                    </div>

                    <div className='border-t border-accent2/20 pt-6 dark:border-accent/20'>
                      <Button
                        type='submit'
                        className='w-full bg-accent2 hover:bg-accent2/90 dark:bg-accent dark:hover:bg-accent/90'
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Creating Ticket...
                          </>
                        ) : (
                          <>
                            <Send className='mr-2 h-4 w-4' />
                            Submit Support Ticket
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Alternative Support Options */}
          <motion.div
            className='mt-16'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Card className='border-accent2/20 bg-light-100/50 dark:border-accent/20 dark:bg-dark-700/50'>
              <CardHeader>
                <CardTitle className='text-center text-xl text-dark-800 dark:text-light-300'>
                  Other Ways to Get Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6 sm:grid-cols-3'>
                  <div className='text-center'>
                    <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent2/10 dark:bg-accent/10'>
                      <HelpCircle className='h-6 w-6 text-accent2 dark:text-accent' />
                    </div>
                    <h3 className='font-medium text-dark-800 dark:text-light-300'>Browse FAQ</h3>
                    <p className='mt-1 text-sm text-dark-600 dark:text-light-400'>
                      Find quick answers to common questions
                    </p>
                    <Button asChild variant='outline' size='sm' className='mt-3'>
                      <a href='/help-center/faq'>Visit FAQ</a>
                    </Button>
                  </div>

                  <div className='text-center'>
                    <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent2/10 dark:bg-accent/10'>
                      <MessageSquare className='h-6 w-6 text-accent2 dark:text-accent' />
                    </div>
                    <h3 className='font-medium text-dark-800 dark:text-light-300'>Join Discord</h3>
                    <p className='mt-1 text-sm text-dark-600 dark:text-light-400'>
                      Get help from our community
                    </p>
                    <Button asChild variant='outline' size='sm' className='mt-3'>
                      <a
                        href='https://discord.gg/mWvD5HHfTz'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        Join Discord
                      </a>
                    </Button>
                  </div>

                  <div className='text-center'>
                    <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent2/10 dark:bg-accent/10'>
                      <Send className='h-6 w-6 text-accent2 dark:text-accent' />
                    </div>
                    <h3 className='font-medium text-dark-800 dark:text-light-300'>Direct Email</h3>
                    <p className='mt-1 text-sm text-dark-600 dark:text-light-400'>
                      Email us directly for general inquiries
                    </p>
                    <Button asChild variant='outline' size='sm' className='mt-3'>
                      <a href='mailto:support@docubot.app'>Send Email</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SupportTicketPage;
