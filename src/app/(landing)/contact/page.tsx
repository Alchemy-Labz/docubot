'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  Users,
  Building,
  Loader2,
  AlertCircle,
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
import SocialLinks from '@/components/Global/SocialLinks';
import { addDoc, collection } from '@firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import toast from 'react-hot-toast';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  inquiryType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  inquiryType?: string;
  message?: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    inquiryType: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'sales', label: 'Sales & Partnerships' },
    { value: 'technical', label: 'Technical Questions' },
    { value: 'media', label: 'Media & Press' },
    { value: 'career', label: 'Career Opportunities' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
  ];

  const contactInfo = [
    {
      icon: <Mail className='h-6 w-6' />,
      title: 'Email',
      details: 'hello@docubot.app',
      description: 'Send us an email anytime',
    },
    {
      icon: <MessageSquare className='h-6 w-6' />,
      title: 'Live Chat',
      details: 'Available 24/7',
      description: 'Get instant support',
    },
    {
      icon: <Clock className='h-6 w-6' />,
      title: 'Response Time',
      details: 'Within 24 hours',
      description: 'We respond quickly',
    },
    {
      icon: <Users className='h-6 w-6' />,
      title: 'Community',
      details: 'Discord Server',
      description: 'Join our community',
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

    if (!formData.inquiryType) {
      newErrors.inquiryType = 'Please select an inquiry type';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
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

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, inquiryType: value }));
    if (errors.inquiryType) {
      setErrors((prev) => ({ ...prev, inquiryType: undefined }));
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
      await addDoc(collection(db, 'contact-submissions'), {
        ...formData,
        timestamp: new Date(),
        status: 'new',
        source: 'contact-page',
      });

      setIsSubmitted(true);
      toast.success("Message sent successfully! We'll get back to you soon.");

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          subject: '',
          inquiryType: '',
          message: '',
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please try again.');
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
              Get in Touch
            </h1>
            <p className='mx-auto mt-6 max-w-2xl text-xl text-dark-600 dark:text-light-400'>
              Have questions about DocuBot? We&apos;d love to hear from you. Send us a message and
              we&apos;ll respond as soon as possible.
            </p>
          </motion.div>

          <div className='mt-20 grid gap-12 lg:grid-cols-3'>
            {/* Contact Information */}
            <motion.div
              className='lg:col-span-1'
              initial='hidden'
              animate='visible'
              variants={staggerContainer}
            >
              <h2 className='text-2xl font-bold text-dark-800 dark:text-light-300'>
                Contact Information
              </h2>
              <p className='mt-3 text-lg text-dark-600 dark:text-light-400'>
                Choose the best way to reach us
              </p>

              <div className='mt-8 space-y-6'>
                {contactInfo.map((info, index) => (
                  <motion.div key={index} variants={fadeIn} className='flex items-start space-x-4'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-accent2/10 text-accent2 dark:bg-accent/10 dark:text-accent'>
                      {info.icon}
                    </div>
                    <div>
                      <h3 className='text-lg font-medium text-dark-800 dark:text-light-300'>
                        {info.title}
                      </h3>
                      <p className='text-accent2 dark:text-accent'>{info.details}</p>
                      <p className='text-sm text-dark-600 dark:text-light-400'>
                        {info.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div className='mt-12'>
                <h3 className='text-lg font-medium text-dark-800 dark:text-light-300'>
                  Follow Us
                </h3>
                <div className='mt-4'>
                  <SocialLinks />
                </div>
              </div>

              {/* Office Hours */}
              <Card className='mt-8 border-accent2/20 bg-light-100/80 dark:border-accent/20 dark:bg-dark-700/80'>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Building className='mr-2 h-5 w-5 text-accent2 dark:text-accent' />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-dark-600 dark:text-light-400'>Monday - Friday</span>
                      <span className='font-medium text-dark-800 dark:text-light-300'>
                        9:00 AM - 6:00 PM PST
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-dark-600 dark:text-light-400'>Weekend</span>
                      <span className='font-medium text-dark-800 dark:text-light-300'>
                        Emergency Support Only
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className='lg:col-span-2'
              initial='hidden'
              animate='visible'
              variants={fadeIn}
            >
              <Card className='border-accent2/20 bg-light-100/80 shadow-xl dark:border-accent/20 dark:bg-dark-700/80'>
                <CardHeader>
                  <CardTitle className='text-2xl text-dark-800 dark:text-light-300'>
                    Send us a Message
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
                        Message Sent Successfully!
                      </h3>
                      <p className='mt-2 text-dark-600 dark:text-light-400'>
                        Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className='space-y-6'>
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
                            Email <span className='text-red-500'>*</span>
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

                      <div className='grid gap-6 sm:grid-cols-2'>
                        <div className='space-y-2'>
                          <Label htmlFor='company'>Company</Label>
                          <Input
                            id='company'
                            name='company'
                            type='text'
                            value={formData.company}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='phone'>Phone</Label>
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

                      <div className='space-y-2'>
                        <Label htmlFor='inquiryType'>
                          Type of Inquiry <span className='text-red-500'>*</span>
                        </Label>
                        <Select onValueChange={handleSelectChange} disabled={isSubmitting}>
                          <SelectTrigger className={errors.inquiryType ? 'border-red-500' : ''}>
                            <SelectValue placeholder='Please select...' />
                          </SelectTrigger>
                          <SelectContent>
                            {inquiryTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.inquiryType && (
                          <div className='flex items-center text-sm text-red-500'>
                            <AlertCircle className='mr-1 h-4 w-4' />
                            {errors.inquiryType}
                          </div>
                        )}
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
                          disabled={isSubmitting}
                        />
                        {errors.subject && (
                          <div className='flex items-center text-sm text-red-500'>
                            <AlertCircle className='mr-1 h-4 w-4' />
                            {errors.subject}
                          </div>
                        )}
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
                          disabled={isSubmitting}
                          placeholder='Tell us about your inquiry...'
                        />
                        {errors.message && (
                          <div className='flex items-center text-sm text-red-500'>
                            <AlertCircle className='mr-1 h-4 w-4' />
                            {errors.message}
                          </div>
                        )}
                        <p className='text-sm text-dark-500 dark:text-light-500'>
                          {formData.message.length}/500 characters
                        </p>
                      </div>

                      <Button
                        type='submit'
                        className='w-full bg-accent2 hover:bg-accent2/90 dark:bg-accent dark:hover:bg-accent/90'
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className='mr-2 h-4 w-4' />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div
            className='mt-20'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-dark-800 dark:text-light-300'>
                Frequently Asked Questions
              </h2>
              <p className='mt-4 text-lg text-dark-600 dark:text-light-400'>
                Can&apos;t find what you&apos;re looking for?{' '}
                <a
                  href='/help-center/faq'
                  className='text-accent2 hover:underline dark:text-accent'
                >
                  Visit our FAQ page
                </a>
              </p>
            </div>

            <div className='mt-12 grid gap-8 lg:grid-cols-2'>
              {[
                {
                  question: 'How quickly do you respond to inquiries?',
                  answer:
                    'We aim to respond to all inquiries within 24 hours during business days. For urgent technical issues, our support team provides faster response times.',
                },
                {
                  question: 'Do you offer phone support?',
                  answer:
                    'Currently, we provide support primarily through email and our Discord community. Phone support is available for enterprise customers.',
                },
                {
                  question: 'Can I schedule a demo?',
                  answer:
                    "Yes! Contact our sales team to schedule a personalized demo of DocuBot's features and capabilities.",
                },
                {
                  question: 'Is there a reseller program?',
                  answer:
                    'We do offer partnership and reseller opportunities. Please contact our sales team to discuss potential collaborations.',
                },
              ].map((faq, index) => (
                <Card
                  key={index}
                  className='border-accent2/20 bg-light-100/50 dark:border-accent/20 dark:bg-dark-700/50'
                >
                  <CardHeader>
                    <CardTitle className='text-lg text-dark-800 dark:text-light-300'>
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-dark-600 dark:text-light-400'>{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
