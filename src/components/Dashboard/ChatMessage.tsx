import React from 'react';
import { Message } from './ChatWindow';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { BotMessageSquare } from 'lucide-react';
import MarkdownRenderer from './Markdown';

const ChatMessage = ({ message }: { message: Message }) => {
  const isHuman = message.role === 'human';
  const { user } = useUser();

  // Format timestamp for accessibility
  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div
      className={`chat mb-4 flex ${isHuman ? 'justify-end' : 'justify-start'}`}
      role='group'
      aria-labelledby={`message-${message.id || 'temp'}-sender`}
    >
      <div className={`flex max-w-3xl ${isHuman ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div
          className={`chat-image-avatar flex items-end ${isHuman ? 'ml-2' : 'mr-2'}`}
          aria-hidden='true'
        >
          <div className='h-8 w-8 overflow-hidden rounded-full'>
            {isHuman ? (
              user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  width={32}
                  height={32}
                  alt=''
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

        {/* Message Content */}
        <div
          className={`chat-bubble prose rounded-2xl p-4 ${
            isHuman
              ? 'rounded-br-none bg-dark-700/60 text-light-300'
              : 'rounded-bl-none bg-light-800/60 text-light-300'
          }`}
          role='article'
          aria-labelledby={`message-${message.id || 'temp'}-sender`}
          aria-describedby={`message-${message.id || 'temp'}-time`}
        >
          {/* Hidden sender info for screen readers */}
          <div id={`message-${message.id || 'temp'}-sender`} className='sr-only'>
            Message from {isHuman ? user?.firstName || 'You' : 'DocuBot AI Assistant'}
          </div>

          {/* Message content */}
          <div className='message-content'>
            <MarkdownRenderer>{message.message}</MarkdownRenderer>
          </div>

          {/* Timestamp for screen readers */}
          <div id={`message-${message.id || 'temp'}-time`} className='sr-only'>
            Sent at {formatTimestamp(message.createdAt)}
          </div>

          {/* Visual timestamp */}
          <div className='mt-2 text-xs opacity-60' aria-hidden='true'>
            {formatTimestamp(message.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
