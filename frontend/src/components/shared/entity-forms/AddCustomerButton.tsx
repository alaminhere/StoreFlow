'use client';
import Button from '@/components/ui/button';
import { ReactNode, useState } from 'react';
import CustomerForm from './CustomerForm';
import clsx from 'clsx';

const AddCustomerButton = ({
  className,
  lable = 'Add Customer',
}: {
  className?: string;
  lable?: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        className={clsx('w-full md:w-fit', className)}
      >
        {lable}
      </Button>
      <CustomerForm open={open} setOpen={setOpen} customer={null} />
    </>
  );
};

export default AddCustomerButton;
