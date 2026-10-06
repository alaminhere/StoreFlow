'use client';
import Button from '@/components/ui/button';
import { useState } from 'react';
import PurchaseForm from './PurchaseForm';

const AddPurchaseButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(!open)} className="w-full md:w-fit">
        Add Purchase
      </Button>
      <PurchaseForm open={open} setOpen={setOpen} />
    </>
  );
};

export default AddPurchaseButton;
