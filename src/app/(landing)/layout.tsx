// app/landing-page/layout.tsx
import Header2 from '@/components/Global/Header2';

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col'>
      <Header2 />
      <main>{children}</main>
    </div>
  );
};

export default LandingPageLayout;
