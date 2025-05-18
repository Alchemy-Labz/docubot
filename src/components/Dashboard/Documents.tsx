// components/Dashboard/Documents.tsx
import { auth } from '@clerk/nextjs/server';
import PlaceholderDocument from './PlaceholderDocument';
import { adminDb } from '@/lib/firebase/firebaseAdmin'; // Admin SDK
import Document from './Document';

const Documents = async () => {
  try {
    // Protect the route
    auth().protect();

    // Get the authenticated user ID
    const { userId } = await auth();
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Create a reference to the files collection
    const userFilesCollection = adminDb.collection('users').doc(userId).collection('files');

    // Fetch the documents
    const documentsSnapshot = await userFilesCollection.get();

    return (
      <main
        className='mx-auto flex max-w-7xl flex-wrap justify-center gap-5 rounded-b-md bg-dark-700/40 p-5 lg:justify-start'
        aria-labelledby='documents-heading'
      >
        <h2 id='documents-heading' className='sr-only'>
          Your Documents
        </h2>

        {documentsSnapshot.empty ? (
          <div
            className='flex flex-col items-center justify-center p-6 text-light-300'
            role='status'
            aria-live='polite'
          >
            <p>You don&apos;t have any documents yet.</p>
            <p className='mt-2 text-sm text-light-400'>
              Upload your first document to get started with DocuBot.
            </p>
          </div>
        ) : (
          // Map through the documents
          <div
            className='flex flex-wrap justify-center gap-5 lg:justify-start'
            role='grid'
            aria-label={`${documentsSnapshot.docs.length} documents`}
          >
            {documentsSnapshot.docs.map((doc) => {
              const data = doc.data();
              return (
                <div key={doc.id} role='gridcell'>
                  <Document
                    id={doc.id}
                    name={data.name || 'Untitled'}
                    size={data.size || 0}
                    downloadURL={data.downloadURL || ''}
                    type={data.type || ''}
                    fileIcon={data.fileIcon || ''}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Placeholder Document Card */}
        <div role='gridcell'>
          <PlaceholderDocument />
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error in Documents component:', error);
    return (
      <main
        className='mx-auto flex max-w-7xl flex-wrap justify-center gap-5 rounded-b-md bg-dark-700/40 p-5'
        aria-labelledby='documents-error-heading'
      >
        <h2 id='documents-error-heading' className='sr-only'>
          Documents Error
        </h2>
        <div
          className='flex flex-col items-center justify-center p-6 text-light-300'
          role='alert'
          aria-live='assertive'
        >
          <h3 className='mb-2 text-lg font-medium'>Error Loading Documents</h3>
          <p>Error loading your documents. Please try again later.</p>
          <p className='mt-2 text-sm text-light-400'>
            If this problem persists, please contact support.
          </p>
        </div>
        <div role='gridcell'>
          <PlaceholderDocument />
        </div>
      </main>
    );
  }
};

export default Documents;
