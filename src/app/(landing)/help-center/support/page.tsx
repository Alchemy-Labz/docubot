'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  HelpCircle,
  Clock,
  MessageSquare,
  Users,
  Bug,
  CreditCard,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
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
import Footer from '@/components/Global/Footer';
import { submitSupportTicket, type SupportTicketData } from '@/lib/firebase/contactSupport';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  category?: string;
  priority?: string;
  message?: string;
}

const categories = [
  {
    value: 'technical',
    label: 'Technical Issue',
    icon: <Bug className='h-4 w-4' />,
    description: 'App bugs, upload issues, or functionality problems',
  },
  {
    value: 'billing',
    label: 'Billing Inquiry',
    icon: <CreditCard className='h-4 w-4' />,
    description: 'Payment, subscription, or pricing questions',
  },
  {
    value: 'feature',
    label: 'Feature Request',
    icon: <Lightbulb className='h-4 w-4' />,
    description: 'Suggestions for new features or improvements',
  },
  {
    value: 'other',
    label: 'Other',
    icon: <HelpCircle className='h-4 w-4' />,
    description: 'General questions or other inquiries',
  },
];

const priorities = [
  {
    value: 'low',
    label: 'Low Priority',
    description: 'General question or minor issue',
    color: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    value: 'medium',
    label: 'Medium Priority',
    description: 'Issue affecting some functionality',
    color: 'text-amber-600 dark:text-amber-400',
  },
  {
    value: 'high',
    label: 'High Priority',
    description: 'Critical issue preventing app use',
    color: 'text-red-600 dark:text-red-400',
  },
];

