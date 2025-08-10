// src/hooks/useUpload.ts
'use client';

import { storage, db } from '@/lib/firebase/firebase';
import { useUser } from '@clerk/nextjs';
import { doc, setDoc } from '@firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage';
import { generateVectorEmbeddings } from '@/actions/generateVectorEmbeddings';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useFirebaseAuth } from '@/providers/FirebaseContext';
import { FILE_TYPE_ICONS, DEFAULT_FILE_ICON, FILE_UPLOAD } from '@/lib/constants/appConstants';
import useSubscription from '@/hooks/useSubscription';

export enum UploadStatusText {
  AUTHENTICATING = 'Authenticating...',
  UPLOADING = 'Uploading document.',
  UPLOADED = 'Document uploaded.',
  SAVING = 'Saving document to database.',
  GENERATING = 'Generating AI Embeddings, please wait...',
  ERROR = 'There has been an error uploading your document.',
}

export type Status = UploadStatusText[keyof UploadStatusText];

function useUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const { user, isLoaded } = useUser();
  const { isAuthenticated, authenticate } = useFirebaseAuth(); // Use context
  const { planType } = useSubscription();

  const getFileTypeIcon = (fileType: string): string => {
    return FILE_TYPE_ICONS[fileType as keyof typeof FILE_TYPE_ICONS] || DEFAULT_FILE_ICON;
  };

  const handleUploadDocument = async (file: File) => {
    console.log('handleUploadDocument called with file:', file);
    if (!file || !isLoaded || !user) {
      console.log('No file, user not loaded, or no user, returning early');
      return;
    }

    // Validate file size based on user's plan
    const maxFileSize = FILE_UPLOAD.getMaxFileSizeForPlan(planType);
    if (file.size > maxFileSize) {
      const maxSizeDisplay = FILE_UPLOAD.formatFileSize(maxFileSize);
      const fileSizeDisplay = FILE_UPLOAD.formatFileSize(file.size);
      throw new Error(
        `File size (${fileSizeDisplay}) exceeds the maximum allowed size (${maxSizeDisplay}) for your ${planType} plan.`
      );
    }

    try {
      // Ensure Firebase authentication
      setStatus(UploadStatusText.AUTHENTICATING);

      if (!isAuthenticated) {
        console.log('Not authenticated, authenticating...');
        await authenticate();
      }

      console.log('Firebase authenticated, proceeding with upload');

      const fileToUploadToDB = uuidv4();
      console.log('Generated file ID:', fileToUploadToDB);

      const storageRef = ref(storage, `users/${user.id}/files/${fileToUploadToDB}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      console.log('Starting file upload');
      uploadTask.on(
        'state_changed',
        (snapshot: { bytesTransferred: number; totalBytes: number }) => {
          const uploadProgress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log('Upload progress:', uploadProgress);
          setStatus(UploadStatusText.UPLOADING);
          setProgress(uploadProgress);
        },
        (error: Error) => {
          console.error('Error uploading the document:', error);
          setStatus(UploadStatusText.ERROR);
        },
        async () => {
          console.log('Upload completed');
          setStatus(UploadStatusText.UPLOADED);

          console.log('Getting download URL');
          const docDownloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          console.log('Saving to database');
          setStatus(UploadStatusText.SAVING);

          const fileIcon = getFileTypeIcon(file.type);

          await setDoc(doc(db, 'users', user.id, 'files', fileToUploadToDB), {
            name: file.name,
            size: file.size,
            type: file.type,
            fileIcon: fileIcon,
            downloadURL: docDownloadURL,
            ref: uploadTask.snapshot.ref.fullPath,
            createdAt: new Date(),
          });

          console.log('Generating AI embeddings');
          setStatus(UploadStatusText.GENERATING);

          try {
            await generateVectorEmbeddings(fileToUploadToDB);
            console.log('Process completed successfully');
            setDocId(fileToUploadToDB);
            setStatus(null);
          } catch (embeddingError) {
            console.error('Error generating embeddings:', embeddingError);
            setStatus(UploadStatusText.ERROR);

            // Provide user-friendly error message
            let errorMessage = 'Failed to process document';
            if (embeddingError instanceof Error) {
              if (embeddingError.message.includes('timeout')) {
                errorMessage =
                  'Document processing timed out. Please try again with a smaller file.';
              } else if (embeddingError.message.includes('network')) {
                errorMessage =
                  'Network error during processing. Please check your connection and try again.';
              } else if (embeddingError.message.includes('API')) {
                errorMessage = 'Service temporarily unavailable. Please try again later.';
              } else {
                errorMessage = embeddingError.message;
              }
            }

            throw new Error(errorMessage);
          }
        }
      );
    } catch (error) {
      console.error('Error during authentication or upload:', error);
      setStatus(UploadStatusText.ERROR);
    }
  };

  return { progress, status, docId, handleUploadDocument };
}

export default useUpload;
