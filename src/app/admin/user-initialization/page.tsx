'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle, Users, RefreshCw } from 'lucide-react';
import { migrateCurrentUser, getMigrationStatus, batchMigrateUsers } from '@/actions/migrateUsers';
import { validateUsername } from '@/actions/validateUsername';
import { initializeUser } from '@/actions/initializeUser';

export default function UserInitializationTestPage() {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);

  if (!isLoaded) {
    return (
      <div className='container mx-auto p-6'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-accent'></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Load migration status on component mount
  useEffect(() => {
    loadMigrationStatus();
  }, []);

  const loadMigrationStatus = async () => {
    try {
      const status = await getMigrationStatus();
      setMigrationStatus(status);
    } catch (error) {
      console.error('Error loading migration status:', error);
    }
  };

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setIsLoading(true);
    try {
      const startTime = Date.now();
      const result = await testFn();
      const endTime = Date.now();

      setTestResults((prev) => [
        ...prev,
        {
          name: testName,
          success: true,
          result,
          duration: endTime - startTime,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      setTestResults((prev) => [
        ...prev,
        {
          name: testName,
          success: false,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const testUsernameValidation = async () => {
    const testUsernames = [
      'test',
      'admin',
      'validusername123',
      'a',
      'verylongusernamethatexceedsthelimit',
    ];
    const results = [];

    for (const username of testUsernames) {
      const validation = await validateUsername(username);
      results.push({ username, validation });
    }

    return results;
  };

  const testUserInitialization = async () => {
    if (!user?.id) throw new Error('No user ID available');

    const result = await initializeUser(user.id, {
      email: user.primaryEmailAddress?.emailAddress,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      username: user.username || undefined,
      clerkId: user.id,
      isSignup: false,
    });

    return result;
  };

  const testCurrentUserMigration = async () => {
    const result = await migrateCurrentUser();
    await loadMigrationStatus(); // Refresh status after migration
    return result;
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  if (!user) {
    return (
      <div className='container mx-auto p-6'>
        <Alert>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Please sign in to access the user initialization test page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className='container mx-auto space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>User Initialization System Test</h1>
          <p className='text-muted-foreground'>
            Test and validate the comprehensive user initialization system
          </p>
        </div>
        <Button onClick={loadMigrationStatus} variant='outline'>
          <RefreshCw className='mr-2 h-4 w-4' />
          Refresh Status
        </Button>
      </div>

      {/* Migration Status */}
      {migrationStatus && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              Migration Status
            </CardTitle>
            <CardDescription>Overview of user migration progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold'>{migrationStatus.total}</div>
                <div className='text-sm text-muted-foreground'>Total Users</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-600'>{migrationStatus.migrated}</div>
                <div className='text-sm text-muted-foreground'>Migrated</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-orange-600'>
                  {migrationStatus.needsMigration}
                </div>
                <div className='text-sm text-muted-foreground'>Needs Migration</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600'>
                  {migrationStatus.needsOnboarding}
                </div>
                <div className='text-sm text-muted-foreground'>Needs Onboarding</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
          <CardDescription>
            Run various tests to validate the user initialization system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <Button
              onClick={() => runTest('Username Validation', testUsernameValidation)}
              disabled={isLoading}
              variant='outline'
            >
              {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
              Test Username Validation
            </Button>

            <Button
              onClick={() => runTest('User Initialization', testUserInitialization)}
              disabled={isLoading}
              variant='outline'
            >
              {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
              Test User Initialization
            </Button>

            <Button
              onClick={() => runTest('Current User Migration', testCurrentUserMigration)}
              disabled={isLoading}
              variant='outline'
            >
              {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
              Test User Migration
            </Button>

            <Button
              onClick={clearTestResults}
              variant='destructive'
              disabled={testResults.length === 0}
            >
              Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Results from the latest test runs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {testResults.map((result, index) => (
                <div key={index} className='rounded-lg border p-4'>
                  <div className='mb-2 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      {result.success ? (
                        <CheckCircle className='h-4 w-4 text-green-600' />
                      ) : (
                        <AlertCircle className='h-4 w-4 text-red-600' />
                      )}
                      <span className='font-medium'>{result.name}</span>
                      <Badge variant={result.success ? 'default' : 'destructive'}>
                        {result.success ? 'Success' : 'Failed'}
                      </Badge>
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {new Date(result.timestamp).toLocaleTimeString()}
                      {result.duration && ` (${result.duration}ms)`}
                    </div>
                  </div>

                  {result.success && result.result && (
                    <pre className='overflow-auto rounded bg-muted p-2 text-sm'>
                      {JSON.stringify(result.result, null, 2)}
                    </pre>
                  )}

                  {!result.success && result.error && (
                    <Alert variant='destructive'>
                      <AlertDescription>{result.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
