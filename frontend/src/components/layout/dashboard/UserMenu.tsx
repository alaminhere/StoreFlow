'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import Button from '@/components/ui/button';
import handleAlert from '@/helpers/handleAlert';
import MenuItem from '@/components/shared/MenuItem';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import { useSignOutMutation } from '@/redux/feature/user/authSlice';
import AddStoreButton from '@/components/shared/user/AddStoreButton';
import {
  House,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
} from '@/helpers/icon/icon';

const USER_MENU = [
  {
    name: 'Overview',
    items: [
      {
        name: 'Dashboard',
        icon: LayoutDashboard,
        href: '/profile',
      },
    ],
  },
  {
    name: 'Personal Area',
    items: [
      {
        name: 'Stores',
        icon: Package,
        href: '/profile/stores',
      },
      {
        name: '  Settings',
        icon: Settings,
        href: '/profile/settings',
      },
      {
        name: '  Home',
        icon: House,
        href: '/',
      },
    ],
  },
];

const UserMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [signOut, { isLoading }] = useSignOutMutation();

  const onSignOut = async () => {
    try {
      const res = await signOut().unwrap();

      if (!res) return;

      handleAlert(res.success, res.message);

      if (res.success) {
        router.push('/signin');
      }
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 scrollbar-thumb-border scrollbar-thin">
        {USER_MENU?.map((menu, index) => {
          return (
            <div key={index}>
              <p className="my-2 text-xs text-text font-medium uppercase">
                {menu.name}
              </p>

              {menu?.items?.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Link href={item.href} key={index}>
                    <MenuItem
                      active={pathname === item.href}
                      icon={<Icon size={14} />}
                      label={item.name}
                      className="rounded-md text-base! py-1.5!"
                    />
                  </Link>
                );
              })}
            </div>
          );
        })}

        <AddStoreButton />
      </div>
      <Button
        disabled={isLoading}
        loading={isLoading}
        type="button"
        className="w-full border-b-0 border-l-0 border-r-0 border-t! px-3! py-4! justify-start rounded-none text-danger"
        variant="secondary"
        onClick={onSignOut}
      >
        <LogOut size={15} />
        SignOut
      </Button>
    </>
  );
};

export default UserMenu;
