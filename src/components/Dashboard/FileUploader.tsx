/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import React, { useCallback, useEffect } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { CheckCircle, CircleArrowDown, Hammer, Lock, Rocket, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useUpload, { UploadStatusText } from '@/hooks/useUpload';
import useSubscription from '@/hooks/useSubscription';
import { MdError } from 'react-icons/md';

const FileUploader = () => {
  const { progress, status, docId, handleUploadDocument } = useUpload();
  const { isOverFileLimit, docsLoading } = useSubscription();
  const router = useRouter();

  useEffect(() => {
    if (docId) {
      router.push(`/dashboard/documents/${docId}`);
    }
  }, [docId, router, status]);

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
            toast.success(`DocuBot has consumed the Document: ${file.name}`);
          } catch (error) {
            if (error instanceof Error) {
              toast.error(`Upload failed: ${error.message}`);
            } else {
              toast.error('An unknown error occurred during upload');
            }
          }
        } else {
          toast.error(
            'You have reached the maximum number of documents. Upgrade to Pro to add more documents.'
          );
        }
      }
    },
    [handleUploadDocument, isOverFileLimit, docsLoading]
  );

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const rejection = fileRejections[0];
    if (rejection) {
      const { errors } = rejection;
      if (errors.length > 0) {
        const error = errors[0];
        switch (error.code) {
          case 'file-too-large':
            toast.error('File is too large. Maximum size is 17.5MB.');
            break;
          case 'file-invalid-type':
            toast.error('Invalid file type. Please upload a PDF.');
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

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } = useDropzone({
    onDrop,
    onDropRejected,
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024,
    accept: { 'application/pdf': ['.pdf'] },
  });

  const uploadInProgress = progress !== null && progress >= 0 && progress <= 100;

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
          >
            {progress}%
          </div>
          {statusIcons[status! as keyof typeof statusIcons]}
          <p className='animate-pulse text-accent2'>{status}</p>
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
        >
          <input {...getInputProps()} />
          <div className='flex flex-col items-center justify-center space-y-6'>
            <Image src='/logo.png' alt='' width={75} height={75} />
            {isDragActive ? (
              <>
                <Rocket className='h-14 w-14 animate-ping text-accent2' />
                <p>Drop Documents for DocuBot here...</p>
              </>
            ) : (
              <>
                <CircleArrowDown className='h-14 w-14 animate-caret-blink text-accent2 dark:text-accent' />
                <p>Feed me some Documents by dropping them in front of me or clicking here.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
