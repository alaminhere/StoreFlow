'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import Button from '../ui/button';
import Input from '../ui/input';

import handleAlert from '@/helpers/handleAlert';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import {
  useVerifyForgotPasswordMutation,
  useVerifySignUpMutation,
} from '@/redux/feature/user/authSlice';

const FromVerification = () => {
  const router = useRouter();
  const params = useSearchParams();
  const forgotPassword = params.has('forgotPassword');

  const role = forgotPassword ? 'forgot' : 'signup';

  // sign-up OTP verification
  const [verifySignUp, { isLoading: isLoadingVerify }] =
    useVerifySignUpMutation();

  // forgot-password OTP verification
  const [verifyForgotPassword, { isLoading: isLoadingForgot }] =
    useVerifyForgotPasswordMutation();

  const isLoading = isLoadingForgot || isLoadingVerify;

  // OTP verification submission
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otp = e.currentTarget.otp.value;

    try {
      if (role === 'signup') {
        const res = await verifySignUp({ otp }).unwrap();
        if (!res.success) return;

        if (res.success) {
          router.push('/profile');
        }
        handleAlert(res.success, res.message);
      } else {
        const res = await verifyForgotPassword({ otp }).unwrap();
        if (!res.success) return;

        if (res.success) {
          router.push('/reset-password');
        }
      }
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-5 px-1">
      <Input label="Code" name="otp" type="number" />

      <Button
        size="md"
        className="w-full"
        type="submit"
        disabled={isLoading}
        loading={isLoading}
      >
        Verify Code
      </Button>
    </form>
  );
};

export default FromVerification;
