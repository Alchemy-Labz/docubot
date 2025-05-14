// components/Dashboard/Documents.tsx
import { auth } from '@clerk/nextjs/server';
import PlaceholderDocument from './PlaceholderDocument';
import { adminDb } from '#/firebaseAdmin'; // Admin SDK
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
      <div className='mx-auto flex max-w-7xl flex-wrap justify-center gap-5 rounded-b-md bg-dark-700/40 p-5 lg:justify-start'>
        {documentsSnapshot.empty ? (
          <div className='flex flex-col items-center justify-center p-6 text-light-300'>
            <p>You don&apos;t have any documents yet.</p>
          </div>
        ) : (
          // Map through the documents
          documentsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return (
              <Document
                key={doc.id}
                id={doc.id}
                name={data.name || 'Untitled'}
                size={data.size || 0}
                downloadURL={data.downloadURL || ''}
              />
            );
          })
        )}

        {/* Placeholder Document Card */}
        <PlaceholderDocument />
      </div>
    );
  } catch (error) {
    console.error('Error in Documents component:', error);
    return (
      <div className='mx-auto flex max-w-7xl flex-wrap justify-center gap-5 rounded-b-md bg-dark-700/40 p-5'>
        <div className='flex flex-col items-center justify-center p-6 text-light-300'>
          <p>Error loading your documents. Please try again later.</p>
        </div>
        <PlaceholderDocument />
      </div>
    );
  }
};

export default Documents;
