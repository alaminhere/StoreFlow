import Link from 'next/link';
import FormSignIn from '@/components/auth/FormSignIn';
import Showcase from '@/components/auth/Showcase';

const SignInPage = () => {
  return (
    <section>
      <div className="app-container  max-w-5xl min-h-screen flex justify-center items-center">
        <div className=" w-full flex flex-col-reverse  md:flex-row md:border border-border rounded-3xl  overflow-hidden">
          {/* left */}
          <Showcase />
          {/* right  */}
          <div className="md:bg-background-secondary  md:w-1/2 relative  flex flex-col justify-center items-start bg-yellow md:p-8 mt-5 md:mt-0 ">
            <div className="w-full mb-8">
              <h2>Welcome back! </h2>
              <p className="">Log in to your store account</p>
            </div>
            <FormSignIn />

            <p className="p14 text-center mt-5 w-full">
              Don&apos;t have an account ?{'   '}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInPage;
