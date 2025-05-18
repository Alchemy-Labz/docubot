'use client';

import React, { useTransition } from 'react';
import { FileText, Download, Trash2, File, FileDigit, FileType, FileArchive } from 'lucide-react';
import Link from 'next/link';
import useSubscription from '@/hooks/useSubscription';
import { Button } from '../ui/button';
import { deleteDocument } from '@/actions/deleteDocument';
import { cn } from '@/util/utils';
import { FILE_TYPE_ICONS } from '@/lib/constants/appConstants';

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
          return <FileText className='text-white' size={48} aria-hidden='true' />;
        case FILE_TYPE_ICONS[
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]:
          return <FileDigit className='text-white' size={48} aria-hidden='true' />;
        case FILE_TYPE_ICONS['text/plain']:
          return <FileText className='text-white' size={48} aria-hidden='true' />;
        case FILE_TYPE_ICONS['text/markdown']:
          return <FileType className='text-white' size={48} aria-hidden='true' />;
        case FILE_TYPE_ICONS['text/rtf']:
          return <FileArchive className='text-white' size={48} aria-hidden='true' />;
        default:
          return <File className='text-white' size={48} aria-hidden='true' />;
      }
    }

    if (type) {
      const iconType = FILE_TYPE_ICONS[type as keyof typeof FILE_TYPE_ICONS];
      if (iconType) {
        switch (iconType) {
          case 'pdf':
            return <FileText className='text-white' size={48} aria-hidden='true' />;
          case 'docx':
            return <FileDigit className='text-white' size={48} aria-hidden='true' />;
          case 'txt':
            return <FileText className='text-white' size={48} aria-hidden='true' />;
          case 'md':
            return <FileType className='text-white' size={48} aria-hidden='true' />;
          case 'rtf':
            return <FileArchive className='text-white' size={48} aria-hidden='true' />;
          default:
            return <File className='text-white' size={48} aria-hidden='true' />;
        }
      }
    }

    // Default to generic file icon
    return <FileText className='text-white' size={48} aria-hidden='true' />;
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

  // Get file type description for accessibility
  const getFileTypeDescription = () => {
    const fileExt = name.split('.').pop()?.toLowerCase();
    switch (fileExt) {
      case 'pdf':
        return 'PDF document';
      case 'docx':
        return 'Word document';
      case 'txt':
        return 'Text file';
      case 'md':
        return 'Markdown file';
      case 'rtf':
        return 'Rich text file';
      default:
        return 'Document file';
    }
  };

  return (
    <article
      key={id}
      className='m-2 flex h-80 w-48 flex-col overflow-hidden rounded-lg bg-gray-100 shadow-md transition-transform focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 hover:scale-105 hover:shadow-lg'
      aria-labelledby={`document-title-${id}`}
      aria-describedby={`document-info-${id}`}
    >
      {/* Document Icon/Link */}
      <Link
        href={`/dashboard/documents/${id}/`}
        className={cn(
          'flex items-center justify-center p-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent',
          getBackgroundColor()
        )}
        aria-label={`Open ${name} in document viewer`}
        aria-describedby={`document-type-${id}`}
      >
        {getFileIcon()}
      </Link>

      {/* Document Info */}
      <div className='flex flex-grow flex-col justify-between p-4'>
        <div>
          <h3
            id={`document-title-${id}`}
            className='mb-1 truncate text-sm font-bold text-gray-800'
            title={name}
          >
            {name}
          </h3>
          <div id={`document-info-${id}`} className='text-xs text-gray-600'>
            <p>Size: {formatFileSize(size)}</p>
          </div>
          <div id={`document-type-${id}`} className='sr-only'>
            {getFileTypeDescription()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col space-y-2' role='group' aria-label={`Actions for ${name}`}>
          <a
            href={downloadURL}
            download
            className='flex w-full items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            aria-label={`Download ${name}`}
          >
            <Download className='mr-2' size={14} aria-hidden='true' />
            Download
          </a>

          <Button
            variant='default'
            disabled={isDeleting || !canDelete}
            onClick={handleDelete}
            className='flex w-full items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            aria-label={`Delete ${name}${!hasActiveMembership ? ' (requires Pro membership)' : ''}`}
            aria-describedby={!hasActiveMembership ? `delete-restriction-${id}` : undefined}
          >
            <Trash2 className='mr-1' size={14} aria-hidden='true' />
            {!hasActiveMembership && (
              <span className='mr-1 text-xs text-light-600'>Pro Feature </span>
            )}
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>

          {!hasActiveMembership && (
            <div id={`delete-restriction-${id}`} className='sr-only'>
              Document deletion requires a Pro membership. Upgrade to delete documents.
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default Document;
