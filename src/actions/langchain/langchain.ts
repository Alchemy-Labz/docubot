/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import pineconeClient from '@/lib/pinecone/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { PineconeConflictError } from '@pinecone-database/pinecone/dist/errors';
import { Index, RecordMetadata } from '@pinecone-database/pinecone';
import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { auth } from '@clerk/nextjs/server';
import { Document } from '@langchain/core/documents';
import {
  OPENAI_CONFIG,
  PINECONE_CONFIG,
  CHAT_CONFIG,
  ERROR_MESSAGES,
} from '@/lib/constants/appConstants';

// Initialize the OpenAI model with LangChain using your API key
console.log('🔧 Initializing OpenAI model with LangChain...');
const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: OPENAI_CONFIG.MODEL_NAME,
});
console.log(`✅ OpenAI model initialized with model: ${OPENAI_CONFIG.MODEL_NAME}`);

export const indexName = PINECONE_CONFIG.INDEX_NAME;

// Global connection cache for reusing Pinecone connections
const connectionCache: Record<string, any> = {};

export const getIndexConnection = (host: string, namespace: string): any => {
  console.log(`🔍 Getting Pinecone index connection for host: ${host}, namespace: ${namespace}`);
  const cacheKey = `${host}-${namespace}`;

  if (connectionCache[cacheKey]) {
    console.log(`✅ Reusing cached Pinecone connection for ${cacheKey}`);
    return connectionCache[cacheKey];
  }

  // Create a new connection
  console.log(`🔧 Creating new Pinecone connection for ${cacheKey}`);
  const connection = pineconeClient.Index(host);
  connectionCache[cacheKey] = connection;
  console.log(`✅ New Pinecone connection created and cached for ${cacheKey}`);

  return connection;
};

// Implement adaptive chunking based on file type and size
export function getOptimalChunkSettings(fileType: string, fileSize: number) {
  console.log(
    `🔧 Determining optimal chunk settings for file type: ${fileType}, size: ${fileSize} bytes`
  );
  // Adjust chunking strategy based on file type and size
  let settings;

  if (fileType === 'application/pdf') {
    // PDFs often have structure we want to preserve
    settings = {
      chunkSize: 1000,
      chunkOverlap: 200,
    };
    console.log('📄 PDF detected, using PDF-optimized chunking settings');
  } else if (fileType === 'text/plain') {
    // Plain text can use larger chunks
    settings = {
      chunkSize: 1500,
      chunkOverlap: 150,
    };
    console.log('📝 Plain text detected, using text-optimized chunking settings');
  } else if (fileType.includes('markdown')) {
    // Preserve markdown structure
    settings = {
      chunkSize: 1200,
      chunkOverlap: 150,
    };
    console.log('📝 Markdown detected, using markdown-optimized chunking settings');
  } else if (fileType === 'text/rtf' || fileType === 'application/rtf') {
    // RTF files
    settings = {
      chunkSize: 1200,
      chunkOverlap: 200,
    };
    console.log('📄 RTF detected, using RTF-optimized chunking settings');
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    // DOCX files
    settings = {
      chunkSize: 1100,
      chunkOverlap: 200,
    };
    console.log('📄 DOCX detected, using DOCX-optimized chunking settings');
  } else {
    // Default settings
    settings = {
      chunkSize: 1000,
      chunkOverlap: 200,
    };
    console.log(`⚠️ Unknown file type: ${fileType}, using default chunking settings`);
  }

  console.log(`✅ Selected chunk settings: ${JSON.stringify(settings)}`);
  return settings;
}

async function fetchMessagesFromDB(docId: string) {
  console.log(`🔍 Fetching chat history for document: ${docId}`);
  const { userId } = await auth();
  if (!userId) {
    console.error('❌ No user logged in when attempting to fetch messages');
    throw new Error(ERROR_MESSAGES.NO_USER_LOGGED_IN);
  }

  // Get the last 6 messages from the chat history
  console.log(`🔍 Querying Firebase for chat history of document ${docId} for user ${userId}`);
  const chats = await adminDb
    .collection('users')
    .doc(userId)
    .collection('files')
    .doc(docId)
    .collection('chat')
    .orderBy('createdAt', 'desc')
    .get();

  console.log(`✅ Retrieved ${chats.docs.length} messages from chat history`);

  const chatHistory = chats.docs.map((doc) =>
    doc.data().role === 'human'
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message)
  );

  console.log(`✅ Converted ${chatHistory.length} messages to LangChain format`);
  return chatHistory;
}

