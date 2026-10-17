//import { store } from '@/mocks/store';

import { baseApi } from './baseApi';
import { CreateStore, Store, UpdateStore } from '@/types/store.types';

type ApiResponse = {
  message: string;
  success: boolean;
  data?: Store;
};

export const storeApi = baseApi.injectEndpoints({
  endpoints: build => ({
    /*-----------------------------------------*
     * fetch current store
     *-----------------------------------------*/
    getStore: build.query<ApiResponse, void>({
      query: () => ({
        url: '/store',
        method: 'GET',
      }),
      providesTags: ['store'],
    }),

    /*-----------------------------------------*
     * create store
     *-----------------------------------------*/
    createStore: build.mutation<ApiResponse, CreateStore>({
      query: data => ({
        url: '/store',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['store', 'member', 'permission', 'user'],
    }),

    /*-----------------------------------------*
     * update store
     *-----------------------------------------*/
    updateStore: build.mutation<ApiResponse, UpdateStore>({
      query: data => ({
        url: '/store',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['store'],
    }),

    /*-----------------------------------------*
     * delete store
     *-----------------------------------------*/
    deleteStore: build.mutation<ApiResponse, { email: string }>({
      query: data => ({
        url: '/store',
        method: 'DELETE',
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.resetApiState());
        } catch {}
      },
    }),

    /*-----------------------------------------*
     * open store
     *-----------------------------------------*/
    openStore: build.mutation<ApiResponse, { storeId: string }>({
      query: data => ({
        url: '/store/open',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.resetApiState());
        } catch {}
      },
    }),

    /*-----------------------------------------*
     * close  store
     *-----------------------------------------*/
    closeStore: build.mutation<ApiResponse, void>({
      query: () => ({
        url: '/store/closed',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.resetApiState());
        } catch {}
      },
    }),
  }),
});

export const {
  useGetStoreQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
  useOpenStoreMutation,
  useCloseStoreMutation,
} = storeApi;
