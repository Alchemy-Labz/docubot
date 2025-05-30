// src/app/dashboard/documents/[id]/page.tsx
import { adminDb } from '@/lib/firebase/firebaseAdmin';
import DocumentViewContainer from '@/components/Dashboard/DocumentViewContainer';
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

interface DocumentPageProps {
  params: Promise<{ id: string }>;
}

const DocumentPage = async ({ params }: DocumentPageProps) => {
  auth.protect();
  const { userId } = await auth();

  // Await the params since they're now async in Next.js 15
  const { id } = await params;

  try {
    const docRef = await adminDb
      .collection('users')
      .doc(userId!)
      .collection('files')
      .doc(id)
      .get();

    if (!docRef.exists) {
      notFound();
    }

    const documentData = docRef.data();

    // Only pass the data we need, not Firebase references
    return (
      <DocumentViewContainer
        id={id}
        userId={userId!}
        url={documentData?.downloadURL}
        fileName={documentData?.name || 'Document'}
      />
    );
  } catch (error) {
    console.error('Error fetching document:', error);
    notFound();
  }
};

export default DocumentPage;
