'use server';
/* eslint-disable import/prefer-default-export */
import { adminDb, adminStorage } from '@/lib/firebase/firebaseAdmin';
import pineconeClient from '@/lib/pinecone';
import { auth } from '@clerk/nextjs/server';
import { indexName } from './langchain/langchain';
import { revalidatePath } from 'next/cache';

export async function deleteDocument(docId: string) {
  auth().protect();
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  await adminDb.collection('users').doc(userId!).collection('files').doc(docId).delete();

  await adminStorage
    .bucket(process.env.FIREBASE_STORAGE_BUCKET!)
    .file(`users/${userId}/files/${docId}`)
    .delete();

  const index = await pineconeClient.index(indexName);
  await index.namespace(docId).deleteAll();

  revalidatePath('/dashboard');
}
