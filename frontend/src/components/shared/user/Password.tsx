/* eslint-disable react-hooks/incompatible-library */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import { Eye, EyeOff } from '@/helpers/icon/icon';
import handleAlert from '@/helpers/handleAlert';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';

import { useUpdateUserPasswordMutation } from '@/redux/feature/user/userSlice';
import { UpdatePassword } from '@/types/user/auth.types';

const UserPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdatePassword>();

  const [showCurrentP, setShowCurrentP] = useState(false);
  const [showNewP, setShowNewP] = useState(false);
  const [showCnfNew, setShowCnfNew] = useState(false);
  const [updateUserPassword, { isLoading }] = useUpdateUserPasswordMutation();

  const onSubmit = async (data: UpdatePassword): Promise<void> => {
    try {
      const res = await updateUserPassword(data).unwrap();
      if (!res) return;

      handleAlert(res.success, res.message);
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4>Password</h4>
      <p className="p13">Update your password to keep your account secure.</p>
      <div className="mt-5 space-y-3 border-t border-border pt-4">
        <div className="relative w-full">
          <Input
            type={showCurrentP ? 'text' : 'password'}
            label="Current Password"
            {...register('currentPassword', {
              required: 'Current password is required',
            })}
            placeholder="••••••••"
            error={errors.currentPassword}
          />

          <button
            type="button"
            onClick={() => setShowCurrentP(prev => !prev)}
            className={`absolute right-3 top-1/2 ${
              errors.currentPassword ? '-translate-y-1/2' : 'translate-y-1/2'
            } text-gray-400 transition-colors`}
          >
            {showCurrentP ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="relative w-full">
          <Input
            type={showNewP ? 'text' : 'password'}
            label="New Password"
            {...register('newPassword', {
              required: 'New Password is required',
            })}
            placeholder="••••••••"
            error={errors.newPassword}
          />

          <button
            type="button"
            onClick={() => setShowNewP(prev => !prev)}
            className={`absolute right-3 top-1/2 ${
              errors.newPassword ? '-translate-y-1/2' : 'translate-y-1/2'
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
              validate: value =>
                value === watch('newPassword') || 'Passwords do not match',
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
          type="submit"
          disabled={isLoading}
          loading={isLoading}
          className="w-fit"
        >
          Save changes
        </Button>
      </div>
    </form>
  );
};

export default UserPassword;
