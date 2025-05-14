import { ClerkLoaded } from '@clerk/nextjs';
import Header from '@/components/Global/Header';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkLoaded>
      <div className='flex min-h-screen flex-col'>
        <Header />
        <main className='flex-1 overflow-hidden bg-gradient-to-br from-accent2/40 to-accent/40 dark:from-accent3/30 dark:to-accent4/30'>
          {children}
        </main>
      </div>
    </ClerkLoaded>
  );
};

export default DashboardLayout;
