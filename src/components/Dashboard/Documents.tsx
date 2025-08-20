'use client';

import { useEffect, useState } from 'react';
import PlaceholderDocument from './PlaceholderDocument';
import Document from './Document';
import { Button } from '../ui/button';
import { Grid3X3, List, Loader2 } from 'lucide-react';
import { collection, onSnapshot } from '@firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { useFirebaseAuth } from '@/providers/FirebaseContext';
import { useUser } from '@clerk/nextjs';
import { useThemeClasses } from '@/components/Global/ThemeAwareWrapper';

type ViewType = 'grid' | 'list';

interface DocumentData {
  id: string;
  name: string;
  size: number;
  downloadURL: string;
  type: string;
  fileIcon: string;
  createdAt?: Date;
}

const Documents = () => {
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useFirebaseAuth();
  const { user } = useUser();
  const { getClasses } = useThemeClasses();

  // Load view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem('documents-view') as ViewType;
    if (savedView && (savedView === 'grid' || savedView === 'list')) {
      setViewType(savedView);
    }
  }, []);

  // Save view preference to localStorage
  const handleViewChange = (newView: ViewType) => {
    setViewType(newView);
    localStorage.setItem('documents-view', newView);
  };

  // Set up real-time listener for documents
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    try {
      const documentsRef = collection(db, 'users', user.id, 'files');
      const unsubscribe = onSnapshot(
        documentsRef,
        (snapshot) => {
          if (!isMounted) return;

          const docs: DocumentData[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || 'Untitled',
              size: data.size || 0,
              downloadURL: data.downloadURL || '',
              type: data.type || '',
              fileIcon: data.fileIcon || '',
              createdAt: data.createdAt?.toDate() || new Date(),
            };
          });

          // Sort by creation date (newest first)
          docs.sort((a, b) => {
            const dateA = a.createdAt || new Date(0);
            const dateB = b.createdAt || new Date(0);
            return dateB.getTime() - dateA.getTime();
          });

          setDocuments(docs);
          setLoading(false);
          setError(null);
        },
        (err) => {
          if (!isMounted) return;
          console.error('Error fetching documents:', err);
          setError('Failed to load documents');
          setLoading(false);
        }
      );

      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch (err) {
      if (!isMounted) return;
      console.error('Error setting up documents listener:', err);
      setError('Failed to load documents');
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, authLoading, user?.id]);

  if (loading || authLoading) {
    return (
      <main
        className={getClasses({
          base: 'mx-auto flex max-w-7xl justify-center rounded-b-md p-8',
          business: 'border border-border bg-card',
          neon: 'bg-dark-700/40',
        })}
        aria-label='Loading documents'
      >
        <div className='flex items-center space-x-3'>
          <Loader2
            className={getClasses({
              base: 'h-6 w-6 animate-spin',
              business: 'text-primary',
              neon: 'text-accent',
            })}
            aria-hidden='true'
          />
          <span
            className={getClasses({
              base: '',
              business: 'text-muted-foreground',
              neon: 'text-light-300',
            })}
          >
            Loading your documents...
          </span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        className={getClasses({
          base: 'mx-auto flex max-w-7xl flex-col items-center justify-center rounded-b-md p-8',
          business: 'border border-border bg-card',
          neon: 'bg-dark-700/40',
        })}
        aria-labelledby='documents-error-heading'
      >
        <h2 id='documents-error-heading' className='sr-only'>
          Documents Error
        </h2>
        <div
          className='flex flex-col items-center justify-center p-6 text-light-300'
          role='alert'
          aria-live='assertive'
        >
          <h3 className='mb-2 text-lg font-medium'>Error Loading Documents</h3>
          <p className='mb-4 text-center'>{error}</p>
          <p className='text-sm text-light-400'>
            If this problem persists, please contact support.
          </p>
        </div>
        <div className='mt-6'>
          <PlaceholderDocument />
        </div>
      </main>
    );
  }

  return (
    <main
      className={getClasses({
        base: 'mx-auto max-w-7xl rounded-b-md',
        business: 'border border-border bg-card',
        neon: 'bg-dark-700/40',
      })}
      aria-labelledby='documents-heading'
    >
      <h2 id='documents-heading' className='sr-only'>
        Your Documents
      </h2>

      {/* View Toggle Controls */}
      <div
        className={getClasses({
          base: 'flex items-center justify-between border-b px-6 py-4',
          business: 'border-border',
          neon: 'border-light-600/20 dark:border-light-800/20',
        })}
      >
        <div className='flex items-center space-x-2'>
          <span
            className={getClasses({
              base: 'text-sm font-medium',
              business: 'text-muted-foreground',
              neon: 'text-light-300',
            })}
          >
            View:
          </span>
          <div
            className={getClasses({
              base: 'flex rounded-lg p-1',
              business: 'bg-muted',
              neon: 'bg-light-600/20 dark:bg-dark-600/40',
            })}
            role='tablist'
            aria-label='Document view options'
          >
            <Button
              variant={viewType === 'grid' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => handleViewChange('grid')}
              className={`flex items-center space-x-1 ${
                viewType === 'grid'
                  ? 'bg-accent text-light-100'
                  : 'text-light-400 hover:text-light-200'
              }`}
              role='tab'
              aria-selected={viewType === 'grid'}
              aria-controls='documents-content'
              aria-label='Grid view'
            >
              <Grid3X3 className='h-4 w-4' aria-hidden='true' />
              <span className='hidden sm:inline'>Grid</span>
            </Button>
            <Button
              variant={viewType === 'list' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => handleViewChange('list')}
              className={`flex items-center space-x-1 ${
                viewType === 'list'
                  ? 'bg-accent text-light-100'
                  : 'text-light-400 hover:text-light-200'
              }`}
              role='tab'
              aria-selected={viewType === 'list'}
              aria-controls='documents-content'
              aria-label='List view'
            >
              <List className='h-4 w-4' aria-hidden='true' />
              <span className='hidden sm:inline'>List</span>
            </Button>
          </div>
        </div>

        <div className='text-sm text-light-400'>
          {documents.length} {documents.length === 1 ? 'document' : 'documents'}
        </div>
      </div>

      {/* Documents Content */}
      <div
        id='documents-content'
        className='p-6'
        role='tabpanel'
        aria-labelledby='documents-heading'
      >
        {documents.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-light-300'>
            <p className='mb-2 text-lg'>You don&apos;t have any documents yet.</p>
            <p className='mb-8 text-sm text-light-400'>
              Upload your first document to get started with DocuBot.
            </p>
            <PlaceholderDocument />
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewType === 'grid' && (
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {documents.map((doc) => (
                  <Document
                    key={doc.id}
                    id={doc.id}
                    name={doc.name}
                    size={doc.size}
                    downloadURL={doc.downloadURL}
                    type={doc.type}
                    fileIcon={doc.fileIcon}
                    viewType={viewType}
                  />
                ))}
                <PlaceholderDocument />
              </div>
            )}

            {/* List View */}
            {viewType === 'list' && (
              <div className='space-y-3'>
                <div className='hidden sm:grid sm:grid-cols-12 sm:gap-4 sm:border-b sm:border-light-600/20 sm:pb-2 sm:text-sm sm:font-medium sm:text-light-400 dark:sm:border-light-800/20'>
                  <div className='col-span-5'>Name</div>
                  <div className='col-span-2'>Type</div>
                  <div className='col-span-2'>Size</div>
                  <div className='col-span-3 text-right'>Actions</div>
                </div>
                {documents.map((doc) => (
                  <Document
                    key={doc.id}
                    id={doc.id}
                    name={doc.name}
                    size={doc.size}
                    downloadURL={doc.downloadURL}
                    type={doc.type}
                    fileIcon={doc.fileIcon}
                    viewType={viewType}
                  />
                ))}
                <div className='rounded-lg border-2 border-dashed border-accent/40 p-4'>
                  <PlaceholderDocument />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Documents;
