'use client';

import { useState } from 'react';

import Button from '@/components/ui/button';
import StoreForm from './StoreForm';
import clsx from 'clsx';

const AddStoreButton = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        variant="secondary"
        className={clsx(
          'w-full mt-5 border-dashed border-warning/40 text-warning',
          className,
        )}
      >
        Create Store
      </Button>
      <StoreForm open={open} setOpen={setOpen} />
    </>
  );
};

export default AddStoreButton;
