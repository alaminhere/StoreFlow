import type { PermissionResponse } from '../types/permission.types.js';

export const permissions: PermissionResponse[] = [
  {
    role: 'OWNER',
    permissions: {
      DASHBOARD: { view: true },

      PRODUCTS: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },

      CATEGORIES: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },

      BRANDS: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },

      INVENTORY: { view: true },

      MOVEMENTS: { view: true },

      SUPPLIERS: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },

      CUSTOMERS: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },

      PURCHASES: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },

      POS: {
        view: true,
        create: true,
      },

      SALES_HISTORY: { view: true },

      RETURNS: {
        view: true,
        create: true,
        edit: true,
      },

      PAYMENTS: {
        view: true,
        create: true,
      },

      ANALYTICS: { view: true },

      NOTIFICATIONS: { view: true },

      USERS_ROLES: {
        view: true,
        create: true,
        edit: true,
      },

      SETTINGS: { view: true, edit: true, delete: true },
    },
  },

  {
    role: 'MANAGER',
    permissions: {
      DASHBOARD: { view: true },

      PRODUCTS: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },

      CATEGORIES: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },

      BRANDS: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },

      INVENTORY: { view: true },

      MOVEMENTS: { view: true },

      SUPPLIERS: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },

      CUSTOMERS: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },

      PURCHASES: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },

      POS: {
        view: true,
        create: true,
      },

      SALES_HISTORY: { view: true },

      RETURNS: {
        view: true,
        create: true,
        edit: true,
      },

      PAYMENTS: {
        view: true,
        create: true,
      },

      ANALYTICS: { view: true },

      NOTIFICATIONS: { view: true },

      USERS_ROLES: {
        view: true,
        create: false,
        edit: false,
      },

      SETTINGS: { view: true, edit: true, delete: true },
    },
  },

  {
    role: 'ADMIN',
    permissions: {
      DASHBOARD: { view: true },

      PRODUCTS: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },

      CATEGORIES: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },

      BRANDS: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },

      INVENTORY: { view: true },

      MOVEMENTS: { view: true },

      SUPPLIERS: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },

      CUSTOMERS: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },

      PURCHASES: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },

      POS: {
        view: true,
        create: true,
      },

      SALES_HISTORY: { view: true },

      RETURNS: {
        view: true,
        create: true,
        edit: true,
      },

      PAYMENTS: {
        view: true,
        create: true,
      },

      ANALYTICS: { view: true },

      NOTIFICATIONS: { view: true },

      USERS_ROLES: {
        view: true,
        create: true,
        edit: true,
      },

      SETTINGS: { view: true },
    },
  },

  {
    role: 'SALESMAN',
    permissions: {
      DASHBOARD: { view: true },

      PRODUCTS: {
        view: true,
        create: false,
        edit: false,
        delete: false,
      },

      CATEGORIES: {
        view: true,
        create: false,
        edit: false,
        delete: false,
      },

      BRANDS: {
        view: true,
        create: false,
        edit: false,
        delete: false,
      },

      INVENTORY: { view: true },

      MOVEMENTS: { view: true },

      SUPPLIERS: {
        view: true,
        create: false,
        edit: false,
        delete: false,
      },

      CUSTOMERS: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },

      PURCHASES: {
        view: false,
        create: false,
        edit: false,
        delete: false,
      },

      POS: {
        view: true,
        create: true,
      },

      SALES_HISTORY: { view: true },

      RETURNS: {
        view: true,
        create: true,
        edit: false,
      },

      PAYMENTS: {
        view: false,
        create: false,
      },

      ANALYTICS: { view: false },

      NOTIFICATIONS: { view: true },

      USERS_ROLES: {
        view: false,
        create: false,
        edit: false,
      },

      SETTINGS: { view: false },
    },
  },
];
