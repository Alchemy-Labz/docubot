'use client';

import React, { useTransition } from 'react';
import { FileText, Download, Trash2 } from 'lucide-react';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSubscription from '@/hooks/useSubscription';
import { Button } from '../ui/button';
import { deleteDocument } from '@/actions/deleteDocument';

interface DocumentProps {
  id: string;
  name: string;
  size: number;
  downloadURL: string;
}

const Document = ({ id, name, size, downloadURL }: DocumentProps) => {
  // const router = useRouter();
  const [isDeleting, startTransaction] = useTransition();
  const { hasActiveMembership } = useSubscription();

  return (
    <div
      key={id}
      className='m-2 flex h-80 w-48 flex-col overflow-hidden rounded-lg bg-gray-100 shadow-md'
    >
      <Link
        href={`/dashboard/documents/${id}/`}
        className='flex items-center justify-center bg-blue-500 p-4'
      >
        <FileText className='text-white' size={48} />
      </Link>
      <div className='flex flex-grow flex-col justify-between p-4'>
        <div>
          <h3 className='mb-1 truncate text-sm font-bold text-gray-800'>{name}</h3>
          <p className='text-xs text-gray-600'>Size: {size} bytes</p>
        </div>
        <div className='flex flex-col space-y-2'>
          <a
            href={downloadURL}
            download
            className='flex w-full items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-blue-600'
          >
            <Download className='mr-2' size={14} />
            Download
          </a>
          <Button
            variant='default'
            disabled={isDeleting || !hasActiveMembership}
            onClick={() => {
              const promt = window.confirm(`Are you sure you want to delete document ${name}?`);
              if (promt) {
                startTransaction(async () => {
                  await deleteDocument(id);
                });
              }
            }}
            className='flex w-full items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-red-600'
          >
            <Trash2 className='mr-1' size={14} />
            {!hasActiveMembership && (
              <span className='mr-1 text-xs text-light-600'>Pro Feature </span>
            )}
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Document;
