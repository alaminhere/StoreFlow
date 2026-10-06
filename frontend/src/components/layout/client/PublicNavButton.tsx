'use client';

import Button from '@/components/ui/button';
import { useGetStoreQuery } from '@/redux/feature/storeSlice';
import { useGetMeQuery } from '@/redux/feature/user/userSlice';
import Link from 'next/link';

const NavButton = () => {
  const { data: user, isLoading: userLoading } = useGetMeQuery();
  const { data: store, isLoading: storeLoading } = useGetStoreQuery();

  const isLoading = userLoading || storeLoading;

  if (!isLoading && user && store) {
    return (
      <Link href="/dashboard" className="hidden md:block">
        <Button>Dashboard</Button>
      </Link>
    );
  }

  if (!isLoading && user && !store) {
    return (
      <Link href="/profile" className="hidden md:block">
        <Button>Profile</Button>
      </Link>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-2">
      <Link href="/signin">
        <Button variant="secondary" className="bg-transparent border-none">
          Sign In
        </Button>
      </Link>
      <Link href="/signup">
        <Button>Get Started</Button>
      </Link>
    </div>
  );
};

export default NavButton;
