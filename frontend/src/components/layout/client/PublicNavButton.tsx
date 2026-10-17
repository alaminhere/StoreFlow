'use client';

import UserPopupMenu from '@/components/shared/user/UserPopupMenu';
import Button from '@/components/ui/button';
import { useGetMeQuery } from '@/redux/feature/user/userSlice';
import Link from 'next/link';

const NavButton = () => {
  const { data, isLoading } = useGetMeQuery();
  const user = data?.data;

  if (isLoading) return;
  if (user) {
    return <UserPopupMenu className="hidden md:flex" showText={false} />;
  }
  return (
    <div className="hidden md:flex items-center gap-2">
      <Link href="/signin">
        <Button
          variant="secondary"
          size="sm"
          className="border-none bg-transparent"
        >
          Sign In
        </Button>
      </Link>
      <Link href="/signup">
        <Button size="sm" className="px-3! py-1! rounded-[9px]">
          Get Started
        </Button>
      </Link>
    </div>
  );
};

export default NavButton;
