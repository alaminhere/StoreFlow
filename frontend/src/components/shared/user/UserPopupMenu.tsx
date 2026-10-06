import { useState, useRef, useEffect } from 'react';
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Package,
  Eye,
} from '@/helpers/icon/icon';
import handleAlert from '@/helpers/handleAlert';
import { useRouter } from 'next/navigation';
import { useSignOutMutation } from '@/redux/feature/user/authSlice';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import Link from 'next/link';
import useCurrentUserContext from '@/hooks/useCurrentUserContext';
import MenuItem from '../MenuItem';
import Avatar from '../Avatar';

const menuItem = [
  {
    icon: User,
    label: 'My Profile',
    href: '/profile',
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/profile/settings',
  },
];

const UserPopupMenu = ({ className }: { className?: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [signOut] = useSignOutMutation();

  const { user, store } = useCurrentUserContext();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div ref={menuRef} className="relative inline-block">
      <button
        onClick={() => setOpen(prev => !prev)}
        className={`flex items-center gap-2 cursor-pointer ${className}`}
      >
        <Avatar name={user?.name || 'Load...'} details={'User'} />

        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>
      {open && (
        <div className="absolute left-0 md:left-auto md:right-0 mt-3 w-66 bg-surface rounded-xl shadow-lg z-50">
          <div className=" px-3 py-2.5 border-b border-border">
            <h4 className="capitalize "> {user?.name || ''}</h4>
            <p className="p14 leading-[1em] lowercase text-start">
              {user?.email || ' '}
            </p>
          </div>

          {menuItem.map((item, index) => {
            return (
              <Link key={index} href={item.href}>
                <MenuItem
                  icon={<item.icon size={16} />}
                  label={item.label}
                  className="py-2.5! text-sm! rounded-none!"
                />
              </Link>
            );
          })}
          <div className=" ">
            {store ? (
              <>
                <Link href={'/dashboard'}>
                  <div className=" px-3 py-2.5 border-b border-border">
                    <h4 className="capitalize ">Current Store </h4>
                    <p className="p14 leading-[1em] lowercase text-start">
                      {store?.name || ''}
                    </p>
                  </div>
                  <MenuItem
                    icon={<Eye size={16} />}
                    label={'View   Store '}
                    className="py-2.5! text-sm! rounded-none!"
                  />
                </Link>
                <Link href={'/profile/stores'}>
                  <MenuItem
                    icon={<Package size={16} />}
                    label={'Switch Store'}
                    className="py-2.5! text-sm! rounded-none!"
                  />
                </Link>
              </>
            ) : (
              <Link href={'/profile/stores'}>
                <MenuItem
                  icon={<Package size={16} />}
                  label={'Create Store'}
                  className="py-2.5! text-sm! rounded-none!"
                />
              </Link>
            )}
          </div>

          <div className="border-t border-border">
            <MenuItem
              onClick={onSignOut}
              icon={<LogOut size={16} />}
              label="Sign Out"
              danger
              className="py-2.5! text-sm! rounded-none!"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default UserPopupMenu;
