// Updated ChatWindowClient.tsx - Compatible with existing firebase.ts
'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { askQuestion } from '@/actions/openAI/askQuestion';
import ChatMessage from './ChatMessage';
// Import Firebase from your existing setup
import { db, auth } from '@/lib/firebase/firebase';
import { signInWithCustomToken } from '@firebase/auth';
import { collection, onSnapshot, orderBy, query, Timestamp } from '@firebase/firestore';

export type Message = {
  id?: string;
  role: 'human' | 'ai' | 'placeholder';
  message: string;
  createdAt: Date;
};

interface ChatWindowClientProps {
  docId: string;
  userId: string;
}

const ChatWindowClient = ({ docId, userId }: ChatWindowClientProps) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const bottomOfChatRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  // First authenticate with Firebase
  useEffect(() => {
    let isMounted = true;

    const authenticateWithFirebase = async () => {
      if (!userId || !user) return;

      try {
        console.log('Fetching Firebase token for user:', userId);
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
        console.log('🔥 Firebase authentication successful');

        if (isMounted) {
          setFirebaseInitialized(true);
        }
      } catch (err) {
        console.error('🔥 Firebase authentication error:', err);

        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Authentication error');
          setLoading(false);
          toast.error('Authentication error. Please try again.');
        }
      }
    };

    authenticateWithFirebase();

    return () => {
      isMounted = false;
    };
  }, [userId, user]);

  // Set up listener for messages only after Firebase is initialized
  useEffect(() => {
    if (!firebaseInitialized || !userId || !docId) {
      console.log('Conditions not met for fetching messages:', {
        firebaseInitialized,
        userId,
        docId,
        dbInitialized: !!db,
      });
      return;
    }

    let isMounted = true;
    setLoading(true);
    console.log('Setting up Firestore listener for:', `users/${userId}/files/${docId}/chat`);

    try {
      // Delayed initialization to ensure Firebase is ready
      setTimeout(() => {
        try {
          // Create a query against the chat collection
          const messagesRef = collection(db, 'users', userId, 'files', docId, 'chat');
          const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));

          // Set up the subscription
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
                console.log('Message data:', { id: doc.id, ...data });

                // Handle different timestamp formats
                let createdAt;
                if (data.createdAt instanceof Timestamp) {
                  createdAt = data.createdAt.toDate();
                } else if (data.createdAt && typeof data.createdAt.toDate === 'function') {
                  createdAt = data.createdAt.toDate();
                } else if (data.createdAt && data.createdAt.seconds) {
                  // Handle Firestore timestamp object
                  createdAt = new Date(data.createdAt.seconds * 1000);
                } else {
                  // Fall back to current date if timestamp is invalid
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
            },
            (err) => {
              if (!isMounted) return;

              console.error('Error in Firestore snapshot listener:', err);
              setError(`Error loading messages: ${err.message}`);
              setLoading(false);
              toast.error('Failed to load chat messages');
            }
          );

          // Return cleanup function
          return () => {
            console.log('Cleaning up Firestore listener');
            unsubscribe();
          };
        } catch (err) {
          if (!isMounted) return;

          console.error('Error creating Firestore query:', err);
          setError(err instanceof Error ? err.message : 'Error setting up messages query');
          setLoading(false);
        }
      }, 1000); // Add a small delay to ensure Firebase is fully initialized
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
  }, [firebaseInitialized, userId, docId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim() || !user || isSubmitting || !firebaseInitialized) return;

    const userQuestion = input.trim();
    setInput('');
    setIsSubmitting(true);

    try {
      console.log(`Sending question for doc ${docId}: ${userQuestion}`);

      // Call server action to process the question
      const result = await askQuestion(docId, userQuestion);

      if (!result.success) {
        console.error('Error from askQuestion:', result.message);
        toast.error(result.message || 'Failed to get a response');
      } else {
        toast.success('Question processed successfully!');
      }
    } catch (error) {
      console.error('Error asking question:', error);
      toast.error('Failed to get a response');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex h-full flex-col bg-light-400/40 dark:bg-dark-800/40'>
      <div className='mx-auto w-full max-w-3xl flex-1 space-y-4 overflow-y-auto p-4'>
        {loading ? (
          <div className='flex h-full items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-accent' />
          </div>
        ) : error ? (
          <div className='flex h-full flex-col items-center justify-center p-6 text-center text-destructive'>
            <p className='mb-2 text-lg font-medium'>Error loading messages</p>
            <p>{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className='flex h-full flex-col items-center justify-center p-6 text-center text-muted-foreground'>
            <p className='mb-2 text-lg font-medium'>Chat with your document</p>
            <p>Ask questions about your document and get AI-powered answers.</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage key={message.id || index} message={message} />
            ))}
            <div ref={bottomOfChatRef} />
          </>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className='border-accent-200 dark:border-accent-700 border-t bg-light-600/40 p-4 dark:bg-dark-600/40'
      >
        <div className='flex space-x-2'>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              firebaseInitialized ? 'Type your question...' : 'Connecting to database...'
            }
            className='flex-1 bg-light-500 dark:bg-dark-700/40'
            disabled={isSubmitting || !user || !firebaseInitialized}
          />
          <Button
            type='submit'
            disabled={!input.trim() || isSubmitting || !user || !firebaseInitialized}
            className='flex items-center justify-center bg-accent hover:bg-accent2'
          >
            {isSubmitting ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Send className='h-5 w-5' />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindowClient;
