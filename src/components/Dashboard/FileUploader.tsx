/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import {
  // CheckCircle,
  CircleArrowDown,
  File,
  FileArchive,
  // FileDigit,
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
} from '@/lib/constants/appConstants';

const FileUploader = () => {
  const { progress, status, docId, handleUploadDocument } = useUpload();
  const { isOverFileLimit, docsLoading } = useSubscription();
  const router = useRouter();

  // File type icons mapping
  const fileTypeIcons = useMemo(
    () => ({
      'application/pdf': <FileText className='h-10 w-10 text-accent' />,
      // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': (
      //   <FileDigit className='h-10 w-10 text-accent' />
      // ),
      'text/plain': <FileText className='h-10 w-10 text-accent' />,
      'text/markdown': <FileType className='h-10 w-10 text-accent' />,
      'text/rtf': <FileArchive className='h-10 w-10 text-accent' />,
      default: <File className='h-10 w-10 text-accent' />,
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
          toast.error(ERROR_MESSAGES.SUBSCRIPTION_LIMIT_REACHED);
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
    [key in UploadStatusText]: JSX.Element;
  } = {
    [UploadStatusText.UPLOADING]: <CircleArrowDown className='h-20 w-20 text-accent' />,
    [UploadStatusText.UPLOADED]: <Rocket className='h-20 w-20 text-accent' />,
    [UploadStatusText.SAVING]: <Save className='h-20 w-20 text-accent' />,
    [UploadStatusText.GENERATING]: <Hammer className='h-20 w-20 text-accent' />,
    [UploadStatusText.ERROR]: <MdError className='h-20 w-20 text-accent' />,
    [UploadStatusText.AUTHENTICATING]: <Lock className='h-20 w-20 text-accent' />,
  };

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept, acceptedFiles } =
    useDropzone({
      onDrop,
      onDropRejected,
      maxFiles: 1,
      maxSize: FILE_UPLOAD.MAX_FILE_SIZE,
      accept: FILE_UPLOAD.ACCEPTED_FILE_TYPES,
    });

  const uploadInProgress = progress !== null && progress >= 0 && progress <= 100;
  const currentFile = acceptedFiles[0];

  return (
    <div className='font mx-auto flex max-w-7xl flex-col items-center gap-4'>
      {/* File Loading Logic  */}
      {uploadInProgress && (
        <div className='mt-32 flex flex-col items-center justify-center gap-5'>
          <div
            className={`radial-progress border-4 border-accent2 bg-accent text-light-200 ${
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
          >
            {progress}%
          </div>
          {statusIcons[status! as keyof typeof statusIcons]}
          <p className='animate-pulse text-accent2'>{status}</p>
          {currentFile && (
            <div className='flex flex-col items-center gap-2'>
              {getFileTypeDisplay(currentFile.type)}
              <p className='text-sm text-accent2'>{currentFile.name}</p>
            </div>
          )}
        </div>
      )}

      {!uploadInProgress && (
        <div
          {...getRootProps()}
          className={`mt-12 flex h-86 w-[75%] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-10 text-center text-accent2 dark:border-accent2 dark:text-accent ${
            isDragAccept
              ? 'border-accent3 bg-accent4/50 dark:border-accent3 dark:bg-accent/40 dark:text-accent2'
              : 'border-accent bg-light-500/30 dark:bg-dark-600/30'
          } ${isFocused ? 'border-accent4' : 'border-accent'}`}
          aria-label='Drop zone for document upload'
        >
          <input {...getInputProps()} aria-label='File input' />
          <div className='flex flex-col items-center justify-center space-y-6'>
            <Image src='/logo.png' alt='DocuBot logo' width={75} height={75} />
            {isDragActive ? (
              <>
                <Rocket className='h-14 w-14 animate-ping text-accent2' />
                <p>Drop Documents for DocuBot here...</p>
              </>
            ) : (
              <>
                <CircleArrowDown className='h-14 w-14 animate-caret-blink text-accent2 dark:text-accent' />
                <p>Feed me some Documents by dropping them in front of me or clicking here.</p>
                <div className='flex max-w-md flex-wrap items-center justify-center gap-3'>
                  <div className='flex items-center gap-1 rounded-md bg-light-600/50 p-1 text-sm dark:bg-dark-700/50'>
                    <FileText className='h-4 w-4' /> PDF
                  </div>
                  {/* <div className='flex items-center gap-1 rounded-md bg-light-600/50 p-1 text-sm dark:bg-dark-700/50'>
                    <FileDigit className='h-4 w-4' /> DOCX
                  </div> */}
                  <div className='flex items-center gap-1 rounded-md bg-light-600/50 p-1 text-sm dark:bg-dark-700/50'>
                    <FileText className='h-4 w-4' /> TXT
                  </div>
                  <div className='flex items-center gap-1 rounded-md bg-light-600/50 p-1 text-sm dark:bg-dark-700/50'>
                    <FileType className='h-4 w-4' /> MD
                  </div>
                  <div className='flex items-center gap-1 rounded-md bg-light-600/50 p-1 text-sm dark:bg-dark-700/50'>
                    <FileArchive className='h-4 w-4' /> RTF
                  </div>
                </div>
                <p className='text-xs text-muted-foreground'>Maximum file size: 15MB</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default FileUploader;