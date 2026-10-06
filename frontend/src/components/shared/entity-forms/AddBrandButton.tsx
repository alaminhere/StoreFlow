'use client';

import { useState } from 'react';

import BrandForm from './BrandForm';
import Button from '@/components/ui/button';

const AddBrandButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(!open)} className="w-full md:w-fit">
        Add Brand
      </Button>
      <BrandForm open={open} setOpen={setOpen} brand={null} />
    </>
  );
};

export default AddBrandButton;
