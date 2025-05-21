import { Pinecone, RecordMetadata } from '@pinecone-database/pinecone';
import { PINECONE_CONFIG } from '@/lib/constants/appConstants';

// Validate API key
if (!process.env.PINECONE_API_KEY) {
  throw new Error('PINECONE_API_KEY is not set');
}

// Initialize Pinecone client
const pineconeClient = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Create a cache for host information to avoid repeated describe_index calls
const hostCache: Record<string, string> = {};

// Cache for index connections to reuse TCP connections
const connectionCache: Record<string, any> = {};

/**
 * Get the host for a Pinecone index, using cache when available
 * This reduces latency by eliminating unnecessary describe_index calls
 */
export const getPineconeIndexHost = async (indexName: string): Promise<string> => {
  // Return cached host if available
  if (hostCache[indexName]) {
    return hostCache[indexName];
  }

  try {
    // Fetch host information if not cached
    const indexDetails = await pineconeClient.describeIndex(indexName);
    hostCache[indexName] = indexDetails.host;
    return indexDetails.host;
  } catch (error) {
    console.error(`Error getting host for index ${indexName}:`, error);
    throw error;
  }
};

/**
 * Get a cached index connection to avoid repeated TCP connection setups
 */
export const getIndexConnection = (host: string, namespace: string): any => {
  const cacheKey = `${host}-${namespace}`;

  if (connectionCache[cacheKey]) {
    return connectionCache[cacheKey];
  }

  // Create a new connection
  const connection = pineconeClient.Index(host);
  connectionCache[cacheKey] = connection;

  return connection;
};

/**
 * Create a hybrid search function that combines dense and sparse vectors
 * with explicit weighting factor to balance between semantic and lexical search
 */
export const hybridSearch = async <T extends RecordMetadata = RecordMetadata>(
  denseIndex: any,
  sparseIndex: any,
  namespace: string,
  query: any,
  denseVector: number[],
  sparseVector: { indices: number[]; values: number[] },
  topK: number = 10,
  alpha: number = 0.5 // Weight between dense (semantic) and sparse (lexical) search
): Promise<{ id: string; score: number; metadata: T }[]> => {
  if (alpha < 0 || alpha > 1) {
    throw new Error('Alpha must be between 0 and 1');
  }

  // Scale vectors according to alpha weight
  const scaledDenseVector = denseVector.map((v) => v * alpha);
  const scaledSparseVector = {
    indices: sparseVector.indices,
    values: sparseVector.values.map((v) => v * (1 - alpha)),
  };

  // Execute dense and sparse searches in parallel
  const [denseResults, sparseResults] = await Promise.all([
    denseIndex.query({
      namespace,
      vector: scaledDenseVector,
      topK,
      includeMetadata: true,
    }),
    sparseIndex.query({
      namespace,
      sparseVector: scaledSparseVector,
      topK,
      includeMetadata: true,
    }),
  ]);

  // Merge and deduplicate results
  const combinedResults = new Map<string, { id: string; score: number; metadata: T }>();

  // Add dense results
  denseResults.matches.forEach((match: any) => {
    combinedResults.set(match.id, {
      id: match.id,
      score: match.score,
      metadata: match.metadata,
    });
  });

  // Add or update with sparse results
  sparseResults.matches.forEach((match: any) => {
    if (combinedResults.has(match.id)) {
      // If we already have this result, take the higher score
      const existing = combinedResults.get(match.id)!;
      if (match.score > existing.score) {
        existing.score = match.score;
      }
    } else {
      combinedResults.set(match.id, {
        id: match.id,
        score: match.score,
        metadata: match.metadata,
      });
    }
  });

  // Sort by score and return
  return Array.from(combinedResults.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
};

/**
 * Rerank search results using Pinecone's reranking capabilities
 * Works with or without the inference API
 */
export const rerank = async (
  query: string,
  documents: Array<{
    id?: string;
    pageContent?: string;
    text?: string;
    content?: string;
    score?: number;
  }>,
  topN: number = 10
): Promise<{
  data: Array<{
    document: { id: string; text: string };
    score: number;
  }>;
}> => {
  try {
    // Check if pineconeClient.inference is available
    if (pineconeClient.inference && typeof pineconeClient.inference.rerank === 'function') {
      // Using the correct API signature with 3 arguments
      const result = await pineconeClient.inference.rerank(
        'bge-reranker-v2-m3', // First argument: model name
        query, // Second argument: query string
        documents.map((doc) => ({
          // Third argument: array of documents
          id: doc.id || 'doc-' + Math.random().toString(36).substring(7),
          text: doc.pageContent || doc.text || doc.content || '',
        }))
      );

      // Return results in our expected format
      return {
        data: (result?.data || []).map((item: any) => ({
          document: {
            id: item.id || '',
            text: item.text || '',
          },
          score: item.score || 0,
        })),
      };
    } else {
      // Fallback: manual sorting by score if inference API not available
      console.log('Inference API not available, using fallback sorting');
      return {
        data: documents
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .slice(0, topN)
          .map((doc) => ({
            document: {
              id: doc.id || 'doc-' + Math.random().toString(36).substring(7),
              text: doc.pageContent || doc.text || doc.content || '',
            },
            score: doc.score || 0,
          })),
      };
    }
  } catch (error) {
    console.error('Error in reranking:', error);
    // Return original documents in case of error
    return {
      data: documents.slice(0, topN).map((doc) => ({
        document: {
          id: doc.id || 'doc-' + Math.random().toString(36).substring(7),
          text: doc.pageContent || doc.text || doc.content || '',
        },
        score: doc.score || 0,
      })),
    };
  }
};

export default pineconeClient;
