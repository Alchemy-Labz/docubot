'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  MessageSquare,
  Users,
  Building2,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Footer from '@/components/Global/Footer';
import { submitContactForm, type ContactFormData } from '@/lib/firebase/contactSupport';
import toast from 'react-hot-toast';

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    contactMethod: 'email',
    marketingOptIn: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      marketingOptIn: checked,
    }));
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

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
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
      const result = await submitContactForm(formData);

      if (result.success) {
        setIsSubmitted(true);
        toast.success('Thank you! Your message has been sent successfully.');
      } else {
        toast.error(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className='h-6 w-6' />,
      title: 'Email',
      value: 'hello@docubot.app',
      description: 'Send us an email anytime',
      action: 'mailto:hello@docubot.app',
    },
    {
      icon: <MessageSquare className='h-6 w-6' />,
      title: 'Support',
      value: 'support@docubot.app',
      description: 'Technical support and assistance',
      action: 'mailto:support@docubot.app',
    },
    {
      icon: <Building2 className='h-6 w-6' />,
      title: 'Business',
      value: 'business@docubot.app',
      description: 'Partnership and business inquiries',
      action: 'mailto:business@docubot.app',
    },
    {
      icon: <Globe className='h-6 w-6' />,
      title: 'Address',
      value: 'Remote First',
      description: 'Serving clients worldwide',
      action: null,
    },
  ];

  const faqs = [
    {
      question: 'How quickly do you respond to inquiries?',
      answer: 'We typically respond to all inquiries within 24 hours during business days.',
    },
    {
      question: 'Do you offer phone support?',
      answer:
        'Currently, we provide support primarily through email and our help center. Phone support is available for enterprise customers.',
    },
    {
      question: 'Can I schedule a demo?',
      answer:
        'Yes! Reach out to us through this form or email business@docubot.app to schedule a personalized demo.',
    },
    {
      question: 'What information should I include in my message?',
      answer:
        'Please include as much detail as possible about your inquiry, including any relevant account information or specific questions you have.',
    },
  ];

  if (isSubmitted) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-accent2/20 to-accent/20 dark:from-accent3/20 dark:to-accent4/20'>
        <motion.div
          className='mx-auto max-w-md text-center'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
        >
          <div className='rounded-full bg-emerald-100 p-6 dark:bg-emerald-900/30'>
            <CheckCircle className='mx-auto h-16 w-16 text-emerald-600 dark:text-emerald-400' />
          </div>
          <h1 className='mt-6 text-2xl font-bold text-dark-800 dark:text-light-300'>
            Message Sent Successfully!
          </h1>
          <p className='mt-4 text-dark-600 dark:text-light-400'>
            Thank you for reaching out. We&apos;ll get back to you within 24 hours.
          </p>
          <Button
            asChild
            className='mt-6 bg-accent2 hover:bg-accent2/90 dark:bg-accent dark:hover:bg-accent/90'
          >
            <a href='/'>Return to Home</a>
          </Button>
        </motion.div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-br from-accent2/20 to-accent/20 dark:from-accent3/20 dark:to-accent4/20'>
      <div className='mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        {/* Header */}
        <motion.div className='text-center' initial='hidden' animate='visible' variants={fadeIn}>
          <h1 className='text-4xl font-extrabold tracking-tight text-dark-800 dark:text-light-300 sm:text-5xl'>
            Get in Touch
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-xl text-dark-600 dark:text-light-400'>
            We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as
            possible.
          </p>
        </motion.div>

        <div className='mt-16 grid gap-16 lg:grid-cols-2 lg:gap-24'>
          {/* Contact Information */}
          <motion.div initial='hidden' animate='visible' variants={staggerContainer}>
            <h2 className='text-2xl font-bold text-dark-800 dark:text-light-300'>
              Contact Information
            </h2>
            <p className='mt-4 text-dark-600 dark:text-light-400'>
              Choose the best way to reach us for your specific needs.
            </p>

            <div className='mt-8 space-y-6'>
              {contactInfo.map((info, index) => (
                <motion.div key={index} variants={fadeIn} className='flex items-start space-x-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-accent2/10 text-accent2 dark:bg-accent/10 dark:text-accent'>
                    {info.icon}
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-dark-800 dark:text-light-300'>
                      {info.title}
                    </h3>
                    {info.action ? (
                      <a
                        href={info.action}
                        className='mt-1 text-accent2 hover:text-accent2/80 dark:text-accent dark:hover:text-accent/80'
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className='mt-1 text-dark-700 dark:text-light-300'>{info.value}</p>
                    )}
                    <p className='mt-1 text-sm text-dark-600 dark:text-light-400'>
                      {info.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Business Hours */}
            <motion.div
              variants={fadeIn}
              className='mt-12 rounded-lg border border-accent2/20 bg-light-100/80 p-6 dark:border-accent/20 dark:bg-dark-700/80'
            >
              <div className='flex items-center space-x-3'>
                <Clock className='h-6 w-6 text-accent2 dark:text-accent' />
                <h3 className='text-lg font-semibold text-dark-800 dark:text-light-300'>
                  Response Times
                </h3>
              </div>
              <div className='mt-4 space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-dark-600 dark:text-light-400'>Email inquiries:</span>
                  <span className='text-dark-800 dark:text-light-300'>Within 24 hours</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-dark-600 dark:text-light-400'>Support tickets:</span>
                  <span className='text-dark-800 dark:text-light-300'>1-3 business days</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-dark-600 dark:text-light-400'>Enterprise inquiries:</span>
                  <span className='text-dark-800 dark:text-light-300'>Same day</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial='hidden' animate='visible' variants={fadeIn}>
            <form
              onSubmit={handleSubmit}
              className='rounded-lg border border-accent2/20 bg-light-100/80 p-8 shadow-lg dark:border-accent/20 dark:bg-dark-700/80'
            >
              <h2 className='text-2xl font-bold text-dark-800 dark:text-light-300'>
                Send us a Message
              </h2>
              <p className='mt-2 text-dark-600 dark:text-light-400'>
                Fill out the form below and we&apos;ll get back to you soon.
              </p>

              <div className='mt-8 space-y-6'>
                <div className='grid gap-6 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>
                      Name <span className='text-red-500'>*</span>
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

                <div className='grid gap-6 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='company'>Company (Optional)</Label>
                    <Input
                      id='company'
                      name='company'
                      type='text'
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='phone'>Phone (Optional)</Label>
                    <Input
                      id='phone'
                      name='phone'
                      type='tel'
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
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

                <div className='space-y-2'>
                  <Label htmlFor='contactMethod'>Preferred Contact Method</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange('contactMethod', value as 'email' | 'phone' | 'both')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select contact method' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='email'>Email</SelectItem>
                      <SelectItem value='phone'>Phone</SelectItem>
                      <SelectItem value='both'>Both Email and Phone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='message'>
                    Message <span className='text-red-500'>*</span>
                  </Label>
                  <Textarea
                    id='message'
                    name='message'
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={errors.message ? 'border-red-500' : ''}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p id='message-error' className='text-sm text-red-600'>
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className='flex items-start space-x-3'>
                  <Checkbox
                    id='marketing'
                    checked={formData.marketingOptIn}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <div className='text-sm'>
                    <Label htmlFor='marketing' className='cursor-pointer'>
                      I would like to receive updates about DocuBot features and news.
                    </Label>
                    <p className='text-dark-600 dark:text-light-400'>
                      You can unsubscribe at any time.
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
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          className='mt-24'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className='text-center text-3xl font-bold text-dark-800 dark:text-light-300'>
            Frequently Asked Questions
          </h2>
          <div className='mt-12 grid gap-8 md:grid-cols-2'>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className='rounded-lg border border-accent2/20 bg-light-100/50 p-6 dark:border-accent/20 dark:bg-dark-700/50'
              >
                <h3 className='text-lg font-semibold text-dark-800 dark:text-light-300'>
                  {faq.question}
                </h3>
                <p className='mt-3 text-dark-600 dark:text-light-400'>{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
