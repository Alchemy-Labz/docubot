// components/Dashboard/Documents.tsx
import { auth } from '@clerk/nextjs/server';
import PlaceholderDocument from './PlaceholderDocument';
import { adminDb } from '#/firebaseAdmin';
import Document from './Document';

const Documents = async () => {
  try {
    // console.log('===== DEBUGGING DOCUMENTS COMPONENT =====');
    // console.log('Step 1: Starting Documents component');

    // Protect the route
    // console.log('Step 2: Authorizing with Clerk');
    auth().protect();

    // Get the authenticated user ID
    // console.log('Step 3: Getting user ID');
    const { userId } = await auth();
    // console.log('User ID obtained:', userId);

    if (!userId) {
      console.log('Error: No user ID found');
      throw new Error('Unauthorized');
    }

    // Create a reference to the files collection for this user
    // console.log('Step 4: Creating Firestore reference');
    // console.log('adminDb type:', typeof adminDb);
    // console.log('adminDb methods:', Object.keys(adminDb));

    // console.log('Creating user document reference');
    const userDocRef = adminDb.collection('users').doc(userId);
    // console.log('User doc reference created:', userDocRef.path);

    // console.log('Creating files collection reference');
    const userFilesCollection = userDocRef.collection('files');
    // console.log('Files collection reference created:', userFilesCollection.path);

    // Fetch the documents
    // console.log('Step 5: Fetching documents');
    const documentsSnapshot = await userFilesCollection.get();
    // console.log('Documents fetched successfully:', documentsSnapshot.size);
    // console.log('Is empty?', documentsSnapshot.empty);

    // console.log('Step 6: Rendering component');
    return (
      <div className='mx-auto flex max-w-7xl flex-wrap justify-center gap-5 rounded-b-md bg-dark-700/40 p-5 lg:justify-start'>
        {documentsSnapshot.empty ? (
          <div className='flex flex-col items-center justify-center p-6 text-light-300'>
            <p>You don&apos;t have any documents yet.</p>
          </div>
        ) : (
          // Map through the documents
          documentsSnapshot.docs.map((doc) => {
            // console.log('Processing document:', doc.id);
            const data = doc.data();
            // console.log('Document data:', data);
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
  } catch (error: unknown) {
    console.error('ERROR IN DOCUMENTS COMPONENT:', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error(
      'Error stack:',
      error instanceof Error ? error.stack : 'No stack trace available'
    );

    return (
      <div className='mx-auto flex max-w-7xl flex-wrap justify-center gap-5 rounded-b-md bg-dark-700/40 p-5'>
        <div className='flex flex-col items-center justify-center p-6 text-light-300'>
          <p>Error loading your documents. Please try again later.</p>
          <p className='mt-2 text-xs text-red-400'>
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
        <PlaceholderDocument />
      </div>
    );
  }
};
export default Documents;
