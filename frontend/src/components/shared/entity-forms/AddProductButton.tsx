'use client';
import { useState } from 'react';
import ProductForm from './ProductForm';
import Button from '@/components/ui/button';

const AddProductButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpen(!open)} 
        className="w-full md:w-fit"
      >
        Add Product
      </Button>
      <ProductForm product={null} open={open} setOpen={setOpen} />
    </>
  );
};

export default AddProductButton;

