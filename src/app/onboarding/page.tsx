'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import OnboardingForm from '@/components/Onboarding/OnboardingForm';
import { useFirebaseAuth } from '@/providers/FirebaseContext';

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const { isAuthenticated } = useFirebaseAuth();
  const router = useRouter();
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push('/sign-in');
      return;
    }

    // Check what fields are missing
    const missing: string[] = [];
    
    if (!user.firstName) missing.push('firstName');
    if (!user.lastName) missing.push('lastName');
    if (!user.username) missing.push('username');

    setMissingFields(missing);
    setIsLoading(false);

    // If no fields are missing, redirect to dashboard
    if (missing.length === 0) {
      router.push('/dashboard');
    }
  }, [user, isLoaded, router]);

  const handleOnboardingComplete = () => {
    router.push('/dashboard');
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to sign-in
  }

  return (
    <OnboardingForm 
      missingFields={missingFields} 
      onComplete={handleOnboardingComplete}
    />
  );
}
