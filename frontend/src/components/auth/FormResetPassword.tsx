'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import Input from '../ui/input';
import Button from '../ui/button';

import { Eye, EyeOff } from '@/helpers/icon/icon';
import handleAlert from '@/helpers/handleAlert';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';

import { ResetPasswordFormType } from '@/types/user/auth.types';
import { useResetPasswordMutation } from '@/redux/feature/user/authSlice';

const FormResetPassword = () => {
  const router = useRouter();

  const [showNewP, setShowNewP] = useState(false);
  const [showCnfNew, setShowCnfNew] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormType>();

  const onSubmit = async (data: ResetPasswordFormType): Promise<void> => {
    try {
      const res = await resetPassword(data).unwrap();
      if (!res) return;

      if (res.success) {
        router.push('/signin');
        handleAlert(res.success, res.message);
      } else {
        handleAlert(res.success, res.message);
      }
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="w-full space-y-3">
        <div className="relative w-full">
          <Input
            type={showNewP ? 'text' : 'password'}
            label="New Password"
            {...register('password', {
              required: 'New Password is required',
            })}
            placeholder="••••••••"
            error={errors.password}
          />

          <button
            type="button"
            onClick={() => setShowNewP(prev => !prev)}
            className={`absolute right-3 top-1/2 ${
              errors.password ? '-translate-y-1/2' : 'translate-y-1/2'
            } text-gray-400 transition-colors`}
          >
            {showNewP ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="relative w-full">
          <Input
            type={showCnfNew ? 'text' : 'password'}
            label="Confirm New Password"
            {...register('confirmPassword', {
              required: 'Confirm New Password is required',
            })}
            placeholder="••••••••"
            error={errors.confirmPassword}
          />

          <button
            type="button"
            onClick={() => setShowCnfNew(prev => !prev)}
            className={`absolute right-3 top-1/2 ${
              errors.confirmPassword ? '-translate-y-1/2' : 'translate-y-1/2'
            } text-gray-400 transition-colors`}
          >
            {showCnfNew ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <Button
          size="md"
          type="submit"
          disabled={isLoading}
          loading={isLoading}
          className="mt-5 w-full"
        >
          Reset Password
        </Button>
      </div>
    </form>
  );
};

export default FormResetPassword;
