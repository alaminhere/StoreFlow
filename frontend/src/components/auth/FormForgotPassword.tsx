'use client';

import { useRouter } from 'next/navigation';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import handleAlert from '@/helpers/handleAlert';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import { useForgetPasswordMutation } from '@/redux/feature/user/authSlice';

const FormForgotPassword = () => {
  const router = useRouter();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();


  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;

    try {
      const res = await forgetPassword({ email }).unwrap();
      if (!res) return;

      if (res.success) {
        router.push('/verify?forgotPassword');
      } else {
        handleAlert(res.success, res.message);
      }
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full px-1">
      <div className="w-full space-y-2">
        <Input
          label="Email"
          id="email"
          type="email"
          name="email"
          placeholder="example@gmail.com"
        />
      </div>{' '}
      <Button
        size="md"
        type="submit"
        disabled={isLoading}
        loading={isLoading}
        className="mt-5 w-full bg-yellow text-whiteCustom uppercase"
      >
        {isLoading ? 'loading...' : 'Send Code'}
      </Button>
    </form>
  );
};

export default FormForgotPassword;
