import type { Permissions, Role } from './permission.types.ts';

declare global {
  namespace Express {
    interface Locals {
      userId: string;
      storeId?: string;
      role?: Role;
      permissions?: Permissions;
    }
  }
}

export {};
