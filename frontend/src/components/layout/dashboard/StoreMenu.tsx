'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

import Button from '../../ui/button';
import {
  Award, 
  CreditCard,
  LayoutDashboard,
  LineChart,
  LogOut,
  Monitor,
  Package,
  RotateCcw,
  Settings,
  ShoppingCart,
  Tags,
  Truck,
  User,
  UserCog,
  Warehouse,
  ArrowUpDown,
  History,
} from '@/helpers/icon/icon';

import MenuItem from '../../shared/MenuItem';
import handleAlert from '@/helpers/handleAlert';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import useCurrentStoreContext from '@/hooks/useCurrentStoreContext';
import { PermissionAction, PermissionModule } from '@/types/permission.types';
import { useCloseStoreMutation } from '@/redux/feature/storeSlice';

const STORE_MENU = [
  {
    name: 'Overview',
    items: [
      {
        name: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        permission: ['DASHBOARD', 'view'],
      },
    ],
  },

  {
    name: 'Catalog',
    items: [
      {
        name: 'Products',
        icon: Package,
        href: '/dashboard/products',
        permission: ['PRODUCTS', 'view', 'create', 'edit', 'delete'],
      },
      {
        name: 'Categories',
        icon: Tags,
        href: '/dashboard/categories',
        permission: ['CATEGORIES', 'view', 'create', 'edit', 'delete'],
      },
      {
        name: 'Brands',
        icon: Award,
        href: '/dashboard/brands',
        permission: ['BRANDS', 'view', 'create', 'edit', 'delete'],
      },
    ],
  },

  {
    name: 'Inventory',
    items: [
      {
        name: 'Inventory',
        icon: Warehouse,
        href: '/dashboard/inventory',
        permission: ['INVENTORY', 'view', 'create', 'edit', 'delete'],
      },
      {
        name: 'Movements',
        icon: ArrowUpDown,
        href: '/dashboard/movements',
        permission: ['MOVEMENTS', 'view', 'create'],
      },
    ],
  },

  {
    name: 'Partners',
    items: [
      {
        name: 'Suppliers',
        icon: Truck,
        href: '/dashboard/suppliers',
        permission: ['SUPPLIERS', 'view', 'create', 'edit', 'delete'],
      },
      {
        name: 'Customers',
        icon: User,
        href: '/dashboard/customers',
        permission: ['CUSTOMERS', 'view', 'create', 'edit', 'delete'],
      },
    ],
  },

  {
    name: 'Commerce',
    items: [
      {
        name: 'Purchases',
        icon: ShoppingCart,
        href: '/dashboard/purchases',
        permission: ['PURCHASES', 'view', 'create', 'edit', 'delete'],
      },
      {
        name: 'POS',
        icon: Monitor,
        href: '/dashboard/pos',
        permission: ['POS', 'view', 'create'],
      },
      {
        name: 'Sales History',
        icon: History,
        href: '/dashboard/sales',
        permission: ['SALES_HISTORY', 'view', 'edit', 'delete'],
      },
      {
        name: 'Returns',
        icon: RotateCcw,
        href: '/dashboard/returns',
        permission: ['RETURNS', 'view', 'create', 'edit', 'delete'],
      },
    ],
  },

  {
    name: 'Insights & Finance',
    items: [
      {
        name: 'Payments',
        icon: CreditCard,
        href: '/dashboard/payments',
        permission: ['PAYMENTS', 'view', 'create', 'edit', 'delete'],
      },
      {
        name: 'Analytics',
        icon: LineChart,
        href: '',
        permission: ['ANALYTICS', 'view'],
      },
    ],
  },

  {
    name: 'System',
    items: [

      {
        name: 'Member & Roles',
        icon: UserCog,
        href: '/dashboard/roles',
        permission: ['MEMBER_ROLES', 'view', 'create', 'edit', 'delete'],
      },
      {
        name: 'Settings',
        icon: Settings,
        href: '/dashboard/settings',
        permission: ['SETTINGS', 'view', 'edit', 'delete'],
      },
    ],
  },
];

const StoreMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [closeStore, { isLoading }] = useCloseStoreMutation();
  const { can } = useCurrentStoreContext();

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
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 scrollbar-thumb-border scrollbar-thin">
        {STORE_MENU.map((menu, index) => {
          const visibleItems = menu.items.filter(item =>
            can(
              item.permission[0] as PermissionModule,
              item.permission[1] as PermissionAction,
            ),
          );
          if (!visibleItems.length) return null;

          return (
            <div key={index}>
              <p className="my-2 text-xs text-text font-medium uppercase">
                {menu.name}
              </p>

              {visibleItems.map((item, index) => {
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
        live Store
      </Button>
    </>
  );
};

export default StoreMenu;
