'use client';

import React, { useTransition } from 'react';
import { FileText, Download, Trash2, File, FileDigit, FileType, FileArchive } from 'lucide-react';
import Link from 'next/link';
import useSubscription from '@/hooks/useSubscription';
import { Button } from '../ui/button';
import { deleteDocument } from '@/actions/deleteDocument';
import { cn } from '@/util/utils';
import { FILE_TYPE_ICONS, DEFAULT_FILE_ICON } from '@/lib/constants/appConstants';

interface DocumentProps {
  id: string;
  name: string;
  size: number;
  downloadURL: string;
  type?: string;
  fileIcon?: string;
}

const Document = ({ id, name, size, downloadURL, type, fileIcon }: DocumentProps) => {
  const [isDeleting, startTransaction] = useTransition();

  // Use the hook safely
  const { hasActiveMembership, loading: membershipLoading } = useSubscription();

  // Only enable deletion when we know membership status for sure
  const canDelete = hasActiveMembership && !membershipLoading;

  const handleDelete = () => {
    const prompt = window.confirm(`Are you sure you want to delete document ${name}?`);
    if (prompt) {
      startTransaction(async () => {
        await deleteDocument(id);
      });
    }
  };

  // Get icon based on file type or icon string - using constants
  const getFileIcon = () => {
    if (fileIcon) {
      switch (fileIcon) {
        case FILE_TYPE_ICONS['application/pdf']:
          return <FileText className='text-white' size={48} />;
        case FILE_TYPE_ICONS[
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]:
          return <FileDigit className='text-white' size={48} />;
        case FILE_TYPE_ICONS['text/plain']:
          return <FileText className='text-white' size={48} />;
        case FILE_TYPE_ICONS['text/markdown']:
          return <FileType className='text-white' size={48} />;
        case FILE_TYPE_ICONS['text/rtf']:
          return <FileArchive className='text-white' size={48} />;
        default:
          return <File className='text-white' size={48} />;
      }
    }

    if (type) {
      const iconType = FILE_TYPE_ICONS[type as keyof typeof FILE_TYPE_ICONS];
      if (iconType) {
        switch (iconType) {
          case 'pdf':
            return <FileText className='text-white' size={48} />;
          case 'docx':
            return <FileDigit className='text-white' size={48} />;
          case 'txt':
            return <FileText className='text-white' size={48} />;
          case 'md':
            return <FileType className='text-white' size={48} />;
          case 'rtf':
            return <FileArchive className='text-white' size={48} />;
          default:
            return <File className='text-white' size={48} />;
        }
      }
    }

    // Default to generic file icon
    return <FileText className='text-white' size={48} />;
  };

  // Get background color based on file type
  const getBackgroundColor = () => {
    const fileExt = name.split('.').pop()?.toLowerCase();

    switch (fileExt) {
      case 'pdf':
        return 'bg-blue-500';
      case 'docx':
        return 'bg-green-500';
      case 'txt':
        return 'bg-purple-500';
      case 'md':
        return 'bg-orange-500';
      case 'rtf':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div
      key={id}
      className='m-2 flex h-80 w-48 flex-col overflow-hidden rounded-lg bg-gray-100 shadow-md transition-transform hover:scale-105 hover:shadow-lg'
    >
      <Link
        href={`/dashboard/documents/${id}/`}
        className={cn('flex items-center justify-center p-4', getBackgroundColor())}
      >
        {getFileIcon()}
      </Link>
      <div className='flex flex-grow flex-col justify-between p-4'>
        <div>
          <h3 className='mb-1 truncate text-sm font-bold text-gray-800'>{name}</h3>
          <p className='text-xs text-gray-600'>Size: {formatFileSize(size)}</p>
        </div>
        <div className='flex flex-col space-y-2'>
          <a
            href={downloadURL}
            download
            className='flex w-full items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-blue-600'
            aria-label={`Download ${name}`}
          >
            <Download className='mr-2' size={14} />
            Download
          </a>
          <Button
            variant='default'
            disabled={isDeleting || !canDelete}
            onClick={handleDelete}
            className='flex w-full items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-red-600'
            aria-label={`Delete ${name}`}
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
