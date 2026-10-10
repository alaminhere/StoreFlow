import Link from 'next/link';
import Showcase from '@/components/auth/Showcase';
import FromVerification from '@/components/auth/From-Verification';
import { Suspense } from 'react';
import Loading from '@/components/shared/Loading';
import { ChevronLeft } from '@/helpers/icon/icon';

const VerifyPage = () => {
  return (
    <section>
      <div className="app-container max-w-5xl min-h-screen flex justify-center items-center">
        <div className="w-full flex flex-col-reverse  md:flex-row md:border border-border rounded-xl  overflow-hidden">
          {/* left */}
          <Showcase />
          {/* right */}
          <div className="md:bg-background-secondary  md:w-1/2 relative  flex flex-col justify-center items-start bg-yellow md:p-8 mt-5 md:mt-0 ">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-1 p14 md:hidden"
            >
              <ChevronLeft size={16} aria-hidden /> Back to home
            </Link>{' '}
            <div className="md:block w-full mb-8">
              <h3>Check your email</h3>
              <p>We sent a 6-digit code to your email</p>
            </div>
            <Suspense fallback={<Loading />}>
              <FromVerification />
            </Suspense>
            <Link
              href="/signin"
              className="p14 mt-5 text-center  w-full hover:underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyPage;
