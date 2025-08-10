'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database,
  Download,
  Trash2
} from 'lucide-react';
import { getMigrationStats, getMigrationFailures, retryFailedMigration, cleanupMigrationData } from '@/actions/migrationAdmin';

interface MigrationStats {
  totalUsers: number;
  migratedUsers: number;
  pendingMigrations: number;
  failedMigrations: number;
  migrationRate: number;
  lastMigrationDate: string | null;
}

interface MigrationFailure {
  id: string;
  userId: string;
  error: string;
  timestamp: Date;
  type: string;
  clerkData?: any;
  retryCount?: number;
}

export default function MigrationDashboard() {
  const [stats, setStats] = useState<MigrationStats | null>(null);
  const [failures, setFailures] = useState<MigrationFailure[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [statsData, failuresData] = await Promise.all([
        getMigrationStats(),
        getMigrationFailures()
      ]);
      setStats(statsData);
      setFailures(failuresData);
    } catch (error) {
      console.error('Error fetching migration data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRetryMigration = async (userId: string) => {
    try {
      await retryFailedMigration(userId);
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error retrying migration:', error);
    }
  };

  const handleCleanupData = async () => {
    if (confirm('Are you sure you want to cleanup old migration data? This action cannot be undone.')) {
      try {
        await cleanupMigrationData();
        await fetchData(); // Refresh data
      } catch (error) {
        console.error('Error cleaning up data:', error);
      }
    }
  };

  const exportFailures = () => {
    const csvContent = [
      ['User ID', 'Error', 'Type', 'Timestamp', 'Retry Count'].join(','),
      ...failures.map(failure => [
        failure.userId,
        `"${failure.error.replace(/"/g, '""')}"`,
        failure.type,
        failure.timestamp.toISOString(),
        failure.retryCount || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-failures-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading migration dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Migration Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage user database migrations</p>
        </div>
        <Button onClick={fetchData} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Migrated</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.migratedUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.migrationRate.toFixed(1)}% complete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingMigrations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failedMigrations}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="failures" className="space-y-4">
        <TabsList>
          <TabsTrigger value="failures">Migration Failures</TabsTrigger>
          <TabsTrigger value="tools">Admin Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="failures" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Migration Failures</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportFailures} disabled={failures.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {failures.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">No Migration Failures</h3>
                  <p className="text-muted-foreground">All migrations completed successfully!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {failures.map((failure) => (
                <Card key={failure.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">User: {failure.userId}</CardTitle>
                        <CardDescription>
                          Failed at {failure.timestamp.toLocaleString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={failure.type === 'clerk_api_failure' ? 'destructive' : 'secondary'}>
                          {failure.type}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleRetryMigration(failure.userId)}
                        >
                          Retry
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Error:</strong> {failure.error}
                      </AlertDescription>
                    </Alert>
                    {failure.clerkData && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Clerk Data:</h4>
                        <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                          {JSON.stringify(failure.clerkData, null, 2)}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <h2 className="text-xl font-semibold">Admin Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Cleanup
                </CardTitle>
                <CardDescription>
                  Remove old migration logs and temporary data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={handleCleanupData}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cleanup Migration Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
