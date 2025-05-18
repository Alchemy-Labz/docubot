// src/components/Dashboard/DocumentViewContainer.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PDFViewer from './PDFViewer';
import TextDocumentViewer from './TextDocumentViewer';
import ChatWindowClient from './ChatWindowClient';
import { FileText, MessageSquare, SplitSquareVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { doc, getDoc } from '@firebase/firestore';
import { useFirebaseAuth } from '@/providers/FirebaseContext';
import { db } from '@/lib/firebase/firebase';

type ViewType = 'split' | 'document' | 'chat';

interface DocumentViewContainerProps {
  id: string;
  userId: string; // This is the Clerk user ID from the parent
  url: string;
  fileName: string;
}

const DocumentViewContainer = ({ id, userId, url, fileName }: DocumentViewContainerProps) => {
  const [currentView, setCurrentView] = useState<ViewType>('split');
  const [isMobile, setIsMobile] = useState(false);
  const [fileType, setFileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isLoading: authLoading } = useFirebaseAuth();

  // Fetch file type after authentication - use the passed userId (Clerk ID)
  useEffect(() => {
    const fetchFileType = async () => {
      if (authLoading) return;

      if (!isAuthenticated || !userId || !id) {
        setLoading(false);
        return;
      }

      try {
        // Use the Clerk user ID that was passed down
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
  }, [isAuthenticated, authLoading, id, userId]);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (window.innerWidth < 768 && currentView === 'split') {
      setCurrentView('document');
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [currentView]);

  // Determine which document viewer to use based on file type
  const renderDocumentViewer = () => {
    if (loading || authLoading)
      return <div className='flex h-full items-center justify-center'>Loading document...</div>;

    if (!fileType || fileType === 'application/pdf') {
      return <PDFViewer url={url} fileName={fileName} />;
    }

    if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'text/plain' ||
      fileType === 'text/markdown' ||
      fileType === 'text/rtf' ||
      fileType === 'application/rtf'
    ) {
      return <TextDocumentViewer url={url} fileName={fileName} fileType={fileType} />;
    }

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