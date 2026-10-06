'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Brand, CreateBrand } from '@/types/brand.types';

import PopupModal from '../PopupModal';

import Input from '@/components/ui/input';
import Button from '@/components/ui/button';

import handleAlert from '@/helpers/handleAlert';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';

import {
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from '@/redux/feature/brandSlice';

type Props = {
  brand?: Brand | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const BrandForm = ({ brand, open, setOpen }: Props) => {
  // create and update mutations
  const [createBrand, { isLoading: loadingCreate }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: loadingUpdate }] = useUpdateBrandMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBrand>();

  //  editing
  useEffect(() => {
    if (!brand) return;
    reset({
      name: brand.name,
    });
  }, [brand, reset]);

  const isEdit = !!brand;
  const isLoading = loadingCreate || loadingUpdate;

  const onsubmit = async (data: CreateBrand) => {
    try {
      const res = isEdit
        ? await updateBrand({
            id: brand.id,
            ...data,
          }).unwrap()
        : await createBrand(data).unwrap();

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
          label={isEdit ? 'Edit Brand' : 'Add New Brand'}
        >
          <form
            onSubmit={handleSubmit(onsubmit)}
            className="flex flex-col gap-5"
          >
            <Input
              label="Brand Name *"
              placeholder="Enter brand name"
              {...register('name', {
                required: 'Brand name is required',
              })}
              error={errors.name}
            />

            <Button loading={isLoading} disabled={isLoading} type="submit">
              {isEdit ? 'Update Brand' : 'Save Brand'}
            </Button>
          </form>
        </PopupModal>
      )}
    </>
  );
};

export default BrandForm;
