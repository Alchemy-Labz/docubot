// src/components/Dashboard/DocumentViewContainer.tsx
'use client';

import { useState, useEffect } from 'react';
import PDFViewer from './PDFViewer';
import TextDocumentViewer from './TextDocumentViewer';
import ChatWindowClient from './ChatWindowClient';
import {
  FileText,
  MessageSquare,
  SplitSquareVertical,
  ArrowLeftRight,
  ArrowUpDown,
  Loader2,
} from 'lucide-react';
import { Button } from '../ui/button';
import { doc, getDoc } from '@firebase/firestore';
import { useFirebaseAuth } from '@/providers/FirebaseContext';
import { db } from '@/lib/firebase/firebase';
import { UI_CONFIG } from '@/lib/constants/appConstants';

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
  const [isTablet, setIsTablet] = useState(false);
  const [fileType, setFileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSwapped, setIsSwapped] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useFirebaseAuth();

  // Fetch file type after authentication
  useEffect(() => {
    const fetchFileType = async () => {
      if (authLoading) return;

      if (!isAuthenticated || !userId || !id) {
        setLoading(false);
        return;
      }

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
  }, [isAuthenticated, authLoading, id, userId]);

  // Handle responsive behavior with tablet detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < UI_CONFIG.MOBILE_BREAKPOINT);
      setIsTablet(width >= UI_CONFIG.MOBILE_BREAKPOINT && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Reset swap state when view changes
  useEffect(() => {
    if (currentView !== 'split') {
      setIsSwapped(false);
    }
  }, [currentView]);

  // Determine if we should use vertical layout (mobile/tablet)
  const useVerticalLayout = isMobile || isTablet;

  // Render document viewer based on file type
  const renderDocumentViewer = () => {
    if (loading || authLoading) {
      return (
        <div className='flex h-full items-center justify-center bg-light-400/40 dark:bg-dark-800/40'>
          <Loader2 className='h-8 w-8 animate-spin text-accent' />
          <span className='ml-2 text-sm text-muted-foreground'>Loading document...</span>
        </div>
      );
    }

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

  // Render chat component
  const renderChatComponent = () => {
    return <ChatWindowClient docId={id} userId={userId} viewType={currentView} />;
  };

  return (
    <div className='flex h-[calc(100vh-64px)] w-full flex-col'>
      {/* Enhanced Control Bar */}
      <div className='flex items-center justify-between border-b bg-background p-3 dark:bg-dark-700'>
        {/* Left spacer for balance */}
        <div className='flex-1' />

        {/* Centered View Controls */}
        <div className='flex items-center justify-center space-x-2'>
          <Button
            variant={currentView === 'document' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setCurrentView('document')}
            aria-label='Document only view'
            className='flex items-center gap-2'
          >
            <FileText className='h-4 w-4' />
            <span className='hidden sm:inline'>Document</span>
          </Button>

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

          <Button
            variant={currentView === 'chat' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setCurrentView('chat')}
            aria-label='Chat only view'
            className='flex items-center gap-2'
          >
            <MessageSquare className='h-4 w-4' />
            <span className='hidden sm:inline'>Chat</span>
          </Button>
        </div>

        {/* Right Side - Swap Button */}
        <div className='flex flex-1 items-center justify-end'>
          {currentView === 'split' && (
            <div className='flex items-center space-x-2'>
              <span className='hidden text-xs text-muted-foreground sm:inline'>
                {useVerticalLayout ? 'Switch top/bottom' : 'Switch left/right'}
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsSwapped(!isSwapped)}
                aria-label={`Swap ${useVerticalLayout ? 'top and bottom' : 'left and right'} panels`}
                className='flex items-center gap-1'
              >
                {useVerticalLayout ? (
                  <ArrowUpDown className='h-4 w-4' />
                ) : (
                  <ArrowLeftRight className='h-4 w-4' />
                )}
                <span className='hidden sm:inline'>Swap</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area - Simpler Layout */}
      <div className='relative flex-1 overflow-hidden'>
        {/* Using direct conditional rendering instead of component order logic */}
        {currentView === 'chat' && <div className='h-full w-full'>{renderChatComponent()}</div>}

        {currentView === 'document' && (
          <div className='h-full w-full'>{renderDocumentViewer()}</div>
        )}

        {currentView === 'split' && (
          <div className={`flex h-full w-full ${useVerticalLayout ? 'flex-col' : 'flex-row'}`}>
            {isSwapped ? (
              <>
                <div className={`${useVerticalLayout ? 'h-1/2' : 'w-1/2'}`}>
                  {renderChatComponent()}
                </div>
                <div
                  className={`${useVerticalLayout ? 'h-1 w-full' : 'h-full w-1'} flex-shrink-0 bg-border`}
                />
                <div className={`${useVerticalLayout ? 'h-1/2' : 'w-1/2'}`}>
                  {renderDocumentViewer()}
                </div>
              </>
            ) : (
              <>
                <div className={`${useVerticalLayout ? 'h-1/2' : 'w-1/2'}`}>
                  {renderDocumentViewer()}
                </div>
                <div
                  className={`${useVerticalLayout ? 'h-1 w-full' : 'h-full w-1'} flex-shrink-0 bg-border`}
                />
                <div className={`${useVerticalLayout ? 'h-1/2' : 'w-1/2'}`}>
                  {renderChatComponent()}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewContainer;
