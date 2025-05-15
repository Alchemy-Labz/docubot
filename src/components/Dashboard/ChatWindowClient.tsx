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
import { db } from '#/firebase'; // Client Firebase SDK
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

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
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  // Set up listener for messages
  useEffect(() => {
    if (!userId || !docId) return;

    setLoading(true);

    try {
      // Create a query against the collection
      const messagesRef = collection(db, 'users', userId, 'files', docId, 'chat');
      const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));

      // Set up the subscription
      const unsubscribe = onSnapshot(
        messagesQuery,
        (snapshot) => {
          const newMessages = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              role: data.role,
              message: data.message,
              createdAt: data.createdAt?.toDate() || new Date(),
            };
          });

          setMessages(newMessages);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching messages:', error);
          setLoading(false);
          toast.error('Failed to load chat messages');
        }
      );

      // Clean up the subscription
      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up messages listener:', error);
      setLoading(false);
      toast.error('Failed to load chat messages');
    }
  }, [userId, docId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim() || !user || isSubmitting) return;

    const userQuestion = input.trim();
    setInput('');

    // Optimistic UI update
    const optimisticUserMsg: Message = {
      role: 'human',
      message: userQuestion,
      createdAt: new Date(),
    };

    const optimisticAiMsg: Message = {
      role: 'ai',
      message: 'DocuBot is thinking...',
      createdAt: new Date(),
    };

    // For optimistic UI updates
    setMessages((prev) => [...prev, optimisticUserMsg, optimisticAiMsg]);
    setIsSubmitting(true);

    try {
      // Call server action to process the question
      const result = await askQuestion(docId, userQuestion);

      if (!result.success) {
        // Remove the placeholder message
        setMessages((prev) =>
          prev.filter(
            (msg) => !(msg.role === 'ai' && msg.message === 'DocuBot is thinking...' && !msg.id)
          )
        );

        toast.error(result.message || 'Failed to get a response');
      }
    } catch (error) {
      console.error('Error asking question:', error);

      // Remove the placeholder and show error
      setMessages((prev) =>
        prev
          .filter(
            (msg) => !(msg.role === 'ai' && msg.message === 'DocuBot is thinking...' && !msg.id)
          )
          .concat({
            role: 'ai',
            message: 'Sorry, there was an error processing your question. Please try again.',
            createdAt: new Date(),
          })
      );

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
            placeholder='Type your question...'
            className='flex-1 bg-light-500 dark:bg-dark-700/40'
            disabled={isSubmitting || !user}
          />
          <Button
            type='submit'
            disabled={!input.trim() || isSubmitting || !user}
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
