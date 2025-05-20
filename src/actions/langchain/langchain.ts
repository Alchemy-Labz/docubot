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

//Initialize the OpenAI model with LangChain using your API key
const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: OPENAI_CONFIG.MODEL_NAME,
});

export const indexName = PINECONE_CONFIG.INDEX_NAME;

async function fetchMessagesFromDB(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error(ERROR_MESSAGES.NO_USER_LOGGED_IN);
  }

  // Get the last 6 messages from the chat history
  const chats = await adminDb
    .collection('users')
    .doc(userId)
    .collection('files')
    .doc(docId)
    .collection('chat')
    .orderBy('createdAt', 'desc')
    .get();

  const chatHistory = chats.docs.map((doc) =>
    doc.data().role === 'human'
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message)
  );

  return chatHistory;
}

// Simplified document processing with fallback to PDF-only
async function processDocxFile(data: Blob): Promise<Document[]> {
  try {
    // Convert the blob to text (this won't be perfect but will extract raw text)
    const text = await data.text();
    // Remove XML/formatting and keep just the text content
    const cleanedText = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Create a Document with the extracted text
    return [
      new Document({
        pageContent: cleanedText,
        metadata: { source: 'docx' },
      }),
    ];
  } catch (error) {
    console.error('Error processing DOCX file:', error);
    throw new Error(
      'Failed to process DOCX file: ' + (error instanceof Error ? error.message : String(error))
    );
  }
}

export async function generateDocs(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error(ERROR_MESSAGES.NO_USER_LOGGED_IN);
  }

  console.log('--- Fetching document info from Firebase... ---');
  const fileRef = await adminDb
    .collection('users')
    .doc(userId)
    .collection('files')
    .doc(docId)
    .get();

  const fileData = fileRef.data();
  if (!fileData) {
    throw new Error(ERROR_MESSAGES.DOCUMENT_NOT_FOUND);
  }

  const downloadURL = fileData.downloadURL;
  // Use fileType if available, otherwise default to PDF for backward compatibility
  const fileType = fileData.type || 'application/pdf';

  if (!downloadURL) {
    throw new Error(ERROR_MESSAGES.DOWNLOAD_URL_NOT_FOUND);
  }

  console.log(`--- Download URL fetched successfully. ${downloadURL} ---`);
  console.log(`--- File type detected: ${fileType} ---`);

  // Fetch the document from the specified URL
  const response = await fetch(downloadURL);

  if (!response.ok) {
    throw new Error(`${ERROR_MESSAGES.FAILED_TO_FETCH_DOCUMENT}: ${response.status}`);
  }

  // Load the document into a blob
  const data = await response.blob();
  let docs: Document[] = [];

  try {
    // Process based on file type with fallback to PDF
    console.log(`--- Processing document of type ${fileType}... ---`);

    if (fileType === 'application/pdf') {
      // PDF files
      const loader = new PDFLoader(data);
      docs = await loader.load();
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // DOCX files - custom handling since the loader has issues
      docs = await processDocxFile(data);
    } else if (
      fileType === 'text/plain' ||
      fileType === 'text/markdown' ||
      fileType === 'text/rtf' ||
      fileType === 'application/rtf'
    ) {
      // Text-based files
      const textContent = await data.text();

      // Create a Document directly without using TextLoader
      docs = [
        new Document({
          pageContent: textContent,
          metadata: { source: fileType },
        }),
      ];
    } else {
      // Fallback: treat as PDF if type is unknown or unsupported
      console.warn(`Unknown file type ${fileType}, attempting to process as PDF...`);
      try {
        const loader = new PDFLoader(data);
        docs = await loader.load();
      } catch (pdfError) {
        console.error('Failed to process as PDF:', pdfError);
        throw new Error(ERROR_MESSAGES.UNSUPPORTED_FILE_TYPE(fileType));
      }
    }

    console.log('--- Document loaded successfully. ---');

    // Split the document into smaller chunks for smoother processing
    console.log('--- Splitting document into smaller chunks... ---');
    const splitter = new RecursiveCharacterTextSplitter();
    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`--- Document split into ${splitDocs.length} chunks successfully. ---`);

    return splitDocs;
  } catch (error) {
    console.error('Error processing document:', error);
    // If specific file type processing fails, try fallback to PDF processing
    if (fileType !== 'application/pdf') {
      console.log('--- Attempting fallback to PDF processing... ---');
      try {
        const loader = new PDFLoader(data);
        const fallbackDocs = await loader.load();
        const splitter = new RecursiveCharacterTextSplitter();
        const splitDocs = await splitter.splitDocuments(fallbackDocs);
        console.log(
          `--- Fallback PDF processing successful. Split into ${splitDocs.length} chunks. ---`
        );
        return splitDocs;
      } catch (fallbackError) {
        console.error('Fallback PDF processing also failed:', fallbackError);
      }
    }
    throw error;
  }
}

