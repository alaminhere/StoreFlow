export type Role = 'OWNER' | 'MANAGER' | 'ADMIN' | 'SALESMAN';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete';

export type PermissionModule =
  | 'DASHBOARD'
  | 'PRODUCTS'
  | 'CATEGORIES'
  | 'BRANDS'
  | 'INVENTORY'
  | 'MOVEMENTS'
  | 'SUPPLIERS'
  | 'CUSTOMERS'
  | 'PURCHASES'
  | 'POS'
  | 'SALES_HISTORY'
  | 'RETURNS'
  | 'PAYMENTS'
  | 'ANALYTICS'
  | 'NOTIFICATIONS'
  | 'USERS_ROLES'
  | 'SETTINGS';
export type ModulePermissions = Partial<Record<PermissionAction, boolean>>;

export type Permissions = Partial<Record<PermissionModule, ModulePermissions>>;

export interface PermissionResponse {
  role: Role;
  permissions: Permissions;
}
