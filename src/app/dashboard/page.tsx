import Documents from '@/components/Dashboard/Documents';

export const dynamic = 'force-dynamic' as never;
const Dashboard = () => {
  return (
    <div className='mx-auto h-full max-w-7xl py-4'>
      <h1 className='border-b border-light-600 bg-light-800/40 p-5 text-3xl font-light text-dark-700 dark:border-light-800 dark:bg-dark-700/60 dark:font-extralight dark:text-light-700'>
        My Documents
      </h1>

      {/* Documents Folder  */}
      <Documents />
    </div>
  );
};

export default Dashboard;
