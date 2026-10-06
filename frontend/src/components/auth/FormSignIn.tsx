'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import Checkbox from '../ui/Checkbox';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';

import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import handleAlert from '@/helpers/handleAlert';
import { Eye, EyeOff } from '@/helpers/icon/icon';

import { useSignInMutation } from '@/redux/feature/user/authSlice';
import { SignUpFormType } from '@/types/user/auth.types';

const FormSignIn = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [signIn, { isLoading }] = useSignInMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormType>();

  const onSubmit = async (data: SignUpFormType) => {
    try {
      const res = await signIn(data).unwrap();
      if (!res) return;

      handleAlert(res.success, res.message);
      if (res.success) {
        router.push('/profile');
      }
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 px-1">
      <Input
        type="email"
        label="E-mail"
        placeholder=" example@gmail.com"
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email address',
          },
        })}
        error={errors.email}
      />
      <div className="relative w-full">
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-text">Password</p>

          <Link
            href="/forgot-password"
            type="button"
            className="p14 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          {...register('password', {
            required: 'Password is required',
          })}
          error={errors.password}
        />{' '}
        <button
          type="button"
          onClick={() => setShow(prev => !prev)}
          className={`absolute right-4 top-1/2 ${
            errors.password ? '-translate-y-1/2' : 'translate-y-1/2'
          } text-gray-400 transition-colors`}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>{' '}
      <Checkbox label="Remember me" />
      <Button
        size="md"
        type="submit"
        disabled={isLoading}
        loading={isLoading}
        className="mt-5 w-full"
      >
        Login
      </Button>
    </form>
  );
};

export default FormSignIn;