const SupportTicketPage: React.FC = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState<SupportTicketData>({
    name: user?.fullName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    subject: '',
    category: 'technical',
    priority: 'medium',
    message: '',
    userId: user?.id || undefined,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string>('');

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (name: keyof SupportTicketData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user makes selection
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

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

    if (!formData.priority) {
      newErrors.priority = 'Please select a priority level';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Please provide more details (at least 20 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitSupportTicket(formData);

      if (result.success && result.ticketId) {
        setTicketId(result.ticketId);
        setIsSubmitted(true);
        toast.success('Support ticket created successfully!');
      } else {
        toast.error(result.error || 'Failed to create support ticket. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories.find((cat) => cat.value === formData.category);
  const selectedPriority = priorities.find((pri) => pri.value === formData.priority);

  if (isSubmitted) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-accent2/20 to-accent/20 dark:from-accent3/20 dark:to-accent4/20'>
        <motion.div
          className='mx-auto max-w-lg text-center'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='rounded-full bg-emerald-100 p-6 dark:bg-emerald-900/30'>
            <CheckCircle className='mx-auto h-16 w-16 text-emerald-600 dark:text-emerald-400' />
          </div>
          <h1 className='mt-6 text-2xl font-bold text-dark-800 dark:text-light-300'>
            Support Ticket Created!
          </h1>
          <div className='mt-4 rounded-lg border border-accent2/20 bg-light-100/80 p-4 dark:border-accent/20 dark:bg-dark-700/80'>
            <p className='text-sm text-dark-600 dark:text-light-400'>Your ticket ID:</p>
            <p className='font-mono text-lg font-semibold text-accent2 dark:text-accent'>
              {ticketId}
            </p>
          </div>
          <p className='mt-4 text-dark-600 dark:text-light-400'>
            We&apos;ve received your support request and will respond according to the priority
            level you selected. You&apos;ll receive email updates on the progress.
          </p>
          <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center'>
            <Button
              asChild
              className='bg-accent2 hover:bg-accent2/90 dark:bg-accent dark:hover:bg-accent/90'
            >
              <a href='/help-center'>Browse Help Center</a>
            </Button>
            <Button variant='outline' asChild>
              <a href='/dashboard'>Back to Dashboard</a>
            </Button>
          </div>
        </motion.div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-br from-accent2/20 to-accent/20 dark:from-accent3/20 dark:to-accent4/20'>
      <div className='mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        {/* Header */}
        <motion.div className='text-center' initial='hidden' animate='visible' variants={fadeIn}>
          <h1 className='text-4xl font-extrabold tracking-tight text-dark-800 dark:text-light-300 sm:text-5xl'>
            Create Support Ticket
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-xl text-dark-600 dark:text-light-400'>
            Describe your issue and we&apos;ll help you resolve it as quickly as possible.
          </p>
        </motion.div>

        <div className='mt-16 grid gap-16 lg:grid-cols-3'>
          {/* Sidebar Information */}
          <motion.div
            className='lg:col-span-1'
            initial='hidden'
            animate='visible'
            variants={staggerContainer}
          >
            <h2 className='text-2xl font-bold text-dark-800 dark:text-light-300'>
              Before You Submit
            </h2>
            <div className='mt-6 space-y-6'>
              <motion.div
                variants={fadeIn}
                className='rounded-lg border border-accent2/20 bg-light-100/80 p-6 dark:border-accent/20 dark:bg-dark-700/80'
              >
                <div className='flex items-center space-x-3'>
                  <HelpCircle className='h-6 w-6 text-accent2 dark:text-accent' />
                  <h3 className='text-lg font-semibold text-dark-800 dark:text-light-300'>
                    Check our Help Center
                  </h3>
                </div>
                <p className='mt-3 text-dark-600 dark:text-light-400'>
                  Many common questions are already answered in our FAQ and user guide.
                </p>
                <Button variant='outline' size='sm' asChild className='mt-4'>
                  <a href='/help-center'>
                    Browse Help Center <ArrowRight className='ml-2 h-4 w-4' />
                  </a>
                </Button>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className='rounded-lg border border-accent2/20 bg-light-100/80 p-6 dark:border-accent/20 dark:bg-dark-700/80'
              >
                <div className='flex items-center space-x-3'>
                  <Clock className='h-6 w-6 text-accent2 dark:text-accent' />
                  <h3 className='text-lg font-semibold text-dark-800 dark:text-light-300'>
                    Response Times
                  </h3>
                </div>
                <div className='mt-3 space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-emerald-600 dark:text-emerald-400'>Low Priority:</span>
                    <span className='text-dark-800 dark:text-light-300'>3-5 business days</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-amber-600 dark:text-amber-400'>Medium Priority:</span>
                    <span className='text-dark-800 dark:text-light-300'>1-2 business days</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-red-600 dark:text-red-400'>High Priority:</span>
                    <span className='text-dark-800 dark:text-light-300'>Within 24 hours</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className='rounded-lg border border-accent2/20 bg-light-100/80 p-6 dark:border-accent/20 dark:bg-dark-700/80'
              >
                <div className='flex items-center space-x-3'>
                  <MessageSquare className='h-6 w-6 text-accent2 dark:text-accent' />
                  <h3 className='text-lg font-semibold text-dark-800 dark:text-light-300'>
                    Tips for Better Support
                  </h3>
                </div>
                <ul className='mt-3 space-y-2 text-sm text-dark-600 dark:text-light-400'>
                  <li className='flex items-start'>
                    <span className='mr-2'>•</span>
                    Include specific error messages
                  </li>
                  <li className='flex items-start'>
                    <span className='mr-2'>•</span>
                    Describe steps to reproduce the issue
                  </li>
                  <li className='flex items-start'>
                    <span className='mr-2'>•</span>
                    Mention your browser and device type
                  </li>
                  <li className='flex items-start'>
                    <span className='mr-2'>•</span>
                    Attach screenshots if helpful
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* Support Form */}
          <motion.div
            className='lg:col-span-2'
            initial='hidden'
            animate='visible'
            variants={fadeIn}
          >
            <form
              onSubmit={handleSubmit}
              className='rounded-lg border border-accent2/20 bg-light-100/80 p-8 shadow-lg dark:border-accent/20 dark:bg-dark-700/80'
            >
              <h2 className='text-2xl font-bold text-dark-800 dark:text-light-300'>
                Support Ticket Details
              </h2>

              <div className='mt-8 space-y-6'>
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
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id='name-error' className='text-sm text-red-600'>
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>
                      Email <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'border-red-500' : ''}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id='email-error' className='text-sm text-red-600'>
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='subject'>
                    Subject <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='subject'
                    name='subject'
                    type='text'
                    placeholder='Brief description of your issue'
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={errors.subject ? 'border-red-500' : ''}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                  />
                  {errors.subject && (
                    <p id='subject-error' className='text-sm text-red-600'>
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div className='grid gap-6 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='category'>
                      Category <span className='text-red-500'>*</span>
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange('category', value as SupportTicketData['category'])
                      }
                      defaultValue={formData.category}
                    >
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder='Select a category' />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className='flex items-center space-x-2'>
                              {category.icon}
                              <span>{category.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCategory && (
                      <p className='text-xs text-dark-600 dark:text-light-400'>
                        {selectedCategory.description}
                      </p>
                    )}
                    {errors.category && <p className='text-sm text-red-600'>{errors.category}</p>}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='priority'>
                      Priority <span className='text-red-500'>*</span>
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange('priority', value as SupportTicketData['priority'])
                      }
                      defaultValue={formData.priority}
                    >
                      <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
                        <SelectValue placeholder='Select priority' />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <div className='flex items-center space-x-2'>
                              <div
                                className={`h-2 w-2 rounded-full ${priority.color.replace('text-', 'bg-')}`}
                              />
                              <span>{priority.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedPriority && (
                      <p className={`text-xs ${selectedPriority.color}`}>
                        {selectedPriority.description}
                      </p>
                    )}
                    {errors.priority && <p className='text-sm text-red-600'>{errors.priority}</p>}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='message'>
                    Detailed Description <span className='text-red-500'>*</span>
                  </Label>
                  <Textarea
                    id='message'
                    name='message'
                    rows={8}
                    placeholder='Please provide as much detail as possible about your issue. Include any error messages, steps to reproduce the problem, and what you expected to happen.'
                    value={formData.message}
                    onChange={handleInputChange}
                    className={errors.message ? 'border-red-500' : ''}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  <div className='flex justify-between text-xs text-dark-600 dark:text-light-400'>
                    <span>{formData.message.length} characters</span>
                    <span>Minimum 20 characters</span>
                  </div>
                  {errors.message && (
                    <p id='message-error' className='text-sm text-red-600'>
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className='flex items-start space-x-3 rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20'>
                  <AlertTriangle className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                  <div className='text-sm'>
                    <p className='font-medium text-amber-800 dark:text-amber-200'>
                      Important Notice
                    </p>
                    <p className='mt-1 text-amber-700 dark:text-amber-300'>
                      Please do not include sensitive information like passwords, credit card
                      numbers, or personal documents in your message.
                    </p>
                  </div>
                </div>

                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full bg-accent2 hover:bg-accent2/90 dark:bg-accent dark:hover:bg-accent/90'
                >
                  {isSubmitting ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <Send className='mr-2 h-4 w-4' />
                  )}
                  {isSubmitting ? 'Creating Ticket...' : 'Create Support Ticket'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SupportTicketPage;
