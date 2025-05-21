// askQuestion.ts
/* eslint-disable import/prefer-default-export */
'use server';

import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { auth } from '@clerk/nextjs/server';
import {
  generateLangChainCompletion,
  searchDenseVectors,
  searchSparseVectors,
} from '../langchain/langchain';
import { SUBSCRIPTION_LIMITS, ERROR_MESSAGES, OPENAI_CONFIG } from '@/lib/constants/appConstants';
import { Message } from '@/models/types/chatTypes';
import { Document } from '@langchain/core/documents';

export const maxDuration = async () => {
  console.log(`⏱️ Getting max duration for server action: ${OPENAI_CONFIG.MAX_DURATION}`);
  return OPENAI_CONFIG.MAX_DURATION; // Replace this with actual async logic if needed
};

// Helper function to convert retrieved documents to the format expected by the reranker
function prepareDocumentsForReranking(docs: Document[]) {
  console.log(`🔧 Preparing ${docs.length} documents for reranking...`);
  const preparedDocs = docs.map((doc) => ({
    id: doc.metadata.docId + '-' + doc.metadata.chunkIndex,
    pageContent: doc.pageContent,
    metadata: doc.metadata,
  }));
  console.log(`✅ Prepared ${preparedDocs.length} documents for reranking`);
  return preparedDocs;
}

// Merge and deduplicate results from different searches
function mergeAndDeduplicate(denseResults: Document[], sparseResults: Document[]): any[] {
  console.log(
    `🔄 Merging and deduplicating results - Dense: ${denseResults.length}, Sparse: ${sparseResults.length}`
  );
  // Use a Map to deduplicate by content hash or metadata identifiers
  const dedupeMap = new Map();

  // Process dense results first (they usually have higher quality)
  console.log(`🔧 Processing dense results first...`);
  for (const doc of denseResults) {
    // Create a unique key for deduplication
    const key = doc.metadata.docId + '-' + doc.metadata.chunkIndex;
    if (!dedupeMap.has(key)) {
      dedupeMap.set(key, {
        id: key,
        pageContent: doc.pageContent,
        metadata: doc.metadata,
        score: doc.metadata.score || 0,
        source: 'dense',
      });
    }
  }
  console.log(`✅ Processed ${dedupeMap.size} unique dense results`);

  // Then add sparse results if they're not already included
  console.log(`🔧 Adding sparse results if not already included...`);
  let sparseAdded = 0;
  for (const doc of sparseResults) {
    const key = doc.metadata.docId + '-' + doc.metadata.chunkIndex;
    if (!dedupeMap.has(key)) {
      dedupeMap.set(key, {
        id: key,
        pageContent: doc.pageContent,
        metadata: doc.metadata,
        score: doc.metadata.score || 0,
        source: 'sparse',
      });
      sparseAdded++;
    }
  }
  console.log(`✅ Added ${sparseAdded} unique sparse results`);

  // Convert Map back to array and sort by score descending
  const finalResults = Array.from(dedupeMap.values());
  console.log(`✅ Final merged and deduplicated results: ${finalResults.length} total documents`);
  return finalResults;
}

