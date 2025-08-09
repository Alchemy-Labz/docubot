// src/app/(landing)/careers/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Briefcase,
  MapPin,
  Clock,
  Users,
  Code,
  Heart,
  Zap,
  Target,
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

interface CareerApplicationData {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  location: string;
  portfolioUrl: string;
  linkedinUrl: string;
  expectedSalary: string;
  startDate: string;
  coverLetter: string;
  resumeDescription: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  position?: string;
  experience?: string;
  coverLetter?: string;
}

const CareersPage: React.FC = () => {
  const [formData, setFormData] = useState<CareerApplicationData>({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    location: '',
    portfolioUrl: '',
    linkedinUrl: '',
    expectedSalary: '',
    startDate: '',
    coverLetter: '',
    resumeDescription: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const positions = [
    { value: 'frontend-developer', label: 'Frontend Developer' },
    { value: 'backend-developer', label: 'Backend Developer' },
    { value: 'fullstack-developer', label: 'Full Stack Developer' },
    { value: 'ai-engineer', label: 'AI Engineer' },
    { value: 'devops-engineer', label: 'DevOps Engineer' },
    { value: 'product-manager', label: 'Product Manager' },
    { value: 'ui-ux-designer', label: 'UI/UX Designer' },
    { value: 'marketing-specialist', label: 'Marketing Specialist' },
    { value: 'sales-representative', label: 'Sales Representative' },
    { value: 'customer-success', label: 'Customer Success Manager' },
    { value: 'data-scientist', label: 'Data Scientist' },
    { value: 'other', label: 'Other' },
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (2-5 years)' },
    { value: 'senior', label: 'Senior Level (5-8 years)' },
    { value: 'lead', label: 'Lead/Principal (8+ years)' },
    { value: 'executive', label: 'Executive/C-Level' },
  ];

  const benefits = [
    {
      icon: <Heart className='h-6 w-6' />,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness programs',
    },
    {
      icon: <Clock className='h-6 w-6' />,
      title: 'Flexible Schedule',
      description: 'Work-life balance with flexible hours and remote work options',
    },
    {
      icon: <Code className='h-6 w-6' />,
      title: 'Latest Technology',
      description: 'Work with cutting-edge AI technology and modern development tools',
    },
    {
      icon: <Users className='h-6 w-6' />,
      title: 'Amazing Team',
      description: 'Collaborate with talented professionals in a supportive environment',
    },
    {
      icon: <Target className='h-6 w-6' />,
      title: 'Growth Opportunities',
      description: 'Professional development, training, and career advancement paths',
    },
    {
      icon: <Zap className='h-6 w-6' />,
      title: 'Competitive Package',
      description: 'Competitive salary, equity options, and performance bonuses',
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

    if (!formData.position) {
      newErrors.position = 'Please select a position';
    }

    if (!formData.experience) {
      newErrors.experience = 'Please select your experience level';
    }

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    } else if (formData.coverLetter.trim().length < 50) {
      newErrors.coverLetter = 'Cover letter must be at least 50 characters long';
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
    if (name === 'position' && errors.position) {
      setErrors((prev) => ({ ...prev, position: undefined }));
    }
    if (name === 'experience' && errors.experience) {
      setErrors((prev) => ({ ...prev, experience: undefined }));
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
      await addDoc(collection(db, 'career-applications'), {
        ...formData,
        timestamp: new Date(),
        status: 'new',
        source: 'careers-page',
        applicationId: `APP-${Date.now()}-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, '0')}`,
      });

      setIsSubmitted(true);
      toast.success(
        "Application submitted successfully! We'll review it and get back to you soon."
      );

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          position: '',
          experience: '',
          location: '',
          portfolioUrl: '',
          linkedinUrl: '',
          expectedSalary: '',
          startDate: '',
          coverLetter: '',
          resumeDescription: '',
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting career application:', error);
      toast.error('Failed to submit application. Please try again.');
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
              Join Our Team
            </h1>
            <p className='mx-auto mt-6 max-w-2xl text-xl text-dark-600 dark:text-light-400'>
              Help us revolutionize how people interact with documents. We're looking for
              passionate individuals who want to shape the future of AI-powered document
              processing.
            </p>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            className='mt-20'
            initial='hidden'
            animate='visible'
            variants={staggerContainer}
          >
            <h2 className='mb-12 text-center text-3xl font-bold text-dark-800 dark:text-light-300'>
              Why Work at DocuBot?
            </h2>
            <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {benefits.map((benefit, index) => (
                <motion.div key={index} variants={fadeIn}>
                  <Card className='h-full bg-light-400/30 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
                    <CardContent className='p-6'>
                      <div className='mb-4 flex items-center space-x-4'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-accent2/10 text-accent2 dark:bg-accent/10 dark:text-accent'>
                          {benefit.icon}
                        </div>
                        <h3 className='text-lg font-semibold text-dark-800 dark:text-light-300'>
                          {benefit.title}
                        </h3>
                      </div>
                      <p className='text-dark-600 dark:text-light-400'>{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className='mt-20 grid gap-12 lg:grid-cols-3'>
            {/* Company Culture */}
            <motion.div
              className='lg:col-span-1'
              initial='hidden'
              animate='visible'
              variants={staggerContainer}
            >
              <h2 className='text-2xl font-bold text-dark-800 dark:text-light-300'>Our Culture</h2>
              <p className='mt-3 text-lg text-dark-600 dark:text-light-400'>
                We believe in innovation, collaboration, and continuous learning
              </p>

              <div className='mt-8 space-y-6'>
                <motion.div variants={fadeIn} className='flex items-start space-x-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-accent2/10 text-accent2 dark:bg-accent/10 dark:text-accent'>
                    <Users className='h-6 w-6' />
                  </div>
                  <div>
                    <h3 className='text-lg font-medium text-dark-800 dark:text-light-300'>
                      Remote-First
                    </h3>
                    <p className='text-accent2 dark:text-accent'>
                      Work from anywhere in the world
                    </p>
                    <p className='text-sm text-dark-600 dark:text-light-400'>
                      We're a distributed team that values flexibility and work-life balance
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={fadeIn} className='flex items-start space-x-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-accent2/10 text-accent2 dark:bg-accent/10 dark:text-accent'>
                    <Briefcase className='h-6 w-6' />
                  </div>
                  <div>
                    <h3 className='text-lg font-medium text-dark-800 dark:text-light-300'>
                      Ownership
                    </h3>
                    <p className='text-accent2 dark:text-accent'>
                      Take ownership of your projects
                    </p>
                    <p className='text-sm text-dark-600 dark:text-light-400'>
                      We encourage autonomy and give you the freedom to make decisions
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={fadeIn} className='flex items-start space-x-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-accent2/10 text-accent2 dark:bg-accent/10 dark:text-accent'>
                    <Zap className='h-6 w-6' />
                  </div>
                  <div>
                    <h3 className='text-lg font-medium text-dark-800 dark:text-light-300'>
                      Innovation
                    </h3>
                    <p className='text-accent2 dark:text-accent'>Push the boundaries of AI</p>
                    <p className='text-sm text-dark-600 dark:text-light-400'>
                      Work on cutting-edge technology that impacts millions of users
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Application Form */}
            <motion.div
              className='lg:col-span-2'
              initial='hidden'
              animate='visible'
              variants={fadeIn}
            >
              <Card className='bg-light-400/30 shadow-lg shadow-dark-900/30 ring-1 ring-accent2/80 drop-shadow-md dark:bg-dark-700/50 dark:ring-accent/80'>
                <CardHeader>
                  <CardTitle className='flex items-center space-x-2 text-dark-800 dark:text-light-300'>
                    <Briefcase className='h-6 w-6' />
                    <span>Apply Now</span>
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
                        Application Submitted!
                      </h3>
                      <p className='text-center text-dark-600 dark:text-light-400'>
                        Thank you for your interest in joining DocuBot. We'll review your
                        application and get back to you soon.
                      </p>
                    </motion.div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className='space-y-6'
                      aria-label='Career application form'
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
                          <Label htmlFor='position'>
                            Position <span className='text-red-500'>*</span>
                          </Label>
                          <Select
                            onValueChange={handleSelectChange('position')}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger className={errors.position ? 'border-red-500' : ''}>
                              <SelectValue placeholder='Select a position' />
                            </SelectTrigger>
                            <SelectContent>
                              {positions.map((position) => (
                                <SelectItem key={position.value} value={position.value}>
                                  {position.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.position && (
                            <div className='flex items-center text-sm text-red-500'>
                              <AlertCircle className='mr-1 h-4 w-4' />
                              {errors.position}
                            </div>
                          )}
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='experience'>
                            Experience Level <span className='text-red-500'>*</span>
                          </Label>
                          <Select
                            onValueChange={handleSelectChange('experience')}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger className={errors.experience ? 'border-red-500' : ''}>
                              <SelectValue placeholder='Select experience level' />
                            </SelectTrigger>
                            <SelectContent>
                              {experienceLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.experience && (
                            <div className='flex items-center text-sm text-red-500'>
                              <AlertCircle className='mr-1 h-4 w-4' />
                              {errors.experience}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='grid gap-6 sm:grid-cols-2'>
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

                        <div className='space-y-2'>
                          <Label htmlFor='location'>Preferred Location</Label>
                          <Input
                            id='location'
                            name='location'
                            type='text'
                            placeholder='e.g., Remote, New York, London'
                            value={formData.location}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className='grid gap-6 sm:grid-cols-2'>
                        <div className='space-y-2'>
                          <Label htmlFor='portfolioUrl'>Portfolio/Website URL</Label>
                          <Input
                            id='portfolioUrl'
                            name='portfolioUrl'
                            type='url'
                            placeholder='https://your-portfolio.com'
                            value={formData.portfolioUrl}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          />
                        </div>

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
                      </div>

                      <div className='grid gap-6 sm:grid-cols-2'>
                        <div className='space-y-2'>
                          <Label htmlFor='expectedSalary'>Expected Salary (Optional)</Label>
                          <Input
                            id='expectedSalary'
                            name='expectedSalary'
                            type='text'
                            placeholder='e.g., $70,000 - $90,000'
                            value={formData.expectedSalary}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='startDate'>Earliest Start Date</Label>
                          <Input
                            id='startDate'
                            name='startDate'
                            type='date'
                            value={formData.startDate}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='resumeDescription'>Resume/CV Summary</Label>
                        <Textarea
                          id='resumeDescription'
                          name='resumeDescription'
                          placeholder='Please provide a brief summary of your resume or paste the content here since file uploads are not available'
                          value={formData.resumeDescription}
                          onChange={handleInputChange}
                          rows={4}
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='coverLetter'>
                          Cover Letter <span className='text-red-500'>*</span>
                        </Label>
                        <Textarea
                          id='coverLetter'
                          name='coverLetter'
                          placeholder="Tell us why you're interested in this position and what makes you a great fit for our team..."
                          value={formData.coverLetter}
                          onChange={handleInputChange}
                          rows={6}
                          className={errors.coverLetter ? 'border-red-500' : ''}
                          disabled={isSubmitting}
                          aria-required='true'
                          aria-describedby={errors.coverLetter ? 'coverLetter-error' : undefined}
                        />
                        {errors.coverLetter && (
                          <div
                            id='coverLetter-error'
                            className='flex items-center text-sm text-red-500'
                          >
                            <AlertCircle className='mr-1 h-4 w-4' />
                            {errors.coverLetter}
                          </div>
                        )}
                      </div>

                      <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='w-full bg-accent text-light-100 hover:bg-accent2'
                        aria-label={
                          isSubmitting ? 'Submitting application...' : 'Submit application'
                        }
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' aria-hidden='true' />
                            Submitting Application...
                          </>
                        ) : (
                          <>
                            <Send className='mr-2 h-4 w-4' aria-hidden='true' />
                            Submit Application
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

export default CareersPage;
