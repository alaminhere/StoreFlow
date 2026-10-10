import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canViewModule } from './helpers/route-guard/route-access';
import { verifyStoreToken } from './helpers/route-guard/verify-token';

const AUTH_ROUTES = [
  '/signin',
  '/signup',
  '/verify',
  '/forgot-password',
  '/reset-password',
];

const USER_ROUTES = ['/profile', '/profile/stores', '/profile/settings'];

const STORE_ROUTE_MODULE: Record<string, string> = {
  '/dashboard': 'DASHBOARD',
  '/dashboard/products': 'PRODUCTS',
  '/dashboard/categories': 'CATEGORIES',
  '/dashboard/brands': 'BRANDS',
  '/dashboard/inventory': 'INVENTORY',
  '/dashboard/movements': 'MOVEMENTS',
  '/dashboard/suppliers': 'SUPPLIERS',
  '/dashboard/customers': 'CUSTOMERS',
  '/dashboard/purchases': 'PURCHASES',
  '/dashboard/pos': 'POS',
  '/dashboard/sales': 'SALES_HISTORY',
  '/dashboard/returns': 'RETURNS',
  '/dashboard/payments': 'PAYMENTS',
  '/dashboard/analytics': 'ANALYTICS',
  '/dashboard/notifications': 'NOTIFICATIONS',
  '/dashboard/roles': 'MEMBER_ROLES',
  '/dashboard/settings': 'SETTINGS',
};

const STORE_ROUTES = Object.keys(STORE_ROUTE_MODULE);

const matches = (pathname: string, routes: string[]) =>
  routes.some(r => pathname === r || pathname.startsWith(`${r}/`));

const getModule = (pathname: string): string | undefined => {
  const routes = Object.keys(STORE_ROUTE_MODULE).sort(
    (a, b) => b.length - a.length,
  );
  const match = routes.find(
    r => pathname === r || pathname.startsWith(`${r}/`),
  );
  return match ? STORE_ROUTE_MODULE[match] : undefined;
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const authToken = req.cookies.get('auth_token')?.value;
  const storeToken = req.cookies.get('store_token')?.value;

  const redirectTo = (path: string) =>
    NextResponse.redirect(new URL(path, req.url));

  if (matches(pathname, AUTH_ROUTES)) {
    if (authToken) return redirectTo('/profile');
    return NextResponse.next();
  }

  // store route
  if (matches(pathname, STORE_ROUTES)) {
    if (!authToken) return redirectTo('/signin');
    if (!storeToken) return redirectTo('/profile');

    const payload = await verifyStoreToken(storeToken);
    if (!payload?.role) return redirectTo('/profile');

    const permissionModule = getModule(pathname);
    if (permissionModule && !canViewModule(payload.role, permissionModule)) {
      return NextResponse.rewrite(new URL('/403', req.url));
    }
    return NextResponse.next();
  }

  if (matches(pathname, USER_ROUTES)) {
    if (!authToken) return redirectTo('/signin');
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|css|js)$).*)',
  ],
};
