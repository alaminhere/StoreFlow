import {
  PermissionAction,
  PermissionModule,
  PermissionResponse,
  Role,
} from '@/types/permission.types';

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

export const permissions: PermissionResponse[] = [
  {
    role: 'OWNER',
    permissions: {
      DASHBOARD: { view: true },
      PRODUCTS: { view: true, create: true, edit: true, delete: true },
      CATEGORIES: { view: true, create: true, edit: true, delete: true },
      BRANDS: { view: true, create: true, edit: true, delete: true },
      INVENTORY: { view: true, create: true, edit: true, delete: true },
      MOVEMENTS: { view: true, create: true },
      SUPPLIERS: { view: true, create: true, edit: true, delete: true },
      CUSTOMERS: { view: true, create: true, edit: true, delete: true },
      PURCHASES: { view: true, create: true, edit: true, delete: true },
      POS: { view: true, create: true },
      SALES_HISTORY: { view: true, edit: true, delete: true },
      RETURNS: { view: true, create: true, edit: true, delete: true },
      PAYMENTS: { view: true, create: true, edit: true, delete: true },
      ANALYTICS: { view: true },
      NOTIFICATIONS: { view: true },
      MEMBER_ROLES: { view: true, create: true, edit: true, delete: true },
      SETTINGS: { view: true, edit: true, delete: true },
    },
  },

  {
    role: 'ADMIN',
    permissions: {
      DASHBOARD: { view: true },
      PRODUCTS: { view: true, create: true, edit: true, delete: true },
      CATEGORIES: { view: true, create: true, edit: true, delete: true },
      BRANDS: { view: true, create: true, edit: true, delete: true },
      INVENTORY: { view: true, create: true, edit: true, delete: true },
      MOVEMENTS: { view: true, create: true },
      SUPPLIERS: { view: true, create: true, edit: true, delete: true },
      CUSTOMERS: { view: true, create: true, edit: true, delete: true },
      PURCHASES: { view: true, create: true, edit: true, delete: true },
      POS: { view: true, create: true },
      SALES_HISTORY: { view: true, edit: true },
      RETURNS: { view: true, create: true, edit: true },
      PAYMENTS: { view: true, create: true, edit: true },
      ANALYTICS: { view: true },
      NOTIFICATIONS: { view: true },
      MEMBER_ROLES: { view: true, create: true, edit: true },
      SETTINGS: { view: true, edit: true },
    },
  },

  {
    role: 'MANAGER',
    permissions: {
      DASHBOARD: { view: true },
      PRODUCTS: { view: true, create: true, edit: true },
      CATEGORIES: { view: true, create: true, edit: true },
      BRANDS: { view: true, create: true, edit: true },
      INVENTORY: { view: true, create: true, edit: true },
      MOVEMENTS: { view: true, create: true },
      SUPPLIERS: { view: true, create: true, edit: true },
      CUSTOMERS: { view: true, create: true, edit: true },
      PURCHASES: { view: true, create: true, edit: true },
      POS: { view: true, create: true },
      SALES_HISTORY: { view: true, edit: true },
      RETURNS: { view: true, create: true, edit: true },
      PAYMENTS: { view: true, create: true },
      ANALYTICS: { view: true },
      NOTIFICATIONS: { view: true },
      MEMBER_ROLES: { view: true },
      SETTINGS: { view: true },
    },
  },

  {
    role: 'SALESMAN',
    permissions: {
      DASHBOARD: { view: true },
      PRODUCTS: { view: true },
      CATEGORIES: { view: true },
      BRANDS: { view: true },
      INVENTORY: { view: true },
      MOVEMENTS: { view: true },
      SUPPLIERS: { view: true },
      CUSTOMERS: { view: true, create: true },
      PURCHASES: {},
      POS: { view: true, create: true },
      SALES_HISTORY: { view: true },
      RETURNS: {},
      PAYMENTS: { create: true },
      ANALYTICS: {},
      NOTIFICATIONS: {},
      MEMBER_ROLES: {},
      SETTINGS: {},
    },
  },
];

/*-----------------------------------------*
 *  get permissions for a specific role.
 *  frontend use only UI/routing decisions.
 *  Backend authorization is separate and
 *  is the actual source of truth.
 *-----------------------------------------*/
export const getPermissionsByRole = (role: Role): PermissionResponse => {
  return (
    permissions.find(p => p.role === role) ?? {
      role,
      permissions: {},
    }
  );
};
