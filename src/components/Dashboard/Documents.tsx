import { auth } from '@clerk/nextjs/server';
import PlaceholderDocument from './PlaceholderDocument';
import { adminDb } from '#/firebaseAdmin';
import Document from './Document';

const Documents = async () => {
  auth().protect();

  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const documentsSnapshot = await adminDb
    .collection('users')
    .doc(userId)
    .collection('files')
    .get();

  return (
    <div className='mx-auto flex max-w-7xl flex-wrap justify-center gap-5 rounded-b-md bg-dark-700/40 p-5 lg:justify-start'>
      {/* Map through the Users Documents. */}
      {documentsSnapshot.docs.map((doc) => {
        const { name, size, downloadURL } = doc.data();

        return (
          <Document key={doc.id} id={doc.id} name={name} size={size} downloadURL={downloadURL} />
        );
      })}

      {/* Placeholder Document Card  */}
      <PlaceholderDocument />
    </div>
  );
};

export default Documents;
