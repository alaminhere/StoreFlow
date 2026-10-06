'use client';

import { useState } from 'react';
import MemberForm from './MemberForm';
import Button from '@/components/ui/button';

const AddMemberButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(!open)} className="w-full md:w-fit">
        Add Member
      </Button>
      <MemberForm open={open} setOpen={setOpen} member={null} />
    </>
  );
};

export default AddMemberButton;
