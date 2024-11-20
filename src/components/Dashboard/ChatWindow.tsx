//ChatWindow.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { FormEvent, useEffect, useRef, useState, useTransition } from 'react';
import { Button } from '@/c/ui/button';
import { Input } from '@/c/ui/input';
import { Loader2, Send } from 'lucide-react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { db } from '#/firebase';
import { collection, orderBy, query } from '@firebase/firestore';
import toast from 'react-hot-toast';

// import ChatMessage from '@/components/Dashboard/ChatMessage';
// eslint-disable-next-line import/no-cycle
import { askQuestion } from '@/actions/openAI/askQuestion';
// eslint-disable-next-line import/no-cycle
import ChatMessage from './ChatMessage';

export type Message = {
  id?: string;
  role: 'human' | 'ai' | 'placeholder';
  message: string;
  createdAt: Date;
};
function ChatWindow({ id }: { id: string }) {
  const { user } = useUser();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const bottomofChatRef = useRef<HTMLDivElement>(null);

  const [snapshot, loading, error] = useCollection(
    user &&
      query(collection(db, 'users', user?.id, 'files', id, 'chat'), orderBy('createdAt', 'asc'))
  );

  useEffect(() => {
    bottomofChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }),
    [messages];
  useEffect(() => {
    if (!snapshot) return;
    console.log('Updated snapshot', snapshot.docs);

    const lastMessage = messages.pop();

    if (lastMessage?.role === 'ai' && lastMessage.message === 'DocuBot is thinking...') {
      //return this as a dummy place holder message
      return;
    }

    const newMessages = snapshot.docs.map((doc) => {
      const { role, message, createdAt } = doc.data();
      return { id: doc.id, role, message, createdAt: createdAt.toDate() };
    });
    setMessages(newMessages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = input;
    setInput('');

    //Optimistic Message Update
    setMessages((prev) => [
      ...prev,
      { role: 'human', message: q, createdAt: new Date() },
      { role: 'ai', message: 'DocuBot is thinking...', createdAt: new Date() },
    ]);

    startTransition(async () => {
      const { success, message } = await askQuestion(id, q);

      console.log('DEBUG', success, message);

      if (!success) {
        toast.error(`Error: ${message}`);

        setMessages((prev) =>
          prev.slice(0, prev.length - 1).concat([
            {
              role: 'ai',
              message: `Oops, there was an Error: ${message}`,
              createdAt: new Date(),
            },
          ])
        );
      } else {
        toast.success('DocuBot has answered your question!');
        // Handle successful case here if needed
      }
    });
  };
  return (
    <div className='bg-accent-50 dark:bg-accent-900 flex h-full flex-col'>
      <div className='mx-auto max-w-7xl flex-1 items-center space-y-4 overflow-y-auto p-4'>
        {loading ? (
          <div className='flex h-full items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-accent' />
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage key={message.id || index} message={message} />
            ))}
            <div ref={bottomofChatRef} />
          </>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className='border-accent-200 dark:border-accent-700 border-t bg-dark-600/40 p-4'
      >
        <div className='flex space-x-2'>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type your message...'
            className='flex-1 bg-dark-700/40'
          />
          <Button
            type='submit'
            disabled={!input.trim() || isPending}
            className='flex items-center justify-center bg-light-500'
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
}

export default ChatWindow;
