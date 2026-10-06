'use client';
import Button from '@/components/ui/button';
import { useState } from 'react';
import CustomerForm from './CustomerForm';

const AddCustomerButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(!open)} className="w-full md:w-fit">
        Add Customer
      </Button>
      <CustomerForm open={open} setOpen={setOpen} customer={null} />
    </>
  );
};

export default AddCustomerButton;
