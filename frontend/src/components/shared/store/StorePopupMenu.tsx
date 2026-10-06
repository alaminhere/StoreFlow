import { useState, useRef, useEffect } from 'react';
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  UserCog,
} from '@/helpers/icon/icon';
import MenuItem from '../MenuItem';
import Avatar from '../Avatar';
import handleAlert from '@/helpers/handleAlert';
import { useRouter } from 'next/navigation';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import Link from 'next/link';
import useCurrentStoreContext from '@/hooks/useCurrentStoreContext';
import { PermissionAction, PermissionModule } from '@/types/permission.types';
import { useCloseStoreMutation } from '@/redux/feature/storeSlice';

const menuItem = [
  {
    icon: User,
    label: 'My Profile',
    href: '/profile',
  },
  {
    icon: UserCog,
    label: 'Member & Roles',
    href: '/dashboard/users',
    permission: ['MEMBER_ROLES', 'view'],
  },
  {
    icon: Settings,
    label: 'Store Settings',
    href: '/dashboard/settings',
    permission: ['SETTINGS', 'view'],
  },
];

const StorePopupMenu = ({ className }: { className?: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [closeStore] = useCloseStoreMutation();
  const { currentMember, can } = useCurrentStoreContext();

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
      const res = await closeStore().unwrap();
      if (!res) return;
      handleAlert(res.success, res.message);
      if (res.success) {
        router.push('/profile');
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
        <Avatar
          name={currentMember?.name || 'Load...'}
          details={currentMember?.role || 'Load...'}
        />

        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'
            }`}
        />
      </button>
      {open && (
        <div className="absolute left-0 md:left-auto md:right-0 mt-3 w-66 bg-surface rounded-xl shadow-lg z-50">
          <div className=" px-3 py-2.5 border-b border-border">
            <h4 className="capitalize "> {currentMember?.name || ''}</h4>
            <p className="p14 leading-[1em] lowercase text-start">
              {currentMember?.email || ' '}
            </p>
          </div>

          {menuItem.map((item, index) => {
            if (
              item.permission &&
              !can(
                item.permission[0] as PermissionModule,
                item.permission[1] as PermissionAction,
              )
            ) {
              return null;
            }

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

          <div className="border-t border-border">
            <MenuItem
              onClick={onSignOut}
              icon={<LogOut size={16} />}
              label="Exit Store"
              danger
              className="py-2.5! text-sm! rounded-none!"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default StorePopupMenu;
