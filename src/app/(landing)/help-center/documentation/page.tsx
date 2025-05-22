// src/app/(landing)/help-center/documentation/page.tsx
import { Suspense } from 'react';
import DocsPageClient from '@/components/docs/DocsPage';

export const metadata = {
  title: 'DocuBot Documentation',
  description:
    'Comprehensive guides and documentation for DocuBot - Learn how to upload documents, chat with PDFs, analyze code repositories, and more.',
};

// Loading component for Suspense fallback
function DocsLoading() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-accent2/20 to-accent/20 dark:from-accent3/20 dark:to-accent4/20'>
      <div className='h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent dark:border-accent3'></div>
      <p className='mt-4 text-dark-700 dark:text-light-300'>Loading documentation...</p>
    </div>
  );
}

export default function DocumentationPage() {
  return (
    <Suspense fallback={<DocsLoading />}>
      <DocsPageClient />
    </Suspense>
  );
}
