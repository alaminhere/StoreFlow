'use client';
import Button from '@/components/ui/button';
import { useState } from 'react';
import SupplierForm from './SupplierForm';

const AddSupplierButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(!open)} className="w-full md:w-fit">
        Add Supplier
      </Button>
      <SupplierForm open={open} setOpen={setOpen} supplier={null} />
    </>
  );
};

export default AddSupplierButton;
