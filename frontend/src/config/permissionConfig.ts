import { PermissionAction, PermissionModule } from '@/types/permission.types';

interface PermissionConfig {
  key: PermissionModule;
  label: string;
  actions: PermissionAction[];
}

export const PERMISSION_CONFIG: PermissionConfig[] = [
  {
    key: 'DASHBOARD',
    label: 'Dashboard',
    actions: ['view'],
  },

  {
    key: 'PRODUCTS',
    label: 'Products',
    actions: ['view', 'create', 'edit', 'delete'],
  },
  {
    key: 'CATEGORIES',
    label: 'Categories',
    actions: ['view', 'create', 'edit', 'delete'],
  },
  {
    key: 'BRANDS',
    label: 'Brands',
    actions: ['view', 'create', 'edit', 'delete'],
  },

  {
    key: 'INVENTORY',
    label: 'Inventory',
    actions: ['view', 'create', 'edit', 'delete'],
  },
  {
    key: 'MOVEMENTS',
    label: 'Movements',
    actions: ['view', 'create'],
  },

  {
    key: 'SUPPLIERS',
    label: 'Suppliers',
    actions: ['view', 'create', 'edit', 'delete'],
  },
  {
    key: 'CUSTOMERS',
    label: 'Customers',
    actions: ['view', 'create', 'edit', 'delete'],
  },
  {
    key: 'PURCHASES',
    label: 'Purchases',
    actions: ['view', 'create', 'edit', 'delete'],
  },
  {
    key: 'POS',
    label: 'POS',
    actions: ['view', 'create'],
  },
  {
    key: 'SALES_HISTORY',
    label: 'Sales History',
    actions: ['view', 'edit', 'delete'],
  },
  {
    key: 'RETURNS',
    label: 'Returns',
    actions: ['view', 'create', 'edit', 'delete'],
  },

  {
    key: 'PAYMENTS',
    label: 'Payments',
    actions: ['view', 'create', 'edit', 'delete'],
  },
  {
    key: 'ANALYTICS',
    label: 'Analytics',
    actions: ['view'],
  },
  {
    key: 'NOTIFICATIONS',
    label: 'Notifications',
    actions: ['view'],
  },
  {
    key: 'MEMBER_ROLES',
    label: 'Users & Roles',
    actions: ['view', 'create', 'edit', 'delete'],
  },
  {
    key: 'SETTINGS',
    label: 'Settings',
    actions: ['view', 'edit', 'delete'],
  },
] as const;
