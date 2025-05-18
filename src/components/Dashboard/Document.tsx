'use client';

import React, { useTransition } from 'react';
import {
  FileText,
  Download,
  Trash2,
  File,
  FileDigit,
  FileType,
  FileArchive,
  MessageSquare,
  Calendar,
  HardDrive,
} from 'lucide-react';
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
  viewType: 'grid' | 'list';
  createdAt?: Date;
}

const Document = ({
  id,
  name,
  size,
  downloadURL,
  type,
  fileIcon,
  viewType,
  createdAt,
}: DocumentProps) => {
  const [isDeleting, startTransaction] = useTransition();
  const { hasActiveMembership, loading: membershipLoading } = useSubscription();

  const canDelete = hasActiveMembership && !membershipLoading;

  const handleDelete = () => {
    const prompt = window.confirm(`Are you sure you want to delete document "${name}"?`);
    if (prompt) {
      startTransaction(async () => {
        await deleteDocument(id);
      });
    }
  };

  // Get icon based on file type or icon string
  const getFileIcon = (sizeClass = 'h-12 w-12') => {
    if (fileIcon) {
      switch (fileIcon) {
        case FILE_TYPE_ICONS['application/pdf']:
          return <FileText className={cn(sizeClass, 'text-blue-500')} aria-hidden='true' />;
        case FILE_TYPE_ICONS[
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]:
          return <FileDigit className={cn(sizeClass, 'text-green-500')} aria-hidden='true' />;
        case FILE_TYPE_ICONS['text/plain']:
          return <FileText className={cn(sizeClass, 'text-purple-500')} aria-hidden='true' />;
        case FILE_TYPE_ICONS['text/markdown']:
          return <FileType className={cn(sizeClass, 'text-orange-500')} aria-hidden='true' />;
        case FILE_TYPE_ICONS['text/rtf']:
          return <FileArchive className={cn(sizeClass, 'text-red-500')} aria-hidden='true' />;
        default:
          return <File className={cn(sizeClass, 'text-blue-500')} aria-hidden='true' />;
      }
    }

    if (type) {
      const iconType = FILE_TYPE_ICONS[type as keyof typeof FILE_TYPE_ICONS];
      if (iconType) {
        switch (iconType) {
          case 'pdf':
            return <FileText className={cn(sizeClass, 'text-blue-500')} aria-hidden='true' />;
          case 'docx':
            return <FileDigit className={cn(sizeClass, 'text-green-500')} aria-hidden='true' />;
          case 'txt':
            return <FileText className={cn(sizeClass, 'text-purple-500')} aria-hidden='true' />;
          case 'md':
            return <FileType className={cn(sizeClass, 'text-orange-500')} aria-hidden='true' />;
          case 'rtf':
            return <FileArchive className={cn(sizeClass, 'text-red-500')} aria-hidden='true' />;
          default:
            return <File className={cn(sizeClass, 'text-blue-500')} aria-hidden='true' />;
        }
      }
    }

    return <FileText className={cn(sizeClass, 'text-blue-500')} aria-hidden='true' />;
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get file type display name
  const getFileTypeDisplay = () => {
    const fileExt = name.split('.').pop()?.toLowerCase();
    switch (fileExt) {
      case 'pdf':
        return 'PDF';
      case 'docx':
        return 'DOCX';
      case 'txt':
        return 'TXT';
      case 'md':
        return 'MD';
      case 'rtf':
        return 'RTF';
      default:
        return 'DOC';
    }
  };

  // Format date for display
  const formatDate = (date?: Date): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Action buttons component
  const ActionButtons = ({ className = '' }: { className?: string }) => (
    <div
      className={cn('flex items-center space-x-2', className)}
      role='group'
      aria-label={`Actions for ${name}`}
    >
      {/* Chat Button */}
      <Button asChild variant='outline' size='sm' className='flex items-center space-x-1'>
        <Link href={`/dashboard/documents/${id}/`} aria-label={`Chat with ${name}`}>
          <MessageSquare className='h-4 w-4' aria-hidden='true' />
          <span className='hidden sm:inline'>Chat</span>
        </Link>
      </Button>

      {/* Download Button */}
      <Button asChild variant='outline' size='sm' className='flex items-center space-x-1'>
        <a href={downloadURL} download aria-label={`Download ${name}`}>
          <Download className='h-4 w-4' aria-hidden='true' />
          <span className='hidden sm:inline'>Download</span>
        </a>
      </Button>

      {/* Delete Button */}
      <Button
        variant='outline'
        size='sm'
        disabled={isDeleting || !canDelete}
        onClick={handleDelete}
        className={cn(
          'flex items-center space-x-1',
          !canDelete && 'cursor-not-allowed opacity-50'
        )}
        aria-label={`Delete ${name}${!hasActiveMembership ? ' (requires Pro membership)' : ''}`}
        aria-describedby={!hasActiveMembership ? `delete-restriction-${id}` : undefined}
      >
        <Trash2 className='h-4 w-4' aria-hidden='true' />
        <span className='hidden sm:inline'>
          {!hasActiveMembership && <span className='text-xs'>Pro </span>}
          {isDeleting ? 'Deleting...' : 'Delete'}
        </span>
      </Button>

      {!hasActiveMembership && (
        <div id={`delete-restriction-${id}`} className='sr-only'>
          Document deletion requires a Pro membership. Upgrade to delete documents.
        </div>
      )}
    </div>
  );

  // Grid View (Card)
  if (viewType === 'grid') {
    return (
      <article
        className='group flex flex-col overflow-hidden rounded-lg border border-light-600/30 bg-light-700/50 transition-all duration-200 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 hover:border-accent/50 hover:shadow-lg dark:border-light-800/20 dark:bg-dark-600/40 dark:hover:border-accent/50'
        aria-labelledby={`document-title-${id}`}
        aria-describedby={`document-info-${id}`}
      >
        {/* Document Header with Icon */}
        <Link
          href={`/dashboard/documents/${id}/`}
          className='flex items-center justify-center p-6 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent'
          aria-label={`Open ${name} in document viewer`}
        >
          <div className='flex flex-col items-center space-y-3'>
            {getFileIcon('h-16 w-16')}
            <span className='rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent'>
              {getFileTypeDisplay()}
            </span>
          </div>
        </Link>

        {/* Document Info */}
        <div className='flex flex-1 flex-col p-4 pt-0'>
          <div className='flex-1'>
            <h3
              id={`document-title-${id}`}
              className='mb-2 line-clamp-2 text-sm font-semibold text-dark-800 dark:text-light-200'
              title={name}
            >
              {name}
            </h3>

            <div
              id={`document-info-${id}`}
              className='space-y-1 text-xs text-dark-600 dark:text-light-400'
            >
              <div className='flex items-center space-x-1'>
                <HardDrive className='h-3 w-3' aria-hidden='true' />
                <span>{formatFileSize(size)}</span>
              </div>
              {createdAt && (
                <div className='flex items-center space-x-1'>
                  <Calendar className='h-3 w-3' aria-hidden='true' />
                  <span>{formatDate(createdAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='mt-4 border-t border-light-600/20 pt-4 dark:border-light-800/20'>
            <ActionButtons className='justify-center' />
          </div>
        </div>
      </article>
    );
  }

  // List View
  return (
    <article
      className='group grid grid-cols-1 gap-4 rounded-lg border border-light-600/30 bg-light-700/50 p-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 hover:border-accent/50 hover:shadow-md dark:border-light-800/20 dark:bg-dark-600/40 dark:hover:border-accent/50 sm:grid-cols-12 sm:items-center sm:gap-4'
      aria-labelledby={`document-title-${id}`}
      aria-describedby={`document-info-${id}`}
    >
      {/* Icon and Name */}
      <div className='col-span-1 flex items-center space-x-3 sm:col-span-5'>
        <Link
          href={`/dashboard/documents/${id}/`}
          className='flex-shrink-0 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'
          aria-label={`Open ${name} in document viewer`}
        >
          {getFileIcon('h-10 w-10')}
        </Link>
        <div className='min-w-0 flex-1'>
          <h3
            id={`document-title-${id}`}
            className='truncate text-sm font-semibold text-dark-800 group-hover:text-accent dark:text-light-200'
            title={name}
          >
            <Link
              href={`/dashboard/documents/${id}/`}
              className='rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'
            >
              {name}
            </Link>
          </h3>
          {createdAt && (
            <p className='text-xs text-dark-600 dark:text-light-400 sm:hidden'>
              {formatDate(createdAt)}
            </p>
          )}
        </div>
      </div>

      {/* Type */}
      <div className='hidden sm:col-span-2 sm:block'>
        <span className='inline-flex items-center rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent'>
          {getFileTypeDisplay()}
        </span>
      </div>

      {/* Size */}
      <div className='hidden sm:col-span-2 sm:block'>
        <div id={`document-info-${id}`} className='text-sm text-dark-600 dark:text-light-400'>
          {formatFileSize(size)}
        </div>
      </div>

      {/* Actions */}
      <div className='col-span-1 sm:col-span-3 sm:justify-end'>
        <ActionButtons className='justify-start sm:justify-end' />
      </div>

      {/* Mobile-only additional info */}
      <div className='col-span-1 text-xs text-dark-600 dark:text-light-400 sm:hidden'>
        <div className='flex items-center justify-between'>
          <span>{formatFileSize(size)}</span>
          <span className='inline-flex items-center rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent'>
            {getFileTypeDisplay()}
          </span>
        </div>
      </div>
    </article>
  );
};

export default Document;
