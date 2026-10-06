import { Role } from '@/types/permission.types';

const ALL_MODULES = [
  'DASHBOARD',
  'PRODUCTS',
  'CATEGORIES',
  'BRANDS',
  'INVENTORY',
  'MOVEMENTS',
  'SUPPLIERS',
  'CUSTOMERS',
  'PURCHASES',
  'POS',
  'SALES_HISTORY',
  'RETURNS',
  'PAYMENTS',
  'ANALYTICS',
  'NOTIFICATIONS',
  'MEMBER_ROLES',
  'SETTINGS',
];

export const VIEW_ACCESS: Record<Role, string[]> = {
  OWNER: ALL_MODULES,
  ADMIN: ALL_MODULES,
  MANAGER: ALL_MODULES,
  SALESMAN: [
    'DASHBOARD',
    'PRODUCTS',
    'CATEGORIES',
    'BRANDS',
    'INVENTORY',
    'MOVEMENTS',
    'SUPPLIERS',
    'CUSTOMERS',
    'POS',
    'SALES_HISTORY',
    'RETURNS',
    'NOTIFICATIONS',
  ],
};

export const canViewModule = (role: string, module: string): boolean =>
  VIEW_ACCESS[role as Role]?.includes(module) ?? false;
