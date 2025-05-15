// src/components/Dashboard/ChatWindow.tsx
'use client';

import { FormEvent, useEffect, useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send } from 'lucide-react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useUser } from '@clerk/nextjs';
import { collection, orderBy, query } from '@firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '#/firebase'; // Client Firebase SDK
import { askQuestion } from '@/actions/openAI/askQuestion';
import ChatMessage from './ChatMessage';

export type Message = {
  id?: string;
  role: 'human' | 'ai' | 'placeholder';
  message: string;
  createdAt: Date;
};

interface ChatWindowProps {
  id: string;
}

const ChatWindow = ({ id }: ChatWindowProps) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  // Only initialize Firebase client queries if we have a user
  const [snapshot, loading, error] = useCollection(
    user && db
      ? query(collection(db, 'users', user.id, 'files', id, 'chat'), orderBy('createdAt', 'asc'))
      : null
  );

  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!snapshot) return;

    const newMessages = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        role: data.role,
        message: data.message,
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    });

    // Remove any placeholder AI message from our local state
    const filteredMessages = messages.filter(
      (msg) => !(msg.role === 'ai' && msg.message === 'DocuBot is thinking...' && !msg.id)
    );

    // Only update if there's a difference
    if (JSON.stringify(filteredMessages) !== JSON.stringify(newMessages)) {
      setMessages(newMessages);
    }
  }, [snapshot, messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim() || !user) return;

    const userQuestion = input.trim();
    setInput('');

    // Optimistic message update
    setMessages((prev) => [
      ...prev,
      { role: 'human', message: userQuestion, createdAt: new Date() },
      { role: 'ai', message: 'DocuBot is thinking...', createdAt: new Date() },
    ]);

    startTransition(async () => {
      try {
        const result = await askQuestion(id, userQuestion);

        if (!result.success) {
          // Remove the thinking message and add error message
          setMessages((prev) =>
            prev
              .filter((msg) => !(msg.role === 'ai' && msg.message === 'DocuBot is thinking...'))
              .concat({
                role: 'ai',
                message: `Error: ${result.message || 'Something went wrong'}`,
                createdAt: new Date(),
              })
          );

          toast.error(`Error: ${result.message || 'Failed to get response'}`);
        }
      } catch (err) {
        console.error('Error asking question:', err);

        // Remove the thinking message and add error message
        setMessages((prev) =>
          prev
            .filter((msg) => !(msg.role === 'ai' && msg.message === 'DocuBot is thinking...'))
            .concat({
              role: 'ai',
              message: 'Sorry, there was an error processing your question. Please try again.',
              createdAt: new Date(),
            })
        );

        toast.error('Failed to get a response');
      }
    });
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
            disabled={isPending || !user}
          />
          <Button
            type='submit'
            disabled={!input.trim() || isPending || !user}
            className='flex items-center justify-center bg-accent hover:bg-accent2'
          >
            {isPending ? (
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

export default ChatWindow;
