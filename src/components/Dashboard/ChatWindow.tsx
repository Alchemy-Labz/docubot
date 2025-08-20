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

export type Message = {
  id?: string;
  role: 'human' | 'ai' | 'placeholder';
  message: string;
  createdAt: Date;
};

interface ChatWindowClientProps {
  docId: string;
  userId: string; // This is the Clerk user ID passed from parent
}

const ChatWindowClient = ({ docId, userId }: ChatWindowClientProps) => {
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

  return (
    <div className='business-light:bg-background business-dark:bg-background neon-light:bg-background neon-dark:bg-background flex h-full flex-col'>
      {/* Chat Messages Container */}
      <div
        ref={chatContainerRef}
        className='mx-auto w-full max-w-3xl flex-1 space-y-4 overflow-y-auto p-4'
        role='log'
        aria-label='Chat conversation'
        aria-describedby='chat-description'
        aria-live='polite'
        aria-atomic='false'
      >
        <div id='chat-description' className='sr-only'>
          Chat conversation with DocuBot about your document. New messages will be announced.
        </div>

        {loading || authLoading ? (
          <div
            className='flex h-full items-center justify-center'
            role='status'
            aria-label='Loading chat messages'
          >
            <Loader2
              className='business-light:text-primary business-dark:text-primary neon-light:text-accent neon-dark:text-accent h-8 w-8 animate-spin'
              aria-hidden='true'
            />
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
              <ChatMessage key={message.id || index} message={message} />
            ))}
            <div ref={bottomOfChatRef} aria-hidden='true' />
          </>
        )}
      </div>

      {/* Chat Input Form */}
      <form
        onSubmit={handleSubmit}
        className='business-light:border-border business-light:bg-card business-dark:border-border business-dark:bg-card neon-light:border-accent/20 neon-light:bg-card neon-dark:border-accent/30 neon-dark:bg-card border-t p-4'
        aria-label='Send message form'
      >
        <div className='flex space-x-2'>
          <label htmlFor='chat-input' className='sr-only'>
            Type your question about the document
          </label>
          <Input
            id='chat-input'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isAuthenticated ? 'Type your question...' : 'Connecting to database...'}
            className='business-light:bg-background business-dark:bg-background neon-light:bg-background neon-dark:bg-background flex-1'
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
            className='business-light:bg-primary business-light:hover:bg-primary/90 business-dark:bg-primary business-dark:hover:bg-primary/90 neon-light:bg-accent neon-light:hover:bg-accent/90 neon-dark:bg-accent neon-dark:hover:bg-accent/90 flex items-center justify-center'
            aria-label={isSubmitting ? 'Sending message...' : 'Send message'}
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
