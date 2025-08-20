// src/components/Dashboard/ChatMessage.tsx
import React from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { BotMessageSquare } from 'lucide-react';
import MarkdownRenderer from './Markdown';
import { Message } from '@/models/types/chatTypes';

interface ChatMessageProps {
  message: Message;
  viewType?: 'split' | 'document' | 'chat';
}

const ChatMessage = ({ message, viewType = 'split' }: ChatMessageProps) => {
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

  // Get container classes based on viewType and sender
  const getContainerClasses = () => {
    let containerClasses = 'mb-4 flex w-full ';
    containerClasses += isHuman ? 'justify-end pr-1' : 'justify-start pl-1';
    return containerClasses;
  };

  // Get message wrapper classes based on viewType
  const getWrapperClasses = () => {
    let wrapperClasses = 'flex ';
    wrapperClasses += isHuman ? 'flex-row-reverse' : 'flex-row';

    // Adjust width based on view type
    if (viewType === 'chat') {
      wrapperClasses += ' max-w-3xl'; // Wider for chat view
    } else if (viewType === 'split') {
      wrapperClasses += ' max-w-full w-11/12'; // Almost full width for split view
    } else {
      wrapperClasses += ' max-w-2xl'; // Default
    }

    return wrapperClasses;
  };

  // Get message bubble classes
  const getBubbleClasses = () => {
    return `chat-bubble prose rounded-2xl p-4 shadow-md ${
      isHuman
        ? 'rounded-br-none bg-dark-700/80 text-light-300 shadow-dark-900/20'
        : 'rounded-bl-none bg-light-800/70 text-light-300 shadow-dark-800/15'
    }`;
  };

  return (
    <div
      className={getContainerClasses()}
      role='group'
      aria-labelledby={`message-${message.id || 'temp'}-sender`}
    >
      <div className={getWrapperClasses()}>
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
                <div className='business-light:bg-primary business-dark:bg-primary neon-light:bg-accent2 neon-dark:bg-accent2 flex h-8 w-8 items-center justify-center rounded-full'>
                  <span className='business-light:text-primary-foreground business-dark:text-primary-foreground neon-light:text-white neon-dark:text-white text-xs font-bold'>
                    {user?.firstName?.[0] || 'U'}
                  </span>
                </div>
              )
            ) : (
              <div className='business-light:bg-primary business-dark:bg-primary neon-light:bg-accent neon-dark:bg-accent flex h-8 w-8 items-center justify-center rounded-full'>
                <BotMessageSquare className='business-light:text-primary-foreground business-dark:text-primary-foreground neon-light:text-white neon-dark:text-white h-5 w-5' />
              </div>
            )}
          </div>
        </div>

        {/* Message Content */}
        <div
          className={getBubbleClasses()}
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