// Simplified document processing with fallback to PDF-only
async function processDocxFile(data: Blob): Promise<Document[]> {
  console.log('🔧 Processing DOCX file...');
  try {
    // Convert the blob to text (this won't be perfect but will extract raw text)
    console.log('📄 Converting DOCX blob to text...');
    const text = await data.text();

    // Remove XML/formatting and keep just the text content
    console.log('🧹 Cleaning DOCX text content by removing XML/formatting...');
    const cleanedText = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    console.log(`✅ DOCX processing complete. Extracted ${cleanedText.length} characters`);

    // Create a Document with the extracted text
    return [
      new Document({
        pageContent: cleanedText,
        metadata: { source: 'docx' },
      }),
    ];
  } catch (error) {
    console.error('❌ Error processing DOCX file:', error);
    throw new Error(
      'Failed to process DOCX file: ' + (error instanceof Error ? error.message : String(error))
    );
  }
}

export async function generateDocs(docId: string) {
  console.log(`🔧 Generating document chunks for docId: ${docId}`);
  const { userId } = await auth();

  if (!userId) {
    console.error('❌ No user logged in when attempting to generate docs');
    throw new Error(ERROR_MESSAGES.NO_USER_LOGGED_IN);
  }

  console.log(`🔍 Fetching document info from Firebase for user ${userId}, document ${docId}...`);
  const fileRef = await adminDb
    .collection('users')
    .doc(userId)
    .collection('files')
    .doc(docId)
    .get();

  const fileData = fileRef.data();
  if (!fileData) {
    console.error(`❌ Document not found: ${docId}`);
    throw new Error(ERROR_MESSAGES.DOCUMENT_NOT_FOUND);
  }

  const downloadURL = fileData.downloadURL;
  // Use fileType if available, otherwise default to PDF for backward compatibility
  const fileType = fileData.type || 'application/pdf';
  const fileSize = fileData.size || 0;

  console.log(`📄 File info retrieved - Type: ${fileType}, Size: ${fileSize} bytes`);

  if (!downloadURL) {
    console.error(`❌ Download URL not found for document: ${docId}`);
    throw new Error(ERROR_MESSAGES.DOWNLOAD_URL_NOT_FOUND);
  }

  console.log(`🔗 Download URL found: ${downloadURL}`);

  // Fetch the document from the specified URL
  console.log(`🔽 Downloading document from URL...`);
  const response = await fetch(downloadURL);

  if (!response.ok) {
    console.error(`❌ Failed to fetch document: HTTP ${response.status}`);
    throw new Error(`${ERROR_MESSAGES.FAILED_TO_FETCH_DOCUMENT}: ${response.status}`);
  }

  console.log(`✅ Document download successful`);

  // Load the document into a blob
  console.log(`🔧 Loading document data into blob...`);
  const data = await response.blob();
  console.log(`✅ Document loaded into blob: ${data.size} bytes`);

  let docs: Document[] = [];

  try {
    // Process based on file type with fallback to PDF
    console.log(`🔧 Processing document based on file type: ${fileType}...`);

    if (fileType === 'application/pdf') {
      // PDF files
      console.log(`📄 Processing as PDF...`);
      const loader = new PDFLoader(data);
      docs = await loader.load();
      console.log(`✅ PDF processing complete. Extracted ${docs.length} pages.`);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // DOCX files - custom handling since the loader has issues
      console.log(`📄 Processing as DOCX...`);
      docs = await processDocxFile(data);
      console.log(`✅ DOCX processing complete.`);
    } else if (
      fileType === 'text/plain' ||
      fileType === 'text/markdown' ||
      fileType === 'text/rtf' ||
      fileType === 'application/rtf'
    ) {
      // Text-based files
      console.log(`📄 Processing as text-based file...`);
      const textContent = await data.text();
      console.log(`✅ Text extraction complete. Extracted ${textContent.length} characters.`);

      // Create a Document directly without using TextLoader
      docs = [
        new Document({
          pageContent: textContent,
          metadata: { source: fileType },
        }),
      ];
    } else {
      // Fallback: treat as PDF if type is unknown or unsupported
      console.warn(`⚠️ Unknown file type ${fileType}, attempting to process as PDF...`);
      try {
        const loader = new PDFLoader(data);
        docs = await loader.load();
        console.log(`✅ Fallback PDF processing complete. Extracted ${docs.length} pages.`);
      } catch (pdfError) {
        console.error('❌ Failed to process as PDF:', pdfError);
        throw new Error(ERROR_MESSAGES.UNSUPPORTED_FILE_TYPE(fileType));
      }
    }

    // Get optimal chunk settings based on file type and size
    console.log(`🔧 Getting optimal chunk settings for document...`);
    const chunkSettings = getOptimalChunkSettings(fileType, fileSize);

    // Split the document into smaller chunks for smoother processing
    console.log(
      `✂️ Splitting document into chunks with settings: chunkSize=${chunkSettings.chunkSize}, chunkOverlap=${chunkSettings.chunkOverlap}...`
    );
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunkSettings.chunkSize,
      chunkOverlap: chunkSettings.chunkOverlap,
    });

    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`✅ Document split into ${splitDocs.length} chunks successfully.`);

    // Add metadata to each document chunk
    console.log(`🔧 Adding metadata to document chunks...`);
    const enhancedDocs = splitDocs.map((doc, index) => {
      // Add useful metadata
      doc.metadata = {
        ...doc.metadata,
        docId: docId,
        chunkIndex: index,
        chunkSize: doc.pageContent.length,
        createdAt: new Date().toISOString(),
        fileType: fileType,
        userId: userId,
      };
      return doc;
    });
    console.log(`✅ Metadata added to ${enhancedDocs.length} document chunks.`);

    return enhancedDocs;
  } catch (error) {
    console.error('❌ Error processing document:', error);
    // If specific file type processing fails, try fallback to PDF processing
    if (fileType !== 'application/pdf') {
      console.log('⚠️ Attempting fallback to PDF processing...');
      try {
        const loader = new PDFLoader(data);
        const fallbackDocs = await loader.load();
        const splitter = new RecursiveCharacterTextSplitter();
        const splitDocs = await splitter.splitDocuments(fallbackDocs);
        console.log(
          `✅ Fallback PDF processing successful. Split into ${splitDocs.length} chunks.`
        );
        return splitDocs;
      } catch (fallbackError) {
        console.error('❌ Fallback PDF processing also failed:', fallbackError);
      }
    }
    throw error;
  }
}

