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
  title:
    'DocuBot - AI-Powered Document Analysis & Chat | Transform PDFs into Interactive Conversations',
  description:
    "Transform your PDFs into interactive conversations with DocuBot's AI-powered document analysis. Upload documents, ask questions in natural language, and get instant insights using advanced RAG technology. Free to start.",
  keywords:
    'AI document analysis, PDF chat, document AI, RAG technology, document intelligence, PDF analysis, AI chatbot, document processing, knowledge extraction, document search',
  authors: [{ name: 'DocuBot Team' }],
  creator: 'DocuBot',
  publisher: 'DocuBot',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://docubot.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'DocuBot - AI-Powered Document Analysis & Chat',
    description:
      'Transform your PDFs into interactive conversations with AI. Upload documents and get instant insights using natural language questions.',
    url: 'https://docubot.ai',
    siteName: 'DocuBot',
    images: [
      {
        url: '/screenshots/Tailwind.png',
        width: 1200,
        height: 630,
        alt: 'DocuBot AI Document Analysis Interface',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DocuBot - AI-Powered Document Analysis & Chat',
    description:
      'Transform your PDFs into interactive conversations with AI. Upload documents and get instant insights.',
    images: ['/screenshots/Tailwind.png'],
    creator: '@docubot',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
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
