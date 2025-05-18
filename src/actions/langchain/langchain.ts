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
import pineconeClient from '@/lib/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { PineconeConflictError } from '@pinecone-database/pinecone/dist/errors';
import { Index, RecordMetadata } from '@pinecone-database/pinecone';
import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { auth } from '@clerk/nextjs/server';
import { Document } from '@langchain/core/documents';

//Initialize the OpenAI model with LangChain using your API key
const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4.1-mini',
});

export const indexName = 'docubot';

async function fetchMessagesFromDB(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('No user logged in');
    //TODO: Send Error to Sentry
  }

  // //console.log('--- Fetching messages from DB... ---');
  //get the last 6 messages from the chat history
  const chats = await adminDb
    .collection('users')
    .doc(userId)
    .collection('files')
    .doc(docId)
    .collection('chat')
    .orderBy('createdAt', 'desc')
    // .limit(6)
    .get();

  const chatHistory = chats.docs.map((doc) =>
    doc.data().role === 'human'
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message)
  );

  //console.log(`--- ${chatHistory.length} Messages fetched successfully. ---`);
  //console.log(chatHistory.map((msg) => msg.content.toString()));

  return chatHistory;
}

// Custom processing for DOCX files
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
    throw new Error('No user logged in');
    //TODO: Send Error to Sentry
  }

  //console.log('--- Fetching the document info from Firebase... ---');
  const fileRef = await adminDb
    .collection('users')
    .doc(userId)
    .collection('files')
    .doc(docId)
    .get();

  const fileData = fileRef.data();
  if (!fileData) {
    throw new Error('Document data not found');
    //TODO: Send Error to Sentry
  }

  const downloadURL = fileData.downloadURL;
  const fileType = fileData.type;

  if (!downloadURL) {
    throw new Error('Download URL not found');
    //TODO: Send Error to Sentry
  }

  //console.log(`--- Download URL fetched successfully. ${downloadURL} ---`);

  // Fetch the document from the specified URL
  const response = await fetch(downloadURL);

  if (!response.ok) {
    throw new Error(`Failed to fetch document: ${response.status}`);
  }

  // Load the document into a blob
  const data = await response.blob();
  let docs: Document[] = [];

  // Process based on file type
  //console.log(`--- Processing document of type ${fileType}... ---`);

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
    throw new Error(`Unsupported file type: ${fileType}`);
    //TODO: Send Error to Sentry
  }

  //console.log('--- Document loaded successfully. ---');

  //Split the document into smaller chunks for smoother processing
  //console.log('--- Splitting document into smaller chunks... ---');
  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);
  //console.log(`--- Document split into ${splitDocs.length} chunks successfully. ---`);

  return splitDocs;
}

async function namespaceExists(index: Index<RecordMetadata>, namespace: string) {
  if (namespace === null) throw new Error('Namespace value is not provided'); //TODO: Send Error to Sentry
  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsWithPineconeVectorStore(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('No user logged in');
    //TODO: Send Error to Sentry
  }

  let pineconeVectorStore;

  // Generate Vector Embeddings for the split documents with Pinecone
  //console.log('--- Generating Vector Embeddings with Pinecone. Begin... ---');
  const embeddings = new OpenAIEmbeddings();
  const index = pineconeClient.index(indexName);

  const namespaceAlreadyExists = await namespaceExists(index, docId);
  if (namespaceAlreadyExists) {
    //console.log(`--- ${docId} namespace already exists in Pinecone. Reusing existing embeddings... ---`);

    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });

    return pineconeVectorStore;
  } else {
    // If the namespace does not exist, download the document file from Firebase Storage then generate the Vector Embeddings, and store them in Pinecone vector store.
    const splitDocs = await generateDocs(docId);

    //console.log( `--- Storing Vector Embeddings in namespace ${docId} in the ${indexName} Pinecone Vector Store. Begin... ---`);

    pineconeVectorStore = await PineconeStore.fromDocuments(splitDocs, embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });

    return pineconeVectorStore;
  }
}

const generateLangChainCompletion = async (docId: string, question: string) => {
  let pineconeVectorStore;

  // eslint-disable-next-line prefer-const
  pineconeVectorStore = await generateEmbeddingsWithPineconeVectorStore(docId);
  if (!pineconeVectorStore) {
    throw new Error('No Pinecone Vector Store found');
    //TODO: Send Error to Sentry
  }

  // Create the Retriever Chain
  //console.log('--- Creating the Retriever Chain... ---');
  const retriever = pineconeVectorStore.asRetriever();

  // Fetch the chat history from the database
  const chatHistory = await fetchMessagesFromDB(docId);

  // Define a prompt template for generating search queries based on conversation history
  //console.log(    '--- Defining a prompt template for generating search queries based on conversation history... ---'  );
  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory, // Insert the actual chat History here

    ['user', '{input}'],
    [
      'user',
      'Based on the conversation history and the current question, generate a focused search query that will retrieve the most relevant information. Consider key terms, technical details, and specific context mentioned. The query should be specific enough to find precise information but broad enough to capture relevant context. If the current question references previous topics, include those key elements in the query.',
    ],
  ]);

  //Create a history aware retriever
  //console.log('--- Creating a history aware retriever chain... ---');
  const historyAwareRetrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });

  //Define a prompt template for answering questions based on retrieved context
  //console.log(    '--- Defining a prompt template for answering questions based on retrieved context... ---'  );
  const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      "You are a precise document analysis assistant. Using only the provided context below, answer the user's question thoroughly and accurately. If the information in the context is insufficient or ambiguous, acknowledge this explicitly. Focus on facts directly stated in the context rather than making assumptions. Connect information across different parts of the context when relevant. If the question asks about numerical data, double-check calculations and cite specific figures from the context. If the answer requires referring to previous conversation points, explicitly connect them to the current context.\n\nContext:\n{context}",
    ],

    ...chatHistory, // Insert the actual chat History here

    ['user', '{input}'],
  ]);

  //Create a document combining chain to create coherent responses
  //console.log('--- Creating a document combining chain to create coherent responses... ---');
  const historyAwareCombineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt: historyAwareRetrievalPrompt,
  });

  //Create the main history aware retriever chain
  //console.log('--- Creating the main history aware retriever chain... ---');
  const conversationalRetrievalChain = await createRetrievalChain({
    retriever: historyAwareRetrieverChain,
    combineDocsChain: historyAwareCombineDocsChain,
  });

  //Create the AI Reply
  //console.log('--- Creating the AI Reply... ---');
  const reply = await conversationalRetrievalChain.invoke({
    chat_history: chatHistory,
    input: question,
  });

  //Print the result to the console
  //console.log(reply.answer);
  return reply.answer;
};

//export the model and run the function

export { model, generateLangChainCompletion };
