/* eslint-disable react-hooks/incompatible-library */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import Checkbox from '../ui/Checkbox';
import handleAlert from '@/helpers/handleAlert';
import { Eye, EyeOff } from '@/helpers/icon/icon';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';

import { useSignUpMutation } from '@/redux/feature/user/authSlice';
import { SignUpFormType } from '@/types/user/auth.types';

const FormSignUp = () => {
  const router = useRouter();
  const [signUp, { isLoading }] = useSignUpMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormType>();

  const onSubmit = async (data: SignUpFormType) => {
    if (data.password !== data.confirmPassword) {
      handleAlert(false, 'password to not match');
      return;
    }
    try {
      const res = await signUp(data).unwrap();
      if (!res) return;

      if (res.success) {
        router.push('/verify');
      }
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 px-1">
      <div className="mb-8 w-full md:block">
        <h2>Create account</h2>
        <p>Start managing your inventory today</p>
      </div>
      <Input
        type="text"
        label="Name *"
        placeholder="jon doe"
        {...register('name', {
          required: 'Business Name is required',
        })}
        error={errors.name}
      />
      <Input
        type="email"
        label="E-mail *"
        placeholder="example@gmail.com"
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email address',
          },
        })}
        error={errors.email}
      />
      <Input
        type="text"
        label="Phone *"
        placeholder="+880 1XXX XXX XXX"
        {...register('phone', {
          required: 'Phone is required',
        })}
        error={errors.phone}
      />
      <div className="relative w-full">
        <Input
          type={showPassword ? 'text' : 'password'}
          label="Password *"
          placeholder="••••••••"
          {...register('password', {
            required: 'Password is required',
          })}
          error={errors.password}
        />
        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          className={`absolute right-3 top-1/2 ${
            errors.password ? '-translate-y-1/2' : 'translate-y-1/2'
          } text-gray-400 transition-colors`}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>{' '}
      <div className="relative w-full">
        <Input
          type={showConfirmPassword ? 'text' : 'password'}
          label="Confirm Password *"
          placeholder="••••••••"
          {...register('confirmPassword', {
            required: 'Confirm New Password is required',
            validate: value =>
              value === watch('password') || 'Passwords do not match',
          })}
          error={errors.confirmPassword}
        />{' '}
        <button
          type="button"
          onClick={() => setShowConfirmPassword(prev => !prev)}
          className={`absolute right-3 top-1/2 ${
            errors.confirmPassword ? '-translate-y-1/2' : 'translate-y-1/2'
          } text-gray-400 transition-colors`}
        >
          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <Checkbox
        {...register('agree', {
          required: 'You must agree to the Terms',
        })}
        error={errors.agree}
        label="I agree to the Terms of Service and Privacy Policy"
      />
      <Button
        size="md"
        type="submit"
        disabled={isLoading}
        loading={isLoading}
        className="mt-5 w-full"
      >
        Register
      </Button>
    </form>
  );
};

export default FormSignUp;
