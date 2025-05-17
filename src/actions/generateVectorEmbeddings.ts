/* eslint-disable import/prefer-default-export */
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { generateEmbeddingsWithPineconeVectorStore } from './langchain/langchain';

export async function generateVectorEmbeddings(docId: string) {
  auth().protect(); //Protect this route with Clerk's authentication

  //Convert document file to Vector Embeddings
  await generateEmbeddingsWithPineconeVectorStore(docId);

  revalidatePath('/dashboard');
}
