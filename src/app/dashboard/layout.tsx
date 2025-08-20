'use client';

import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import Header from '@/components/Global/Header';
import { UserInitializationGuard } from '@/components/Auth/UserInitializationGuard';
import { useThemeClasses } from '@/components/Global/ThemeAwareWrapper';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { getClasses } = useThemeClasses();

  return (
    <>
      <ClerkLoading>
        <div className='flex min-h-screen items-center justify-center' suppressHydrationWarning>
          <div className='text-center'>
            <div
              className={getClasses({
                base: 'mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2',
                business: 'border-primary',
                neon: 'border-accent',
              })}
            ></div>
            <p>Loading...</p>
          </div>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <UserInitializationGuard>
          <div className='flex min-h-screen flex-col'>
            <Header />
            <main
              className={getClasses({
                base: 'flex-1 overflow-hidden',
                business: 'bg-background',
                neon: 'bg-gradient-to-br from-accent2/40 to-accent/40',
              })}
            >
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
