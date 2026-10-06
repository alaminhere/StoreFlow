'use client';

import { useState } from 'react'; ;
import Button from '@/components/ui/button';
import ReturnForm from './ReturnForm';

const AddReturnButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(!open)} className="w-full md:w-fit">
        Add Return
      </Button>
      <ReturnForm open={open} setOpen={setOpen}  />
    </>
  );
};

export default AddReturnButton;
