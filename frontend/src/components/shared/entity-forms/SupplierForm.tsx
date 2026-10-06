'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Input from '@/components/ui/input';
import Button from '@/components/ui/button';

import handleAlert from '@/helpers/handleAlert';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';

import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from '@/redux/feature/supplierSlice';

import { CreateSupplier, Supplier } from '@/types/supplier.types';
import PopupModal from '../PopupModal';

type Props = {
  supplier?: Supplier | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SupplierForm = ({ supplier, open, setOpen }: Props) => {
  // create mutation
  const [createSupplier, { isLoading: loadingCreate }] =
    useCreateSupplierMutation();

  const [updateSupplier, { isLoading: loadingUpdate }] =
    useUpdateSupplierMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSupplier>({
    mode: 'onBlur',
  });

  //editing
  useEffect(() => {
    if (!supplier) return;

    reset({
      name: supplier.name,
      shopName: supplier.shopName,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
    });
  }, [supplier, reset]);

  const isEdit = !!supplier;
  const isLoading = loadingCreate || loadingUpdate;

  const onsubmit = async (data: CreateSupplier) => {
    try {
      const res = isEdit
        ? await updateSupplier({
            id: supplier.id,
            ...data,
          }).unwrap()
        : await createSupplier(data).unwrap();

      if (!res) return;
      if (res.success) {
        reset();
        setOpen(false);
      }

      handleAlert(res.success, res.message);
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <>
      {open && (
        <PopupModal
          className="max-w-xl"
          onClose={() => setOpen(false)}
          label={isEdit ? 'Edit Supplier' : 'Add New Supplier'}
        >
          <form
            onSubmit={handleSubmit(onsubmit)}
            className="flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input
                label="Supplier Name *"
                placeholder="Enter supplier name"
                {...register('name', {
                  required: 'Supplier name is required',
                })}
                error={errors.name}
              />

              <Input
                label="Shop Name *"
                placeholder="Enter shop name"
                {...register('shopName', {
                  required: 'Shop name is required',
                })}
                error={errors.shopName}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input
                label="Phone *"
                placeholder="Enter phone number"
                {...register('phone', {
                  required: 'Phone number is required',
                })}
                error={errors.phone}
              />

              <Input
                label="Email"
                placeholder="Enter email address"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
                error={errors.email}
              />
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 gap-3">
              <Input
                label="Address"
                placeholder="Enter address"
                {...register('address', {
                  required: 'Address is required',
                })}
                error={errors.address}
              />
            </div>

            {/* Submit */}
            <Button loading={isLoading} disabled={isLoading} type="submit">
              {isEdit ? 'Update Supplier' : 'Save Supplier'}
            </Button>
          </form>
        </PopupModal>
      )}
    </>
  );
};

export default SupplierForm;
