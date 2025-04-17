import React from 'react';
import { Avatar, AvatarFallback } from '@/c/ui/avatar';
import { cn } from '@/lib/util/utils';
import Image from 'next/image';

const UserAvatar = ({
  name,
  image,
  className,
}: {
  name?: string;
  image?: string;
  className?: string;
}) => {
  return (
    <Avatar
      className={cn(
        'bg-cslight-300 text-csdark-700 dark:bg-csdark-700 dark:text-cslight-400',
        className
      )}
    >
      {image && (
        <Image
          src={image}
          alt={name || ''}
          width={40}
          height={40}
          referrerPolicy='no-referrer'
          className='rounded-full'
        />
      )}
      {/* <AvatarImage src='./alch.jpg' /> */}
      <AvatarFallback
        delayMs={1000}
        className='text-csdark-700 dark:bg-csdark-700 dark:text-cslight-400 text-lg'
      >
        {name
          ?.split(' ')
          .map((n) => n[0])
          .join('')}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
