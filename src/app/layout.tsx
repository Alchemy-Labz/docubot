import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from '@sentry/nextjs';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Docubot',
  description: 'Chat with your documents and code repositories',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-light-500 dark:bg-dark-500`}
      >
        <ErrorBoundary>
          <ClerkProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster
                position='bottom-right'
                toastOptions={{
                  // className: 'border border-accent bg-dark-700 text-accent2',
                  success: {
                    iconTheme: {
                      primary: '#549412',
                      secondary: '#f4f6f7',
                    },
                  },
                  style: {
                    color: '#5029a6',
                    backgroundColor: '#808b96',
                  },
                }}
              />
            </ThemeProvider>
          </ClerkProvider>
          <Analytics />
          <SpeedInsights />
        </ErrorBoundary>
      </body>
    </html>
  );
}