async function namespaceExists(index: Index<RecordMetadata>, namespace: string) {
  console.log(`🔍 Checking if namespace "${namespace}" exists in Pinecone index...`);
  if (namespace === null) {
    console.error('❌ Namespace value is not provided');
    throw new Error('Namespace value is not provided');
  }
  try {
    const { namespaces } = await index.describeIndexStats();
    const exists = namespaces?.[namespace] !== undefined;
    console.log(`✅ Namespace check complete. Exists: ${exists ? 'Yes' : 'No'}`);
    return exists;
  } catch (error) {
    console.error('❌ Error checking namespace existence:', error);
    // If we can't check, assume it doesn't exist to force recreation
    console.log('⚠️ Assuming namespace does not exist due to error');
    return false;
  }
}

export async function generateEmbeddingsWithPineconeVectorStore(
  docId: string,
  chunks?: Document[]
) {
  console.log(`🔧 Generating embeddings for docId: ${docId}`);
  const { userId } = await auth();

  if (!userId) {
    console.error('❌ No user logged in when attempting to generate embeddings');
    throw new Error(ERROR_MESSAGES.NO_USER_LOGGED_IN);
  }

  let pineconeVectorStore;

  try {
    // Generate Vector Embeddings for the split documents with Pinecone
    console.log('🧠 Initializing OpenAI embeddings...');
    const embeddings = new OpenAIEmbeddings();
    console.log(`🔍 Getting Pinecone index: ${indexName}`);
    const index = pineconeClient.index(indexName);

    console.log(`🔍 Checking if namespace ${docId} already exists...`);
    const namespaceAlreadyExists = await namespaceExists(index, docId);
    if (namespaceAlreadyExists && !chunks) {
      console.log(
        `ℹ️ Namespace ${docId} already exists in Pinecone. Reusing existing embeddings...`
      );

      console.log('🔧 Creating vector store from existing index...');
      pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex: index,
        namespace: docId,
      });
      console.log('✅ Vector store created from existing index successfully');

      return pineconeVectorStore;
    } else {
      // If chunks are provided, use them, otherwise generate new ones
      console.log(
        chunks ? '🔧 Using provided document chunks' : '🔧 Generating new document chunks'
      );
      const splitDocs = chunks || (await generateDocs(docId));
      console.log(`📄 Working with ${splitDocs.length} document chunks`);

      console.log(
        `🔧 Storing vectors in namespace "${docId}" in Pinecone index "${indexName}"...`
      );

      console.log('🧠 Generating embeddings and storing in Pinecone...');
      pineconeVectorStore = await PineconeStore.fromDocuments(splitDocs, embeddings, {
        pineconeIndex: index,
        namespace: docId,
      });

      console.log(`✅ Successfully stored ${splitDocs.length} document chunks in Pinecone`);

      return pineconeVectorStore;
    }
  } catch (error) {
    console.error('❌ Error in generateEmbeddingsWithPineconeVectorStore:', error);
    throw error;
  }
}

