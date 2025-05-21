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

  // Get positioning classes based on viewType and sender
  const getPositioningClasses = () => {
    const classes = {
      container: '',
      wrapper: '',
      bubble: '',
    };

    // Container classes - base positioning with extreme justification
    classes.container = `mb-4 flex w-full ${isHuman ? 'justify-end' : 'justify-start'}`;

    // Wrapper classes - width control and direction
    classes.wrapper = `flex ${isHuman ? 'flex-row-reverse' : 'flex-row'}`;

    // Different widths based on view type
    if (viewType === 'chat') {
      classes.wrapper += ' max-w-3xl'; // Very wide for chat view
    } else if (viewType === 'split') {
      classes.wrapper += ' max-w-full w-11/12'; // Almost full width for split view
    } else {
      classes.wrapper += ' max-w-2xl'; // Medium width for document view
    }

    // Message bubble styling with enhanced visuals
    classes.bubble = `prose rounded-2xl p-4 shadow-md ${
      isHuman
        ? 'rounded-br-none bg-dark-700/80 text-light-300 shadow-dark-900/20'
        : 'rounded-bl-none bg-light-800/70 text-light-300 shadow-dark-800/15'
    }`;

    return classes;
  };

  const classes = getPositioningClasses();

  return (
    <div
      className={classes.container}
      role='group'
      aria-labelledby={`message-${message.id || 'temp'}-sender`}
    >
      <div className={classes.wrapper}>
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
          className={classes.bubble}
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