async function namespaceExists(index: Index<RecordMetadata>, namespace: string) {
  if (namespace === null) throw new Error('Namespace value is not provided');
  try {
    const { namespaces } = await index.describeIndexStats();
    return namespaces?.[namespace] !== undefined;
  } catch (error) {
    console.error('Error checking namespace existence:', error);
    // If we can't check, assume it doesn't exist to force recreation
    return false;
  }
}

export async function generateEmbeddingsWithPineconeVectorStore(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error(ERROR_MESSAGES.NO_USER_LOGGED_IN);
  }

  let pineconeVectorStore;

  try {
    // Generate Vector Embeddings for the split documents with Pinecone
    console.log('--- Generating Vector Embeddings with Pinecone. Begin... ---');
    const embeddings = new OpenAIEmbeddings();
    const index = pineconeClient.index(indexName);

    const namespaceAlreadyExists = await namespaceExists(index, docId);
    if (namespaceAlreadyExists) {
      console.log(
        `--- ${docId} namespace already exists in Pinecone. Reusing existing embeddings... ---`
      );

      pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex: index,
        namespace: docId,
      });

      return pineconeVectorStore;
    } else {
      // If the namespace does not exist, download the document file from Firebase Storage then generate the Vector Embeddings, and store them in Pinecone vector store.
      console.log(`--- Namespace ${docId} does not exist. Creating new embeddings... ---`);
      const splitDocs = await generateDocs(docId);

      console.log(
        `--- Storing Vector Embeddings in namespace ${docId} in the ${indexName} Pinecone Vector Store. Begin... ---`
      );

      pineconeVectorStore = await PineconeStore.fromDocuments(splitDocs, embeddings, {
        pineconeIndex: index,
        namespace: docId,
      });

      console.log(`--- Successfully stored ${splitDocs.length} document chunks in Pinecone. ---`);

      return pineconeVectorStore;
    }
  } catch (error) {
    console.error('Error in generateEmbeddingsWithPineconeVectorStore:', error);
    throw error;
  }
}

const generateLangChainCompletion = async (docId: string, question: string) => {
  let pineconeVectorStore;

  // eslint-disable-next-line prefer-const
  pineconeVectorStore = await generateEmbeddingsWithPineconeVectorStore(docId);
  if (!pineconeVectorStore) {
    throw new Error(ERROR_MESSAGES.NO_PINECONE_VECTOR_STORE);
  }

  // Create the Retriever Chain
  console.log('--- Creating the Retriever Chain... ---');
  const retriever = pineconeVectorStore.asRetriever();

  // Fetch the chat history from the database
  const chatHistory = await fetchMessagesFromDB(docId);

  // Define a prompt template for generating search queries based on conversation history
  console.log(
    '--- Defining a prompt template for generating search queries based on conversation history... ---'
  );
  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory, // Insert the actual chat History here

    ['user', '{input}'],
    [
      'user',
      'Based on the conversation history and the current question, generate a focused search query that will retrieve the most relevant information. Consider key terms, technical details, and specific context mentioned. The query should be specific enough to find precise information but broad enough to capture relevant context. If the current question references previous topics, include those key elements in the query.',
    ],
  ]);

  //Create a history aware retriever
  console.log('--- Creating a history aware retriever chain... ---');
  const historyAwareRetrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });

  //Define a prompt template for answering questions based on retrieved context
  console.log(
    '--- Defining a prompt template for answering questions based on retrieved context... ---'
  );
  const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      "You are a precise document analysis assistant. Using only the provided context below, answer the user's question thoroughly and accurately. If the information in the context is insufficient or ambiguous, acknowledge this explicitly. Focus on facts directly stated in the context rather than making assumptions. Connect information across different parts of the context when relevant. If the question asks about numerical data, double-check calculations and cite specific figures from the context. If the answer requires referring to previous conversation points, explicitly connect them to the current context.\n\nContext:\n{context}",
    ],

    ...chatHistory, // Insert the actual chat History here

    ['user', '{input}'],
  ]);

  //Create a document combining chain to create coherent responses
  console.log('--- Creating a document combining chain to create coherent responses... ---');
  const historyAwareCombineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt: historyAwareRetrievalPrompt,
  });

  //Create the main history aware retriever chain
  console.log('--- Creating the main history aware retriever chain... ---');
  const conversationalRetrievalChain = await createRetrievalChain({
    retriever: historyAwareRetrieverChain,
    combineDocsChain: historyAwareCombineDocsChain,
  });

  //Create the AI Reply
  console.log('--- Creating the AI Reply... ---');
  const reply = await conversationalRetrievalChain.invoke({
    chat_history: chatHistory,
    input: question,
  });

  //Print the result to the console
  console.log(reply.answer);
  return reply.answer;
};

//export the model and run the function

export { model, generateLangChainCompletion };
