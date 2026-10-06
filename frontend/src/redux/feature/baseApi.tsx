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
    'brand',
    'category',
    'customer',
    'member',
    'payment_purchase',
    'payment_sale',
    'permission',
    'product',
    'purchase',
    'sale',
    'store',
    'supplier',
    'inventory',
    'invoice',
    'user',
    'stockMovement',
    'return',
    'dashboard'
  ],
  endpoints: () => ({}),
});