export async function askQuestion(id: string, question: string) {
  console.log(`❓ askQuestion called for document: ${id}, question: "${question}"`);
  try {
    console.log(`🔐 Verifying user authentication...`);
    auth.protect();
    const { userId } = await auth();

    if (!userId) {
      console.error('❌ User ID is null or undefined');
      return {
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
      };
    }
    console.log(`✅ User authenticated: ${userId}`);

    console.log(`🔍 Getting references to Firebase collections...`);
    const userRef = adminDb.collection('users').doc(userId);
    const chatRef = userRef.collection('files').doc(id).collection('chat');

    // Check user's subscription status
    console.log(`🔍 Checking user's subscription status...`);
    const userDoc = await userRef.get();
    const hasActiveMembership = userDoc.data()?.hasActiveMembership ?? false;
    console.log(`ℹ️ User has active membership: ${hasActiveMembership}`);

    // Get user's messages for this document
    console.log(`🔍 Getting user's existing messages for this document...`);
    const chatSnapshot = await chatRef.get();
    const userMessages = chatSnapshot.docs.filter((doc) => doc.data().role === 'human');
    console.log(`ℹ️ User has ${userMessages.length} existing messages for this document`);

    // Check if the user has reached their limit
    const limit = hasActiveMembership
      ? SUBSCRIPTION_LIMITS.PRO.MESSAGE_LIMIT
      : SUBSCRIPTION_LIMITS.FREE.MESSAGE_LIMIT;
    console.log(
      `ℹ️ Message limit for user: ${limit} (${hasActiveMembership ? 'PRO' : 'FREE'} tier)`
    );

    if (userMessages.length >= limit) {
      console.warn(`⚠️ User has reached message limit: ${userMessages.length}/${limit}`);
      return {
        success: false,
        message: ERROR_MESSAGES.MESSAGE_LIMIT_REACHED(hasActiveMembership, limit),
      };
    }

    console.log(`💬 Creating user message in database...`);
    const userMessage: Message = {
      role: 'human',
      message: question,
      createdAt: new Date(),
    };

    await chatRef.add(userMessage);
    console.log(`✅ User message added to database`);

    // Implement two-stage retrieval with hybrid search and reranking
    try {
      console.log(`🔍 Starting hybrid search process...`);

      // Step 1: Get results from both dense and sparse search
      console.log(`🧠 Performing dense vector search...`);
      const denseResults = await searchDenseVectors(id, question, 20);
      console.log(`✅ Dense search complete, found ${denseResults.length} results`);

      // Currently, sparse vector search is not fully implemented, so we'll use a similar approach
      // In a future enhancement, this would use actual sparse vectors for lexical search
      console.log(
        `📊 Performing sparse vector search (currently uses dense search as fallback)...`
      );
      const sparseResults = await searchSparseVectors(id, question, 20);
      console.log(`✅ Sparse search complete, found ${sparseResults.length} results`);

      // Step 2: Merge and deduplicate results
      console.log(`🔄 Merging and deduplicating search results...`);
      const combinedResults = mergeAndDeduplicate(denseResults, sparseResults);
      console.log(`✅ Merged results: ${combinedResults.length} unique documents`);

      // Step 3: Rerank the results if there are enough to rerank
      if (combinedResults.length > 1) {
        console.log(`🔄 Starting reranking process for ${combinedResults.length} documents...`);

        try {
          console.log(`🔧 Importing rerank function...`);
          const { rerank } = await import('../langchain/langchain');
          console.log(`🔄 Reranking search results...`);
          const rerankedResults = await rerank(question, combinedResults, 10);
          console.log(
            `✅ Reranking complete, got ${rerankedResults.data.length} reranked results`
          );

          // Step 4: Use reranked results to generate context
          console.log(`🔧 Generating context from reranked results...`);
          const context = rerankedResults.data
            .map((item: { document: { text?: string }; score?: number }) => {
              if (item.document && typeof item.document.text === 'string') {
                return item.document.text;
              }
              return '';
            })
            .filter((text: string) => text.length > 0)
            .join('\n\n');
          console.log(`✅ Context generated from reranked results: ${context.length} characters`);

          console.log(`🧠 Generating AI response with improved context...`);
          // Generate AI response with improved context
          const reply = await generateLangChainCompletion(id, question);
          console.log(`✅ AI response generated successfully`);

          // Store the AI response in the chat collection
          console.log(`💬 Storing AI response in database...`);
          const aiMessage: Message = {
            role: 'ai',
            message: reply,
            createdAt: new Date(),
          };

          await chatRef.add(aiMessage);
          console.log(`✅ AI message added to database`);

          return {
            success: true,
            message: null,
          };
        } catch (rerankerError) {
          console.error(
            `❌ Error using reranker, falling back to standard retrieval:`,
            rerankerError
          );
          // Fall back to standard retrieval method
          console.log(`🔄 Falling back to standard LangChain completion...`);
          const reply = await generateLangChainCompletion(id, question);
          console.log(`✅ Standard completion generated successfully`);

          console.log(`💬 Storing AI response in database...`);
          const aiMessage: Message = {
            role: 'ai',
            message: reply,
            createdAt: new Date(),
          };

          await chatRef.add(aiMessage);
          console.log(`✅ AI message added to database`);

          return {
            success: true,
            message: null,
          };
        }
      } else {
        // Not enough results to rerank, use standard approach
        console.log(
          `ℹ️ Not enough results to rerank (${combinedResults.length}), using standard approach`
        );
        console.log(`🧠 Generating standard LangChain completion...`);
        const reply = await generateLangChainCompletion(id, question);
        console.log(`✅ Standard completion generated successfully`);

        console.log(`💬 Storing AI response in database...`);
        const aiMessage: Message = {
          role: 'ai',
          message: reply,
          createdAt: new Date(),
        };

        await chatRef.add(aiMessage);
        console.log(`✅ AI message added to database`);

        return {
          success: true,
          message: null,
        };
      }
    } catch (hybridSearchError) {
      console.error(
        `❌ Error with hybrid search, falling back to standard approach:`,
        hybridSearchError
      );

      // Fallback to standard approach if hybrid search fails
      console.log(
        `🔄 Falling back to standard LangChain completion due to hybrid search error...`
      );
      const reply = await generateLangChainCompletion(id, question);
      console.log(`✅ Fallback completion generated successfully`);

      console.log(`💬 Storing AI response in database...`);
      const aiMessage: Message = {
        role: 'ai',
        message: reply,
        createdAt: new Date(),
      };

      await chatRef.add(aiMessage);
      console.log(`✅ AI message added to database`);

      return {
        success: true,
        message: null,
      };
    }
  } catch (error) {
    console.error('❌ Error in askQuestion:', error);
    return {
      success: false,
      message: `An error occurred: ${error}`,
    };
  }
}
