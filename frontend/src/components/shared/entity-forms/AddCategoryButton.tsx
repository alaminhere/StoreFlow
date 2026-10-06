'use client';

import { useState } from 'react';

import Button from '@/components/ui/button';
import CategoriesForm from './CategoryForm';

const AddCategoryButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(!open)} className="w-full md:w-fit">
        Add Category
      </Button>
      <CategoriesForm open={open} setOpen={setOpen} categories={null} />
    </>
  );
};

export default AddCategoryButton;
