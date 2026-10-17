import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  }),
  tagTypes: [
    'user',
    'store',
    'member',
    'permission',
    'brand',
    'category',
    'customer',
    'supplier',
    'product',
    'productSupplier',
    'sale',
    'purchase',
    'payment_sale',
    'payment_purchase',
    'stockMovement',
    'return',
    'inventory',
    'invoice',
    'dashboard',
    'analytics',
  ],
  endpoints: () => ({}),
});
