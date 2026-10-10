import Link from 'next/link';
import Showcase from '@/components/auth/Showcase';
import FormSignUp from '@/components/auth/FormSignUp';
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
            {' '}
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-1 p14 md:hidden"
            >
              <ChevronLeft size={16} aria-hidden /> Back to home
            </Link>
            <FormSignUp />
            <Link
              href="/signin"
              className="p14 text-center mt-5 w-full hover:underline "
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
