'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';

import { Menu, X } from '@/helpers/icon/icon';

import { useGetMeQuery } from '@/redux/feature/user/userSlice';
import { useGetStoreQuery } from '@/redux/feature/storeSlice';

const authMenu = [
  {
    label: 'Signin',
    href: '/signin',
  },
  {
    label: 'Get Started',
    href: '/signup',
  },
];

type MenuItem = {
  label: string;
  href: string;
};

const MobileMenu = ({
  className,
  menuItems,
}: {
  className?: string;
  menuItems?: MenuItem[];
}) => {
  // WHAT: Manage mobile menu visibility
  const [isOpen, setIsOpen] = useState(false);

  // WHAT: Get current user and store data
  const { data: user, isLoading: userLoading } = useGetMeQuery();
  const { data: store, isLoading: storeLoading } = useGetStoreQuery();

  const isLoading = userLoading || storeLoading;

  return (
    <div className={clsx('flex flex-col items-end', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-surface"
      >
        {isOpen ? <X size={28} /> : <Menu size={25} />}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full flex w-full flex-col gap-1 overflow-hidden bg-background shadow-sm">
          {menuItems?.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="border-b border-border px-5 py-3 text-base text-text hover:text-primary"
            >
              {item.label}
            </Link>
          ))}

          {!isLoading && !user ? (
            authMenu.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="border-b border-border px-5 py-3 text-base text-text hover:text-primary"
              >
                {item.label}
              </Link>
            ))
          ) : !isLoading && store ? (
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="border-b border-border px-5 py-3 text-base text-text hover:text-primary"
            >
              Dashboard
            </Link>
          ) : !isLoading && user ? (
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="border-b border-border px-5 py-3 text-base text-text hover:text-primary"
            >
              Profile
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
