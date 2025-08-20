/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import {
  CircleArrowDown,
  File,
  FileArchive,
  FileText,
  FileType,
  Hammer,
  Lock,
  Rocket,
  Save,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useUpload, { UploadStatusText } from '@/hooks/useUpload';
import useSubscription from '@/hooks/useSubscription';
import { MdError } from 'react-icons/md';
import {
  FILE_UPLOAD,
  FILE_TYPE_LABELS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PLAN_TYPES,
} from '@/lib/constants/appConstants';
import { useThemeClasses } from '@/components/Global/ThemeAwareWrapper';

const FileUploader = () => {
  const { progress, status, docId, handleUploadDocument } = useUpload();
  const { isOverFileLimit, docsLoading, planType } = useSubscription();
  const router = useRouter();
  const { getClasses } = useThemeClasses();

  // Get file size limit based on user's plan
  const maxFileSize = FILE_UPLOAD.getMaxFileSizeForPlan(planType);
  const maxFileSizeDisplay = FILE_UPLOAD.formatFileSize(maxFileSize);

  // File type icons mapping
  const fileTypeIcons = useMemo(
    () => ({
      'application/pdf': <FileText className='h-10 w-10 text-accent' aria-hidden='true' />,
      'text/plain': <FileText className='h-10 w-10 text-accent' aria-hidden='true' />,
      'text/markdown': <FileType className='h-10 w-10 text-accent' aria-hidden='true' />,
      'text/rtf': <FileArchive className='h-10 w-10 text-accent' aria-hidden='true' />,
      default: <File className='h-10 w-10 text-accent' aria-hidden='true' />,
    }),
    []
  );

  useEffect(() => {
    if (docId) {
      router.push(`/dashboard/documents/${docId}`);
    }
  }, [docId, router, status]);

  const getFileTypeDisplay = (fileType: string) => {
    return fileTypeIcons[fileType as keyof typeof fileTypeIcons] || fileTypeIcons.default;
  };

  const getFileTypeLabel = useCallback((fileType: string) => {
    return FILE_TYPE_LABELS[fileType as keyof typeof FILE_TYPE_LABELS] || 'Document';
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return; // This case will be handled by onDropRejected
      }

      const file = acceptedFiles[0];
      if (file) {
        if (!isOverFileLimit && !docsLoading) {
          try {
            await handleUploadDocument(file);
            toast.success(
              SUCCESS_MESSAGES.DOCUMENT_CONSUMED(getFileTypeLabel(file.type), file.name)
            );
          } catch (error) {
            if (error instanceof Error) {
              toast.error(`${ERROR_MESSAGES.UPLOAD_FAILED}: ${error.message}`);
            } else {
              toast.error('An unknown error occurred during upload');
            }
          }
        } else {
          toast.error(ERROR_MESSAGES.SUBSCRIPTION_LIMIT_REACHED(planType));
        }
      }
    },
    [handleUploadDocument, isOverFileLimit, docsLoading, getFileTypeLabel]
  );

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const rejection = fileRejections[0];
    if (rejection) {
      const { errors } = rejection;
      if (errors.length > 0) {
        const error = errors[0];
        switch (error.code) {
          case 'file-too-large':
            toast.error(ERROR_MESSAGES.FILE_TOO_LARGE);
            break;
          case 'file-invalid-type':
            toast.error(ERROR_MESSAGES.INVALID_FILE_TYPE);
            break;
          default:
            toast.error(`Upload error: ${error.message}`);
        }
      }
    } else {
      toast.error('Please upload a file');
    }
  }, []);

  const statusIcons: {
    [key in UploadStatusText]: React.JSX.Element;
  } = {
    [UploadStatusText.UPLOADING]: (
      <CircleArrowDown className='h-20 w-20 text-accent' aria-hidden='true' />
    ),
    [UploadStatusText.UPLOADED]: <Rocket className='h-20 w-20 text-accent' aria-hidden='true' />,
    [UploadStatusText.SAVING]: <Save className='h-20 w-20 text-accent' aria-hidden='true' />,
    [UploadStatusText.GENERATING]: <Hammer className='h-20 w-20 text-accent' aria-hidden='true' />,
    [UploadStatusText.ERROR]: <MdError className='h-20 w-20 text-accent' aria-hidden='true' />,
    [UploadStatusText.AUTHENTICATING]: (
      <Lock className='h-20 w-20 text-accent' aria-hidden='true' />
    ),
  };

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept, acceptedFiles } =
    useDropzone({
      onDrop,
      onDropRejected,
      maxFiles: 1,
      maxSize: maxFileSize,
      accept: FILE_UPLOAD.ACCEPTED_FILE_TYPES,
    });

  const uploadInProgress = progress !== null && progress >= 0 && progress <= 100;
  const currentFile = acceptedFiles[0];

  return (
    <div className='font mx-auto flex max-w-7xl flex-col items-center gap-4'>
      {/* Consistent container height to prevent layout shifts */}
      <div className='mt-12 flex min-h-[24rem] w-[75%] items-center justify-center'>
        {/* File Loading Logic  */}
        {uploadInProgress ? (
          <div className='flex flex-col items-center justify-center gap-5'>
            <div
              className={`radial-progress border-4 border-accent2 bg-accent text-light-200 shadow-lg ${
                progress === 100 && 'hidden'
              }`}
              role='progressbar'
              style={
                {
                  '--value': progress,
                  '--size': '12rem',
                  '--thickness': '1.3rem',
                } as React.CSSProperties
              }
              aria-valuenow={progress || 0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Upload progress: ${progress}% complete`}
            >
              <span className='sr-only'>{progress}% uploaded</span>
              <span className='text-lg font-bold'>{progress}%</span>
            </div>

            {/* Status Text with improved contrast */}
            <div role='status' aria-live='polite' className='text-center'>
              <div className='flex flex-col items-center gap-3'>
                {statusIcons[status! as keyof typeof statusIcons]}
                <p className='animate-pulse text-lg font-semibold text-accent2 dark:text-accent'>
                  {status}
                </p>
              </div>
            </div>

            {/* File info with better styling */}
            {currentFile && (
              <div className='flex flex-col items-center gap-2 rounded-lg bg-light-400/50 p-4 dark:bg-dark-700/50'>
                {getFileTypeDisplay(currentFile.type)}
                <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  <span className='sr-only'>Uploading file: </span>
                  {currentFile.name}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  {FILE_UPLOAD.formatFileSize(currentFile.size)}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Upload Area - consistent sizing to prevent layout shifts */
          <div
            {...getRootProps()}
            className={getClasses({
              base: `flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isDragAccept ? 'shadow-lg' : isFocused ? 'shadow-lg' : ''
              }`,
              business: isDragAccept
                ? 'border-primary bg-primary/10 text-primary focus:ring-primary'
                : 'border-border bg-muted/30 text-foreground hover:bg-muted/50 focus:ring-primary',
              neonLight: isDragAccept
                ? 'border-accent3 bg-accent4/50 text-accent2 focus:ring-accent'
                : 'border-accent bg-light-500/30 text-accent2 hover:border-accent3 hover:bg-light-400/40 focus:ring-accent',
              neonDark: isDragAccept
                ? 'border-accent3 bg-accent/40 text-accent2 focus:ring-accent'
                : 'border-accent2 bg-dark-600/30 text-accent hover:bg-dark-500/40 focus:ring-accent',
            })}
            role='button'
            tabIndex={0}
            aria-label='File upload area. Click to select files or drag and drop documents here.'
            aria-describedby='upload-instructions upload-file-types'
          >
            <input
              {...getInputProps()}
              aria-label='File input for document upload'
              aria-describedby='upload-instructions'
            />

            <div className='flex flex-col items-center justify-center space-y-6'>
              <Image src='/logo.png' alt='DocuBot logo' width={75} height={75} priority />

              {isDragActive ? (
                <div role='status' aria-live='polite' className='flex flex-col items-center gap-4'>
                  <Rocket
                    className='h-14 w-14 animate-ping text-accent2 dark:text-accent'
                    aria-hidden='true'
                  />
                  <p
                    id='upload-instructions'
                    className='text-lg font-semibold text-accent2 dark:text-accent'
                  >
                    Drop Documents for DocuBot here...
                  </p>
                </div>
              ) : (
                <>
                  <CircleArrowDown
                    className={getClasses({
                      base: 'h-14 w-14 animate-caret-blink',
                      business: 'text-primary',
                      neonLight: 'text-accent2',
                      neonDark: 'text-accent',
                    })}
                    aria-hidden='true'
                  />
                  <div className='space-y-3'>
                    <p
                      id='upload-instructions'
                      className={getClasses({
                        base: 'text-lg font-semibold',
                        business: 'text-foreground',
                        neonLight: 'text-gray-700',
                        neonDark: 'text-gray-200',
                      })}
                    >
                      Feed me some Documents by dropping them in front of me or clicking here.
                    </p>
                    <p
                      className={getClasses({
                        base: 'text-sm font-medium',
                        business: 'text-muted-foreground',
                        neonLight: 'text-gray-600',
                        neonDark: 'text-gray-300',
                      })}
                    >
                      Supports PDF, TXT, MD, and RTF files. Maximum file size: {maxFileSizeDisplay}
                    </p>
                    <p
                      className={getClasses({
                        base: 'text-xs',
                        business: 'text-muted-foreground',
                        neonLight: 'text-gray-500',
                        neonDark: 'text-gray-400',
                      })}
                    >
                      Your current plan:{' '}
                      <span className='font-semibold capitalize'>{planType}</span>
                    </p>
                  </div>

                  <div
                    id='upload-file-types'
                    className='flex max-w-md flex-wrap items-center justify-center gap-3'
                    aria-label='Supported file types'
                  >
                    <div
                      className={getClasses({
                        base: 'flex items-center gap-1 rounded-md p-1 text-sm',
                        business: 'bg-muted',
                        neonLight: 'bg-light-600/50',
                        neonDark: 'bg-dark-700/50',
                      })}
                    >
                      <FileText className='h-4 w-4' aria-hidden='true' />
                      <span>PDF</span>
                    </div>
                    <div
                      className={getClasses({
                        base: 'flex items-center gap-1 rounded-md p-1 text-sm',
                        business: 'bg-muted',
                        neonLight: 'bg-light-600/50',
                        neonDark: 'bg-dark-700/50',
                      })}
                    >
                      <FileText className='h-4 w-4' aria-hidden='true' />
                      <span>TXT</span>
                    </div>
                    <div
                      className={getClasses({
                        base: 'flex items-center gap-1 rounded-md p-1 text-sm',
                        business: 'bg-muted',
                        neonLight: 'bg-light-600/50',
                        neonDark: 'bg-dark-700/50',
                      })}
                    >
                      <FileType className='h-4 w-4' aria-hidden='true' />
                      <span>MD</span>
                    </div>
                    <div
                      className={getClasses({
                        base: 'flex items-center gap-1 rounded-md p-1 text-sm',
                        business: 'bg-muted',
                        neonLight: 'bg-light-600/50',
                        neonDark: 'bg-dark-700/50',
                      })}
                    >
                      <FileArchive className='h-4 w-4' aria-hidden='true' />
                      <span>RTF</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
