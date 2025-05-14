import React from 'react';
import { FaTwitter, FaFacebookF, FaTiktok, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';
const SocialLinks = () => {
  return (
    <div className='flex w-full items-center justify-start space-x-4 py-4 sm:w-1/2 md:w-1/4 lg:w-1/6'>
      <Link
        href='https://x.com/DocuBotAI'
        target='_blank'
        rel='noopener noreferrer'
        aria-label='Twitter'
      >
        <FaTwitter className='text-xl text-light-700' />
      </Link>
      <Link
        href='https://www.facebook.com/DocuBotAI/'
        target='_blank'
        rel='noopener noreferrer'
        aria-label='Facebook'
      >
        <FaFacebookF className='text-xl text-light-700' />
      </Link>
      {/* <Link
        href='https://tiktok.com'
        target='_blank'
        rel='noopener noreferrer'
        aria-label='TikTok'
      >
        <FaTiktok className='text-xl text-light-700' />
      </Link>
      <Link
        href='https://youtube.com'
        target='_blank'
        rel='noopener noreferrer'
        aria-label='YouTube'
      >
        <FaYoutube className='text-xl text-light-700' />
      </Link> */}
    </div>
  );
};

export default SocialLinks;
