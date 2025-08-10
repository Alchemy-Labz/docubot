'use client';

import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import Header from '@/components/Global/Header';
import { UserInitializationGuard } from '@/components/Auth/UserInitializationGuard';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ClerkLoading>
        <div className='flex min-h-screen items-center justify-center' suppressHydrationWarning>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-accent'></div>
            <p>Loading...</p>
          </div>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <UserInitializationGuard>
          <div className='flex min-h-screen flex-col'>
            <Header />
            <main className='flex-1 overflow-hidden bg-gradient-to-br from-accent2/40 to-accent/40 dark:from-accent3/30 dark:to-accent4/30'>
              {children}
              {/* <FixAccountButton /> */}
            </main>
          </div>
        </UserInitializationGuard>
      </ClerkLoaded>
    </>
  );
};

export default DashboardLayout;
