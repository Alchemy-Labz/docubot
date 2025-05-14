import { adminDb } from '#/firebaseAdmin';
import ChatWindow from '@/components/Dashboard/ChatWindow';
import PDFViewer from '@/components/Dashboard/PDFViewer';
import { auth } from '@clerk/nextjs/server';
import React from 'react';

const ChatWithDocumentPage = async ({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  auth().protect();
  const { userId } = await auth();

  const ref = await adminDb.collection('users').doc(userId!).collection('files').doc(id).get();
  const url = ref.data()?.downloadURL;

  const isPdfVisible = searchParams.pdf !== 'hidden';

  return (
    <div
      className={`flex h-[calc(100vh-64px)] flex-col overflow-hidden lg:flex-row ${isPdfVisible ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
    >
      {isPdfVisible && (
        <div
          className={`border-accent-200 dark:border-accent-700 border-b lg:border-b-0 lg:border-r ${isPdfVisible ? 'h-1/2 w-full lg:h-full lg:w-1/2' : 'h-12 w-full lg:h-full lg:w-12'}`}
        >
          <PDFViewer url={url} />
        </div>
      )}
      <div className={isPdfVisible ? 'h-1/2 w-full lg:h-full lg:w-1/2' : 'h-full w-full'}>
        <ChatWindow id={id} />
      </div>
    </div>
  );
};

export default ChatWithDocumentPage;
