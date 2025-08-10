/* eslint-disable import/prefer-default-export */
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { generateEmbeddingsWithPineconeVectorStore } from './langchain/langchain';

export async function generateVectorEmbeddings(docId: string) {
  try {
    console.log(`🔧 Starting vector embeddings generation for docId: ${docId}`);

    auth.protect(); //Protect this route with Clerk's authentication
    const { userId } = await auth();

    if (!userId) {
      throw new Error('User authentication failed');
    }

    console.log(`✅ Authentication successful for user: ${userId}`);

    // Add timeout wrapper for the embedding generation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error('Embedding generation timed out after 5 minutes')),
        5 * 60 * 1000
      );
    });

    const embeddingPromise = generateEmbeddingsWithPineconeVectorStore(docId);

    console.log(`🧠 Starting embedding generation with timeout protection...`);

    // Race between the embedding generation and timeout
    await Promise.race([embeddingPromise, timeoutPromise]);

    console.log(`✅ Vector embeddings generated successfully for docId: ${docId}`);

    revalidatePath('/dashboard');

    return { success: true, docId };
  } catch (error) {
    console.error(`❌ Error generating vector embeddings for docId: ${docId}`, error);

    // Provide more specific error messages
    let errorMessage = 'Failed to generate embeddings';

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        errorMessage = 'Embedding generation timed out. Please try again with a smaller file.';
      } else if (error.message.includes('API key')) {
        errorMessage = 'API configuration error. Please contact support.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        errorMessage = error.message;
      }
    }

    throw new Error(errorMessage);
  }
}
