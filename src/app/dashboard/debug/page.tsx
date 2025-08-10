'use client';

import React, { useState } from 'react';
import { runDiagnostics, testOpenAIConnection, testPineconeConnection, healthCheck } from '@/actions/diagnostics';

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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">System Diagnostics</h1>
      
      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Running Tests...' : 'Run Diagnostics'}
        </button>
      </div>

      {diagnostics && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Diagnostic Results</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(diagnostics, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Troubleshooting Steps</h2>
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
              If you're seeing "Failed to fetch" errors:
            </h3>
            <ul className="list-disc list-inside mt-2 text-yellow-700 dark:text-yellow-300">
              <li>Check your internet connection</li>
              <li>Verify API keys are properly configured</li>
              <li>Try uploading a smaller file (under 5MB)</li>
              <li>Check browser console for detailed error messages</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">
              Common Solutions:
            </h3>
            <ul className="list-disc list-inside mt-2 text-blue-700 dark:text-blue-300">
              <li>Refresh the page and try again</li>
              <li>Clear browser cache and cookies</li>
              <li>Try a different browser or incognito mode</li>
              <li>Check if the file is corrupted or password-protected</li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200">
              File Requirements:
            </h3>
            <ul className="list-disc list-inside mt-2 text-green-700 dark:text-green-300">
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
