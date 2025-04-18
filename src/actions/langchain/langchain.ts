/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
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
import { adminDb } from '#/firebaseAdmin';
import { auth } from '@clerk/nextjs/server';

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

  //console.log(`--- ${chatHistory.length} Messages fetched sucessfully. ---`);
  //console.log(chatHistory.map((msg) => msg.content.toString()));

  return chatHistory;
}

export async function generateDocs(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('No user logged in');
    //TODO: Send Error to Sentry
  }

  //console.log('--- Fecthing the download URL from Firebase... ---');
  const firebaseRef = await adminDb
    .collection('users')
    .doc(userId)
    .collection('files')
    .doc(docId)
    .get();

  const downloadURL = firebaseRef.data()?.downloadURL;

  if (!downloadURL) {
    throw new Error('Download URL not found');
    //TODO: Send Error to Sentry
  }

  //console.log(`--- Download URL fetched sucessfully. ${downloadURL} ---`);

  // Fetch the PDF from the specified URL
  const response = await fetch(downloadURL);

  // Load  the PDF into into a PDFDocument Object
  const data = await response.blob();

  //Load the PDF document from the specified path
  //console.log('--- Loading PDF Document... ---');
  const loader = new PDFLoader(data);
  const docs = await loader.load();
  //console.log('--- PDF Document loaded sucessfully. ---');

  //Split the PDF into smaller chunks for smoother processing
  //console.log('--- Splitting PDF into smaller chunks... ---');
  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);
  //console.log(`--- PDF Document split into ${splitDocs.length} chunks sucessfully. ---`);

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
    //console.log(`--- ${docId} namespace already exsist in Pinecone. Reusing exsisting embeddings... ---`);

    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });

    return pineconeVectorStore;
  } else {
    // If the namespace does not exist, download the PDF file from Firebase Storage then generate the Vector Embeddings, and store them in Pinecone vectorr store.
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

  // Define a propmpt template for generating search queries based on conversation history
  //console.log(    '--- Defining a prompt template for generating search queries based on conversation history... ---'  );
  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory, // Insert the actual chat History here

    ['user', '{input}'],
    [
      'user',
      'Based on the conversation history and the current question, generate a focused search query that will retrieve the most relevant information. Consider key terms, technical details, and specific context mentioned. The query should be specific enough to find precise information but broad enough to capture relevant context. If the current question references previous topics, include those key elements in the query.',
    ],
  ]);

  //Creat a history aware retriever
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

  //Create a document combining chain to create coherant responses
  //console.log('--- Creating a document combining chain to create coherant responses... ---');
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
