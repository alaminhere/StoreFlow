'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Input from '@/components/ui/input';
import { Eye, EyeOff, Trash2 } from '@/helpers/icon/icon';
import Button from '@/components/ui/button';
import { useDeleteUserMutation } from '@/redux/feature/user/userSlice';
import handleAlert from '@/helpers/handleAlert';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import { useRouter } from 'next/navigation';

const UserDeleteAccount = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string }>();

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const onSubmit = async (data: { password: string }): Promise<void> => {
    try {
      const res = await deleteUser(data).unwrap();
      if (!res) return;
      router.push('/signin');
      handleAlert(res.success, res.message);
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4>Delete Account</h4>
      <p className="p13">Enter the password to delete your account.</p>

      <div className="border-t border-border mt-5 pt-4 space-y-3">
        <div className="relative w-full">
          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...register('password', {
              required: 'Password is required',
            })}
            placeholder="••••••••"
            error={errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className={`absolute right-3 top-1/2 ${errors.password ? '-translate-y-1/2' : 'translate-y-1/2'} text-gray-400 transition-colors`}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          loading={isLoading}
          variant="secondary"
          className="w-fit text-danger! hover:border-danger!"
        >
          Delete Account <Trash2 size={16} />
        </Button>
      </div>
    </form>
  );
};

export default UserDeleteAccount;
