'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Loader2, User, AtSign, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { completeUserOnboarding } from '@/actions/initializeUser';
import { validateUsername, generateUsernameSuggestions } from '@/actions/validateUsername';

interface OnboardingFormProps {
  missingFields?: string[];
  onComplete?: () => void;
}

export default function OnboardingForm({ missingFields = [], onComplete }: OnboardingFormProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);

  // Check if field is required
  const isRequired = (field: string) => missingFields.includes(field);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Special handling for username validation
    if (field === 'username') {
      setUsernameStatus('idle');
      setUsernameSuggestions([]);
    }
  };

  // Validate username
  const handleUsernameValidation = async (username: string) => {
    if (!username) return;

    setUsernameStatus('checking');
    try {
      const validation = await validateUsername(username);
      
      if (validation.isValid && validation.isAvailable) {
        setUsernameStatus('valid');
        setErrors(prev => ({ ...prev, username: '' }));
      } else {
        setUsernameStatus('invalid');
        setErrors(prev => ({ ...prev, username: validation.message || 'Username is not available' }));
        
        // Generate suggestions if username is taken
        if (validation.isValid && !validation.isAvailable) {
          const suggestions = await generateUsernameSuggestions(username);
          setUsernameSuggestions(suggestions);
        }
      }
    } catch (error) {
      setUsernameStatus('invalid');
      setErrors(prev => ({ ...prev, username: 'Error validating username' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      return;
    }

    // Validate required fields
    const newErrors: Record<string, string> = {};
    
    if (isRequired('firstName') && !formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (isRequired('lastName') && !formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (isRequired('username') && !formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If username is provided, ensure it's valid
    if (formData.username && usernameStatus !== 'valid') {
      await handleUsernameValidation(formData.username);
      return;
    }

    startTransition(async () => {
      try {
        const result = await completeUserOnboarding(user.id, {
          firstName: formData.firstName.trim() || undefined,
          lastName: formData.lastName.trim() || undefined,
          username: formData.username.trim() || undefined,
        });

        if (result.success) {
          onComplete?.();
          router.push('/dashboard');
        } else {

          if (result.missingFields) {
            const fieldErrors: Record<string, string> = {};
            result.missingFields.forEach(field => {
              fieldErrors[field] = `${field} is required`;
            });
            setErrors(fieldErrors);
          }
        }
      } catch (error) {
        console.error('Onboarding error:', error);

      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent2/40 to-accent/40 dark:from-accent3/30 dark:to-accent4/30 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-light-300/50 bg-white/80 backdrop-blur-sm dark:border-dark-600/50 dark:bg-dark-800/80">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
            <CardDescription>
              Please provide the following information to get started with DocuBot
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              {isRequired('firstName') && (
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>
              )}

              {/* Last Name */}
              {isRequired('lastName') && (
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              )}

              {/* Username */}
              {isRequired('username') && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <AtSign className="h-4 w-4" />
                    Username *
                  </Label>
                  <div className="relative">
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      onBlur={() => formData.username && handleUsernameValidation(formData.username)}
                      placeholder="Choose a unique username"
                      className={errors.username ? 'border-red-500' : usernameStatus === 'valid' ? 'border-green-500' : ''}
                    />
                    {usernameStatus === 'checking' && (
                      <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />
                    )}
                    {usernameStatus === 'valid' && (
                      <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                    )}
                    {usernameStatus === 'invalid' && (
                      <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username}</p>
                  )}
                  
                  {/* Username suggestions */}
                  {usernameSuggestions.length > 0 && (
                    <Alert>
                      <AlertDescription>
                        <p className="mb-2">Try these available usernames:</p>
                        <div className="flex flex-wrap gap-2">
                          {usernameSuggestions.map((suggestion) => (
                            <Button
                              key={suggestion}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                handleInputChange('username', suggestion);
                                setUsernameStatus('valid');
                                setUsernameSuggestions([]);
                              }}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isPending || usernameStatus === 'checking'}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up your profile...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