// Search with metadata filtering for improved precision
export async function searchWithMetadata(docId: string, query: string, options: any = {}) {
  console.log(`🔍 Searching with metadata for docId: ${docId}, query: "${query}"`);
  const { userId } = await auth();

  if (!userId) {
    console.error('❌ No user logged in when attempting to search');
    throw new Error(ERROR_MESSAGES.NO_USER_LOGGED_IN);
  }

  try {
    console.log('🧠 Initializing OpenAI embeddings for search...');
    const embeddings = new OpenAIEmbeddings();
    console.log(`🔍 Getting Pinecone index: ${indexName}`);
    const index = pineconeClient.index(indexName);

    console.log(`🔧 Creating vector store from existing index for namespace: ${docId}`);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });

    // Basic search with metadata filtering
    const filter = {
      docId: docId,
      userId: userId,
      // Additional optional filters from options
      ...(options.filter || {}),
    };

    console.log(`🔍 Performing similarity search with filter: ${JSON.stringify(filter)}`);
    console.log(`🔍 Retrieving top ${options.k || 10} results`);

    const results = await vectorStore.similaritySearch(query, options.k || 10, filter);
    console.log(`✅ Search complete. Found ${results.length} results`);

    return results;
  } catch (error) {
    console.error('❌ Error in searchWithMetadata:', error);
    throw error;
  }
}

// Function to perform dense vector search (semantic search)
export async function searchDenseVectors(docId: string, query: string, topK: number = 10) {
  console.log(
    `🧠 Performing dense vector search for docId: ${docId}, query: "${query}", topK: ${topK}`
  );
  try {
    console.log('🔍 Delegating to searchWithMetadata for dense vector search...');
    const results = await searchWithMetadata(docId, query, { k: topK });
    console.log(`✅ Dense vector search complete. Found ${results.length} results`);
    return results;
  } catch (error) {
    console.error('❌ Error in searchDenseVectors:', error);
    throw error;
  }
}

// For sparse vector search implementation (future expansion)
export async function searchSparseVectors(docId: string, query: string, topK: number = 10) {
  console.log(
    `📊 Performing sparse vector search for docId: ${docId}, query: "${query}", topK: ${topK}`
  );
  // This is a placeholder for future implementation of sparse vector search
  // For now, it just returns the same results as dense search
  console.log('ℹ️ Note: Currently using dense vector search as fallback for sparse search');
  try {
    const results = await searchDenseVectors(docId, query, topK);
    console.log(
      `✅ Sparse vector search (via dense fallback) complete. Found ${results.length} results`
    );
    return results;
  } catch (error) {
    console.error('❌ Error in searchSparseVectors:', error);
    throw error;
  }
}

