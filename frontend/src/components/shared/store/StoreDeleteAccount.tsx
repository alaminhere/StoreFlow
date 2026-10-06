'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import Input from '@/components/ui/input';
import Button from '@/components/ui/button';

import { Trash2 } from '@/helpers/icon/icon';
import handleAlert from '@/helpers/handleAlert';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';

import { useDeleteStoreMutation } from '@/redux/feature/storeSlice';
import { Store } from '@/types/store.types';

const StoreDeleteAccount = ({ store }: { store: Store }) => {
  const route = useRouter();
  const [deleteStore, { isLoading }] = useDeleteStoreMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
  }>();

  const onSubmit = async (data: { email: string }): Promise<void> => {
    const payload = {
      id: store.id,
      ...data,
    };

    try {
      const res = await deleteStore(payload).unwrap();
      if (!res) return;

      if (res.success) {
        handleAlert(res.success, res.message || 'Store Delete Successfully');
        route.push('/profile');
      }
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3>Delete Store</h3>
      <p className="p14">
        Permanently delete this store and all of its data. This action cannot be
        undone.
      </p>
      <div className="mt-5 space-y-3 border-t border-border pt-4">
        <Input
          type="text"
          label="Store Email"
          {...register('email', {
            required: 'Email is required',
          })}
          placeholder="••••••••"
          error={errors.email}
        />
        <Button
          type="submit"
          disabled={isLoading}
          loading={isLoading}
          variant="secondary"
          className="w-fit text-danger! hover:border-danger!"
        >
          Delete Account
          <Trash2 size={16} className="text-danger!" />
        </Button>
      </div>
    </form>
  );
};

export default StoreDeleteAccount;
