/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { storage, db, auth } from '#/firebase';
import { useUser } from '@clerk/nextjs';
import { doc, setDoc } from '@firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage';
import { generateVectorEmbeddings } from '@/actions/generateVectorEmbeddings';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { signInWithCustomToken } from '@firebase/auth';

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
  const { user } = useUser();

  const getFileTypeIcon = (fileType: string): string => {
    switch (fileType) {
      case 'application/pdf':
        return 'pdf';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'docx';
      case 'text/plain':
        return 'txt';
      case 'text/markdown':
        return 'md';
      case 'text/rtf':
        return 'rtf';
      default:
        return 'document';
    }
  };

  const handleUploadDocument = async (file: File) => {
    console.log('handleUploadDocument called with file:', file);
    if (!file || !user) {
      console.log('No file or user, returning early');
      return;
    }

    // TODO: Free/Pro Limitations

    try {
      // Fetch the Firebase token from your backend
      console.log('Fetching Firebase token');
      setStatus(UploadStatusText.AUTHENTICATING);
      const response = await fetch('/api/firebase-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch Firebase token: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('Firebase token response:', data);
      if (!data.firebaseToken) {
        throw new Error('No Firebase token received from the server');
      }

      console.log('Signing in to Firebase');
      await signInWithCustomToken(auth, data.firebaseToken);
      console.log('Signed in to Firebase successfully');

      const { firebaseToken } = data;
      console.log('Firebase token received');

      // Sign in to Firebase with the custom token
      console.log('Signing in to Firebase');
      await signInWithCustomToken(auth, firebaseToken);
      console.log('Signed in to Firebase successfully');

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
          // TODO: Send Error to Sentry
        },
        async () => {
          console.log('Upload completed');
          setStatus(UploadStatusText.UPLOADED);

          console.log('Getting download URL');
          const docDownloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          console.log('Saving to database');
          setStatus(UploadStatusText.SAVING);

          // Get file icon type
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

          // Generate AI Vector Embeddings
          await generateVectorEmbeddings(fileToUploadToDB);

          console.log('Process completed');
          setDocId(fileToUploadToDB);
          setStatus(null); // Clear status when everything is done
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
