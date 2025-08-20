'use client';

import React, { useState } from 'react';
import {
  runDiagnostics,
  testOpenAIConnection,
  testPineconeConnection,
  healthCheck,
} from '@/actions/diagnostics';

const DebugPage = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    try {
      const results = await healthCheck();
      setDiagnostics(results);
    } catch (error) {
      setDiagnostics({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto p-6'>
      <h1 className='mb-6 text-2xl font-bold'>System Diagnostics</h1>

      <div className='mb-6'>
        <button
          onClick={runTests}
          disabled={loading}
          className='rounded bg-primary px-4 py-2 font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
        >
          {loading ? 'Running Tests...' : 'Run Diagnostics'}
        </button>
      </div>

      {diagnostics && (
        <div className='rounded-lg bg-gray-100 p-4 dark:bg-gray-800'>
          <h2 className='mb-4 text-lg font-semibold'>Diagnostic Results</h2>
          <pre className='overflow-auto text-sm'>{JSON.stringify(diagnostics, null, 2)}</pre>
        </div>
      )}

      <div className='mt-8'>
        <h2 className='mb-4 text-lg font-semibold'>Troubleshooting Steps</h2>
        <div className='space-y-4'>
          <div className='rounded-lg border border-border bg-muted/50 p-4'>
            <h3 className='font-semibold text-foreground'>
              If you're seeing "Failed to fetch" errors:
            </h3>
            <ul className='mt-2 list-inside list-disc text-muted-foreground'>
              <li>Check your internet connection</li>
              <li>Verify API keys are properly configured</li>
              <li>Try uploading a smaller file (under 5MB)</li>
              <li>Check browser console for detailed error messages</li>
            </ul>
          </div>

          <div className='rounded-lg border border-border bg-secondary/50 p-4'>
            <h3 className='font-semibold text-foreground'>Common Solutions:</h3>
            <ul className='mt-2 list-inside list-disc text-muted-foreground'>
              <li>Refresh the page and try again</li>
              <li>Clear browser cache and cookies</li>
              <li>Try a different browser or incognito mode</li>
              <li>Check if the file is corrupted or password-protected</li>
            </ul>
          </div>

          <div className='rounded-lg border border-accent/20 bg-accent/10 p-4'>
            <h3 className='font-semibold text-foreground'>File Requirements:</h3>
            <ul className='mt-2 list-inside list-disc text-muted-foreground'>
              <li>Supported formats: PDF, TXT, MD, RTF</li>
              <li>Maximum size varies by plan (25MB/50MB/100MB)</li>
              <li>Files should not be password-protected</li>
              <li>Ensure files are not corrupted</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
