'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import PopupModal from '../PopupModal';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import handleAlert from '@/helpers/handleAlert';
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from '@/redux/feature/categorySlice';
import { Category, CreateCategory } from '@/types/Category.types';

type Props = {
  categories?: Category | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CategoryForm = ({ categories, open, setOpen }: Props) => {
  // create and update mutations
  const [createCategory, { isLoading: loadingCreate }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: loadingUpdate }] =
    useUpdateCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCategory>();

  //  editing
  useEffect(() => {
    if (!categories) return;

    reset({
      name: categories.name,
    });
  }, [categories, reset]);

  const isEdit = !!categories;
  const isLoading = loadingCreate || loadingUpdate;

  const onsubmit = async (data: CreateCategory) => {
    try {
      const res = isEdit
        ? await updateCategory({
            id: categories.id,
            ...data,
          }).unwrap()
        : await createCategory(data).unwrap();

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
          label={isEdit ? 'Edit Category' : 'Add New Category'}
        >
          <form
            onSubmit={handleSubmit(onsubmit)}
            className="flex flex-col gap-5"
          >
            <Input
              label="Category Name *"
              placeholder="Enter Category name"
              {...register('name', {
                required: 'Category name is required',
              })}
              error={errors.name}
            />

            <Button loading={isLoading} disabled={isLoading} type="submit">
              {isEdit ? 'Update Category' : 'Save Category'}
            </Button>
          </form>
        </PopupModal>
      )}
    </>
  );
};

export default CategoryForm;