const generateLangChainCompletion = async (docId: string, question: string) => {
  console.log(`🧠 Generating LangChain completion for docId: ${docId}, question: "${question}"`);
  let pineconeVectorStore;

  // eslint-disable-next-line prefer-const
  console.log('🔧 Generating embeddings with Pinecone vector store...');
  pineconeVectorStore = await generateEmbeddingsWithPineconeVectorStore(docId);
  if (!pineconeVectorStore) {
    console.error('❌ No Pinecone vector store generated');
    throw new Error(ERROR_MESSAGES.NO_PINECONE_VECTOR_STORE);
  }

  // Create the Retriever Chain
  console.log('🔧 Creating retriever from vector store...');
  const retriever = pineconeVectorStore.asRetriever();
  console.log('✅ Retriever created successfully');

  // Fetch the chat history from the database
  console.log('🔍 Fetching chat history from database...');
  const chatHistory = await fetchMessagesFromDB(docId);
  console.log(`✅ Chat history fetched. ${chatHistory.length} messages found`);

  // Define a prompt template for generating search queries based on conversation history
  console.log('📝 Creating prompt template for history-aware search query generation...');
  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory, // Insert the actual chat History here

    ['user', '{input}'],
    [
      'user',
      'Based on the conversation history and the current question, generate a focused search query that will retrieve the most relevant information. Consider key terms, technical details, and specific context mentioned. The query should be specific enough to find precise information but broad enough to capture relevant context. If the current question references previous topics, include those key elements in the query.',
    ],
  ]);
  console.log('✅ History-aware prompt template created');

  //Create a history aware retriever
  console.log('🔧 Creating history-aware retriever chain...');
  const historyAwareRetrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });
  console.log('✅ History-aware retriever chain created');

  //Define a prompt template for answering questions based on retrieved context
  console.log('📝 Creating prompt template for answering questions with context...');
  const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      "You are a precise document analysis assistant. Using only the provided context below, answer the user's question thoroughly and accurately. If the information in the context is insufficient or ambiguous, acknowledge this explicitly. Focus on facts directly stated in the context rather than making assumptions. Connect information across different parts of the context when relevant. If the question asks about numerical data, double-check calculations and cite specific figures from the context. If the answer requires referring to previous conversation points, explicitly connect them to the current context.\n\nContext:\n{context}",
    ],

    ...chatHistory, // Insert the actual chat History here

    ['user', '{input}'],
  ]);
  console.log('✅ History-aware retrieval prompt template created');

  //Create a document combining chain to create coherent responses
  console.log('🔧 Creating document combining chain...');
  const historyAwareCombineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt: historyAwareRetrievalPrompt,
  });
  console.log('✅ Document combining chain created');

  //Create the main history aware retriever chain
  console.log('🔧 Creating final conversational retrieval chain...');
  const conversationalRetrievalChain = await createRetrievalChain({
    retriever: historyAwareRetrieverChain,
    combineDocsChain: historyAwareCombineDocsChain,
  });
  console.log('✅ Conversational retrieval chain created');

  //Create the AI Reply
  console.log('🧠 Generating AI response...');
  const reply = await conversationalRetrievalChain.invoke({
    chat_history: chatHistory,
    input: question,
  });

  //Print the result to the console
  console.log('✅ AI response generated successfully');
  return reply.answer;
};

//export the model and run the function

export { model, generateLangChainCompletion };

// For Pinecone reranking and inference operations
// Fallback to traditional retrieval if inference methods aren't available
export const rerank = async (query: string, documents: any[], topN: number = 10) => {
  console.log(
    `🔍 Reranking results for query: "${query}", documents: ${documents.length}, topN: ${topN}`
  );
  try {
    // Check if pineconeClient.inference is available
    if (pineconeClient.inference && typeof pineconeClient.inference.rerank === 'function') {
      console.log('🧠 Using Pinecone inference API for reranking...');
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

      console.log(
        `✅ Reranking complete. Received ${result?.data?.length || 0} reranked documents`
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
      // Fallback: manual sorting by score
      console.log('⚠️ Inference API not available, using fallback sorting by score');
      return {
        data: documents
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .slice(0, topN)
          .map((doc) => ({
            document: {
              id: doc.id || 'doc-' + Math.random().toString(36).substring(7),
              text: doc.pageContent || doc.text || doc.content,
            },
            score: doc.score || 0,
          })),
      };
    }
  } catch (error) {
    console.error('❌ Error in reranking:', error);
    // Return original documents in case of error
    console.log('⚠️ Returning original sorted documents due to reranking error');
    return {
      data: documents.slice(0, topN).map((doc) => ({
        document: {
          id: doc.id || 'doc-' + Math.random().toString(36).substring(7),
          text: doc.pageContent || doc.text || doc.content,
        },
        score: doc.score || 0,
      })),
    };
  }
};
