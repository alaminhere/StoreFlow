'use client';

import { useState } from 'react';

import Button from '@/components/ui/button';
import StoreForm from './StoreForm';

const AddStoreButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(!open)} 
        variant="secondary"
        className="w-full mt-5 border-dashed border-warning/40 text-warning"
      >
        Create Store
      </Button>

      <StoreForm open={open} setOpen={setOpen} />
    </>
  );
};

export default AddStoreButton;
