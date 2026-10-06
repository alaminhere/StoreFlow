import Link from 'next/link';
import Showcase from '@/components/auth/Showcase';
import FormResetPassword from '@/components/auth/FormResetPassword';

const ResetPasswordPage = () => {
  return (
    <section>
      <div className="app-container max-w-5xl min-h-screen flex justify-center items-center">
        <div className="w-full flex flex-col-reverse  md:flex-row md:border border-border rounded-xl  overflow-hidden">
          {/* left */}
          <Showcase />
          {/* right  */}
          <div className="md:bg-background-secondary  md:w-1/2 relative  flex flex-col justify-center items-start bg-yellow md:p-8 mt-5 md:mt-0 ">
            <div className="w-full mb-8">
              <h2>Reset password?</h2>
              <p>Enter your new password to reset your password</p>
            </div>

            <FormResetPassword />

            <Link
              href="/signin"
              className=" p14 text-center mt-5 w-full hover:underline"
            >
              back to login now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
