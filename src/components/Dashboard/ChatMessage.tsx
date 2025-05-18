import React from 'react';
import { Message } from './ChatWindow';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { BotMessageSquare } from 'lucide-react';
import  MarkdownRenderer  from './Markdown';

const ChatMessage = ({ message }: { message: Message }) => {
  const isHuman = message.role === 'human';
  const { user } = useUser();

  return (
    <div className={`chat mb-4 flex ${isHuman ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-3xl ${isHuman ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`chat-image-avatar flex items-end ${isHuman ? 'ml-2' : 'mr-2'}`}>
          <div className='h-8 w-8 overflow-hidden rounded-full'>
            {isHuman ? (
              user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  width={32}
                  height={32}
                  alt='user'
                  className='rounded-full'
                />
              ) : (
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-neon2-300'>
                  <span className='text-xs font-bold text-dark-800'>
                    {user?.firstName?.[0] || 'U'}
                  </span>
                </div>
              )
            ) : (
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-neon-500'>
                <BotMessageSquare className='h-5 w-5 text-dark-800' />
              </div>
            )}
          </div>
        </div>
        <div
          className={`chat-bubble prose rounded-2xl p-4 ${
            isHuman
              ? 'rounded-br-none bg-dark-700/60 text-light-300'
              : 'rounded-bl-none bg-light-800/60 text-light-300'
          }`}
        >
          <MarkdownRenderer>{message.message}</MarkdownRenderer>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
