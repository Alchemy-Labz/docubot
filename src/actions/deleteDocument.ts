'use server';
/* eslint-disable import/prefer-default-export */
import { adminDb, adminStorage } from '@/lib/firebase/firebaseAdmin';
import pineconeClient from '@/lib/pinecone/pinecone';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { PINECONE_CONFIG, ERROR_MESSAGES, PLAN_TYPES } from '@/lib/constants/appConstants';

export async function deleteDocument(docId: string) {
  auth.protect();
  const { userId } = await auth();
  if (!userId) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
  }

  // Get user's subscription status
  const userDoc = await adminDb.collection('users').doc(userId).get();
  const planType = userDoc.data()?.planType || PLAN_TYPES.STARTER;

  // Check if user has a paid subscription (Pro or Team)
  if (planType === PLAN_TYPES.STARTER) {
    throw new Error('Deleting documents requires a Pro or Team subscription');
  }

  await adminDb.collection('users').doc(userId!).collection('files').doc(docId).delete();

  await adminStorage
    .bucket(process.env.FIREBASE_STORAGE_BUCKET!)
    .file(`users/${userId}/files/${docId}`)
    .delete();

  const index = await pineconeClient.index(PINECONE_CONFIG.INDEX_NAME);
  await index.namespace(docId).deleteAll();

  revalidatePath('/dashboard');
}
