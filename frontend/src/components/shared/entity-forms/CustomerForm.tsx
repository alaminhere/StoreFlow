'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import PopupModal from '../PopupModal';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import handleAlert from '@/helpers/handleAlert';

import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from '@/redux/feature/customerSlice';
import { CreateCustomer, Customer } from '@/types/customer.types';

type Props = {
  customer?: Customer | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CustomerForm = ({ customer, open, setOpen }: Props) => {
  // create and update mutations
  const [createCustomer, { isLoading: loadingCreate }] =
    useCreateCustomerMutation();
  const [updateCustomer, { isLoading: loadingUpdate }] =
    useUpdateCustomerMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCustomer>({
    mode: 'onBlur',
  });

  // editing
  useEffect(() => {
    if (!customer) return;

    reset({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
    });
  }, [customer, reset]);

  const isEdit = !!customer;
  const isLoading = loadingCreate || loadingUpdate;


  const onsubmit = async (data: CreateCustomer) => {
    try {
      const res = isEdit
        ? await updateCustomer({
          id: customer.id,
          ...data,
        }).unwrap()
        : await createCustomer(data).unwrap();
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
          label={isEdit ? 'Edit Customer' : 'Add New Customer'}
        >
          <form
            onSubmit={handleSubmit(onsubmit)}
            className="flex flex-col gap-5"
          >
            <Input
              label="Customer Name *"
              placeholder="Enter customer name"
              {...register('name', {
                required: 'Customer name is required',
              })}
              error={errors.name}
            />

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

            <Button loading={isLoading} disabled={isLoading} type="submit">
              {isEdit ? 'Update Customer' : 'Save Customer'}
            </Button>
          </form>
        </PopupModal>
      )}
    </>
  );
};

export default CustomerForm;
