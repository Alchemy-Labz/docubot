// src/components/Dashboard/DocumentViewContainer.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PDFViewer from './PDFViewer';
import TextDocumentViewer from './TextDocumentViewer';
import ChatWindowClient from './ChatWindowClient';
import { FileText, MessageSquare, SplitSquareVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { db, auth } from '#/firebase';
import { doc, getDoc } from '@firebase/firestore';
import { signInWithCustomToken } from '@firebase/auth';

type ViewType = 'split' | 'document' | 'chat';

interface DocumentViewContainerProps {
  id: string;
  userId: string;
  url: string;
  fileName: string;
}

const DocumentViewContainer = ({ id, userId, url, fileName }: DocumentViewContainerProps) => {
  const [currentView, setCurrentView] = useState<ViewType>('split');
  const [isMobile, setIsMobile] = useState(false);
  const [fileType, setFileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Authenticate with Firebase first
  useEffect(() => {
    const authenticateWithFirebase = async () => {
      try {
        // Fetch Firebase token
        const response = await fetch('/api/firebase-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch Firebase token: ${response.status}`);
        }

        const data = await response.json();
        if (!data.firebaseToken) {
          throw new Error('No Firebase token received');
        }

        // Sign in to Firebase
        await signInWithCustomToken(auth, data.firebaseToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error authenticating with Firebase:', error);
        setLoading(false);
      }
    };

    authenticateWithFirebase();
  }, [userId]);

  // Fetch file type after authentication
  useEffect(() => {
    const fetchFileType = async () => {
      if (!isAuthenticated || !userId || !id || !db) return;

      try {
        const docRef = doc(db, 'users', userId, 'files', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFileType(docSnap.data()?.type || null);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching document type:', error);
        setLoading(false);
      }
    };

    fetchFileType();
  }, [isAuthenticated, id, userId]);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Default to document view on mobile
    if (window.innerWidth < 768 && currentView === 'split') {
      setCurrentView('document');
    }

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determine which document viewer to use based on file type
  const renderDocumentViewer = () => {
    if (loading)
      return <div className='flex h-full items-center justify-center'>Loading document...</div>;

    // Default to PDF viewer if type is unknown or is PDF
    if (!fileType || fileType === 'application/pdf') {
      return <PDFViewer url={url} fileName={fileName} />;
    }

    // Use TextDocumentViewer for text-based documents
    if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'text/plain' ||
      fileType === 'text/markdown' ||
      fileType === 'text/rtf' ||
      fileType === 'application/rtf'
    ) {
      return <TextDocumentViewer url={url} fileName={fileName} fileType={fileType} />;
    }

    // Fallback to PDF viewer
    return <PDFViewer url={url} fileName={fileName} />;
  };

  return (
    <div className='flex h-[calc(100vh-64px)] w-full flex-col'>
      <div className='flex justify-center border-b bg-background p-2 dark:bg-dark-700'>
        <div className='flex items-center space-x-2'>
          <Button
            variant={currentView === 'document' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setCurrentView('document')}
            aria-label='Document view'
            className='flex items-center gap-2'
          >
            <FileText className='h-4 w-4' />
            <span className='hidden sm:inline'>Document</span>
          </Button>

          {!isMobile && (
            <Button
              variant={currentView === 'split' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setCurrentView('split')}
              aria-label='Split view'
              className='flex items-center gap-2'
            >
              <SplitSquareVertical className='h-4 w-4' />
              <span className='hidden sm:inline'>Split</span>
            </Button>
          )}

          <Button
            variant={currentView === 'chat' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setCurrentView('chat')}
            aria-label='Chat view'
            className='flex items-center gap-2'
          >
            <MessageSquare className='h-4 w-4' />
            <span className='hidden sm:inline'>Chat</span>
          </Button>
        </div>
      </div>

      <div className='relative flex flex-1 overflow-hidden'>
        <motion.div
          className='absolute h-full'
          initial={{ width: isMobile ? '100%' : '50%' }}
          animate={{
            width: currentView === 'document' ? '100%' : currentView === 'split' ? '50%' : '0%',
            opacity: currentView === 'chat' ? 0 : 1,
            zIndex: currentView === 'chat' ? -1 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {(currentView === 'document' || currentView === 'split' || !isMobile) &&
            renderDocumentViewer()}
        </motion.div>

        <motion.div
          className='absolute right-0 h-full'
          initial={{ width: isMobile ? '0%' : '50%' }}
          animate={{
            width: currentView === 'chat' ? '100%' : currentView === 'split' ? '50%' : '0%',
            opacity: currentView === 'document' ? 0 : 1,
            zIndex: currentView === 'document' ? -1 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {(currentView === 'chat' || currentView === 'split' || !isMobile) && (
            <ChatWindowClient docId={id} userId={userId} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentViewContainer;
