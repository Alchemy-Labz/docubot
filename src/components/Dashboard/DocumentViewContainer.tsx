// src/components/Dashboard/DocumentViewContainer.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PDFViewer from './PDFViewer';
import ChatWindowClient from './ChatWindowClient';
import { FileText, MessageSquare, SplitSquareVertical } from 'lucide-react';
import { Button } from '../ui/button';

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
          {(currentView === 'document' || currentView === 'split' || !isMobile) && (
            <PDFViewer url={url} fileName={fileName} />
          )}
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
