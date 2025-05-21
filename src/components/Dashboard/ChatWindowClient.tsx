// src/components/Dashboard/ChatWindowClient.tsx
'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { askQuestion } from '@/actions/openAI/askQuestion';
import ChatMessage from './ChatMessage';
import { useFirebaseAuth } from '@/providers/FirebaseContext';
import { db } from '@/lib/firebase/firebase';
import { collection, onSnapshot, orderBy, query, Timestamp } from '@firebase/firestore';

import { CHAT_CONFIG, SUCCESS_MESSAGES } from '@/lib/constants/appConstants';
import { Message } from '@/models/types/chatTypes';

interface ChatWindowClientProps {
  docId: string;
  userId: string; // This is the Clerk user ID passed from parent
  viewType?: 'split' | 'document' | 'chat';
}

const ChatWindowClient = ({ docId, userId, viewType = 'split' }: ChatWindowClientProps) => {
  const { user: clerkUser } = useUser();
  const { isAuthenticated, isLoading: authLoading } = useFirebaseAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bottomOfChatRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Set up listener for messages - use the passed userId (Clerk ID)
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !userId || !docId) {
      console.log('Authentication not ready for messages:', {
        isAuthenticated,
        userId,
        docId,
        authLoading,
      });
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    console.log('Setting up Firestore listener for:', `users/${userId}/files/${docId}/chat`);

    try {
      const messagesRef = collection(db, 'users', userId, 'files', docId, 'chat');
      const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));

      const unsubscribe = onSnapshot(
        messagesQuery,
        (snapshot) => {
          if (!isMounted) return;

          console.log(`Received ${snapshot.docs.length} chat messages`);

          if (snapshot.empty) {
            console.log('No messages found in this chat');
            setMessages([]);
            setLoading(false);
            return;
          }

          const newMessages = snapshot.docs.map((doc) => {
            const data = doc.data();

            // Handle different timestamp formats
            let createdAt;
            if (data.createdAt instanceof Timestamp) {
              createdAt = data.createdAt.toDate();
            } else if (data.createdAt && typeof data.createdAt.toDate === 'function') {
              createdAt = data.createdAt.toDate();
            } else if (data.createdAt && data.createdAt.seconds) {
              createdAt = new Date(data.createdAt.seconds * 1000);
            } else {
              createdAt = new Date(data.createdAt || Date.now());
            }

            return {
              id: doc.id,
              role: data.role,
              message: data.message,
              createdAt: createdAt,
            };
          });

          setMessages(newMessages);
          setLoading(false);
          setError(null);
        },
        (err) => {
          if (!isMounted) return;

          console.error('Error in Firestore snapshot listener:', err);
          setError(`Error loading messages: ${err.message}`);
          setLoading(false);
          toast.error('Failed to load chat messages');
        }
      );

      return () => {
        console.log('Cleaning up Firestore listener');
        unsubscribe();
      };
    } catch (err) {
      if (!isMounted) return;

      console.error('Error setting up messages listener:', err);
      setError(err instanceof Error ? err.message : 'Error loading messages');
      setLoading(false);
      toast.error('Failed to load chat messages');
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, authLoading, userId, docId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({ behavior: CHAT_CONFIG.SCROLL_BEHAVIOR });
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim() || !clerkUser || isSubmitting || !isAuthenticated) return;

    const userQuestion = input.trim();
    setInput('');
    setIsSubmitting(true);

    try {
      console.log(`Sending question for doc ${docId}: ${userQuestion}`);

      const result = await askQuestion(docId, userQuestion);

      if (!result.success) {
        console.error('Error from askQuestion:', result.message);
        toast.error(result.message || 'Failed to get a response');
      } else {
        toast.success(SUCCESS_MESSAGES.QUESTION_PROCESSED);
      }
    } catch (error) {
      console.error('Error asking question:', error);
      toast.error('Failed to get a response');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get container classes based on view type - with right-aligned scrollbar
  const getContainerClasses = () => {
    let baseClasses = 'flex-1 overflow-y-auto py-4 pr-0 pl-1';

    // Adjust width based on view type
    if (viewType === 'chat') {
      return `${baseClasses} w-full max-w-6xl mx-auto`;
    } else if (viewType === 'split') {
      return `${baseClasses} w-full`;
    } else {
      return `${baseClasses} w-full max-w-5xl mx-auto`;
    }
  };

  return (
    <div className='flex h-full flex-col bg-light-400/40 dark:bg-dark-800/40'>
      {/* Chat Messages Container - with right-aligned scrollbar */}
      <div
        ref={chatContainerRef}
        className={getContainerClasses()}
        role='log'
        aria-label='Chat conversation'
        aria-describedby='chat-description'
        aria-live='polite'
        aria-atomic='false'
        style={{ scrollbarGutter: 'stable both-edges' }}
      >
        <div id='chat-description' className='sr-only'>
          Chat conversation with DocuBot about your document. New messages will be announced.
        </div>

        <div className='space-y-4 px-2'>
          {loading || authLoading ? (
            <div
              className='flex h-full items-center justify-center py-12'
              role='status'
              aria-label='Loading chat messages'
            >
              <Loader2 className='h-8 w-8 animate-spin text-accent' aria-hidden='true' />
              <span className='sr-only'>Loading chat messages...</span>
            </div>
          ) : error ? (
            <div
              className='flex h-full flex-col items-center justify-center p-6 text-center text-destructive'
              role='alert'
              aria-labelledby='error-title'
            >
              <h3 id='error-title' className='mb-2 text-lg font-medium'>
                Error loading messages
              </h3>
              <p>{error}</p>
            </div>
          ) : messages.length === 0 ? (
            <div
              className='flex h-full flex-col items-center justify-center p-6 text-center text-muted-foreground'
              role='status'
              aria-labelledby='empty-chat-title'
            >
              <h3 id='empty-chat-title' className='mb-2 text-lg font-medium'>
                Chat with your document
              </h3>
              <p>Ask questions about your document and get AI-powered answers.</p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage key={message.id || index} message={message} viewType={viewType} />
              ))}
              <div ref={bottomOfChatRef} aria-hidden='true' />
            </>
          )}
        </div>
      </div>

      {/* Chat Input Form */}
      <form
        onSubmit={handleSubmit}
        className='border-accent-200 dark:border-accent-700 border-t bg-light-600/40 p-4 dark:bg-dark-600/40'
      >
        <div className='mx-auto flex max-w-6xl space-x-2'>
          <label htmlFor='chat-input' className='sr-only'>
            Type your question about the document
          </label>
          <Input
            id='chat-input'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isAuthenticated ? 'Type your question...' : 'Connecting to database...'}
            className='flex-1 bg-light-500 dark:bg-dark-700/40'
            disabled={isSubmitting || !clerkUser || !isAuthenticated}
            aria-describedby='chat-input-help'
            autoComplete='off'
          />
          <div id='chat-input-help' className='sr-only'>
            Type your question about the document and press enter or click send to get an AI
            response
          </div>

          <Button
            type='submit'
            disabled={!input.trim() || isSubmitting || !clerkUser || !isAuthenticated}
            className='flex items-center justify-center bg-accent hover:bg-accent2'
          >
            {isSubmitting ? (
              <Loader2 className='h-4 w-4 animate-spin' aria-hidden='true' />
            ) : (
              <Send className='h-5 w-5' aria-hidden='true' />
            )}
            <span className='sr-only'>{isSubmitting ? 'Sending...' : 'Send'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindowClient;
