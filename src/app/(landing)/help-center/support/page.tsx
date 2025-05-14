'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface FormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

const categories = [
  { value: 'technical', label: 'Technical Issue' },
  { value: 'billing', label: 'Billing Inquiry' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'other', label: 'Other' },
];

const SupportTicketPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      category: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission here (e.g., send data to API)
      console.log(formData);
      // You would typically send this data to your backend API
    }
  };

  return (
    <div className='flex flex-col items-center overflow-scroll overflow-x-hidden bg-gradient-to-br from-accent2/40 to-accent/40 dark:from-accent3/30 dark:to-accent4/30'>
      <div className='flex flex-col items-center justify-center space-y-15 p-2 lg:p-5 xl:p-12'>
        <div className='py-24 sm:py-32'>
          <div className='mx-auto max-w-4xl px-4 text-center sm:px-6'>
            <h2 className='text-base font-semibold leading-7 text-accent'>Support Ticket</h2>
            <p className='mt-2 text-4xl font-bold tracking-tight text-dark-800 dark:text-light-300'>
              How can we help you?
            </p>
          </div>
          <div className='mx-auto mt-12 max-w-2xl'>
            <form
              onSubmit={handleSubmit}
              className='space-y-6 rounded-lg border border-accent2/60 p-6 shadow-xl shadow-accent/20 dark:bg-dark-700/40'
            >
              <div className='space-y-2'>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' name='name' value={formData.name} onChange={handleChange} />
                {errors.name && <p className='text-sm text-red-600'>{errors.name}</p>}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className='text-sm text-red-600'>{errors.email}</p>}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='subject'>Subject</Label>
                <Input
                  id='subject'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                />
                {errors.subject && <p className='text-sm text-red-600'>{errors.subject}</p>}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='category'>Category</Label>
                <Select onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className='text-sm text-red-600'>{errors.category}</p>}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='message'>Message</Label>
                <Textarea
                  id='message'
                  name='message'
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                />
                {errors.message && <p className='text-sm text-red-600'>{errors.message}</p>}
              </div>
              <Button type='submit' className='cursor-pointer px-4 hover:bg-accent'>
                <Send className='mr-2 h-4 w-4 text-accent2' />
                Submit Ticket
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketPage;
