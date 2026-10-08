export const COOKIE_NAMES = {
  AUTH: 'auth_token',
  STORE: 'store_token',
  VERIFY: 'verify_token',
  FORGOT: 'forgot_password_token',
} as const;

export const VERIFICATION = {
  CODE_EXPIRES_SECONDS: 30 * 60,
  CODE_LENGTH: 6,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 8,
  MAX_LIMIT: 50,
} as const;

export const PASSWORD = {
  SALT_ROUNDS: 10,
} as const;

export const SOCKET_EVENTS = [
  'brand:updated',
  'category:updated',
  'customer:updated',
  'member:updated',
  'payment_purchase:updated',
  'payment_sale:updated',
  'permission:updated',
  'product:updated',
  'purchase:updated',
  'sale:updated',
  'store:updated',
  'supplier:updated',
  'inventory:updated',
  'invoice:updated',
  'user:updated',
  'stockMovement:updated',
  'return:updated',
] as const;

export type SocketEvent = (typeof SOCKET_EVENTS)[number];

export const ID_PREFIX = {
  USER: 'user',
  STORE: 'store',
  MEMBER: 'member',
  CATEGORY: 'cat',
  BRAND: 'brand',
  PRODUCT: 'prod',
  SUPPLIER: 'supp',
  CUSTOMER: 'cust',
  PURCHASE: 'pur',
  PURCHASE_ITEM: 'pur_item',
  PURCHASE_PAYMENT: 'pur_pay',
  SALE: 'sale',
  SALE_ITEM: 'sale_item',
  SALE_PAYMENT: 'sale_pay',
  STOCK_MOVEMENT: 'stock_mv',
  RETURN: 'return',
} as const;

export type IdPrefix = (typeof ID_PREFIX)[keyof typeof ID_PREFIX];

export const MOVEMENT_TYPES = {
  PURCHASE: 'PURCHASE',
  SALE: 'SALE',
  RETURN: 'RETURN',
  STOCK_IN: 'STOCK_IN',
  STOCK_OUT: 'STOCK_OUT',
  DAMAGE: 'DAMAGE',
} as const;
