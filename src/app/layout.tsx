// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from '@sentry/nextjs';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { FirebaseProvider } from '@/providers/FirebaseContext';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleTagManager } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DocuBot',
  description: 'Chat with your documents and code repositories',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-light-500 dark:bg-dark-500`}
        suppressHydrationWarning
      >
        {process.env.NODE_ENV === 'production' && process.env.GTM_ID && (
          <GoogleTagManager gtmId={process.env.GTM_ID} />
        )}
        <ErrorBoundary>
          <ClerkProvider
            dynamic
            appearance={{
              baseTheme: undefined, // Let it adapt to system theme
              variables: {
                colorPrimary: '#5029a6',
              },
            }}
            signInFallbackRedirectUrl='/dashboard'
            signUpFallbackRedirectUrl='/dashboard'
          >
            <FirebaseProvider>
              <ThemeProvider
                attribute='class'
                defaultTheme='system'
                enableSystem
                disableTransitionOnChange={false}
              >
                {children}
                <Toaster
                  position='bottom-right'
                  toastOptions={{
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
            </FirebaseProvider>
          </ClerkProvider>
          <Analytics />
          <SpeedInsights />
        </ErrorBoundary>
      </body>
    </html>
  );
}
