import { baseApi } from './baseApi';

import { store } from '@/mocks/store';

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
      // query: () => ({
      //   url: '/store',
      //   method: 'GET',
      // }),

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: store,
        },
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
    }),


    /*-----------------------------------------*
     * open store
     *-----------------------------------------*/
    openStore: build.mutation<ApiResponse, { storeId: string }>({
      // query: data => ({
      //   url: '/store/open',
      //   method: 'POST',
      //   body: data,
      // }),

      // invalidatesTags: ['store'],,
      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: 'Successfully Open store',
          success: true,
        },
      }),
    }),

    /*-----------------------------------------*
     * close  store
     *-----------------------------------------*/
    closeStore: build.mutation<ApiResponse, void>({
      // query: () => ({
      //   url: '/store/closed',
      //   method: 'POST',
      // }),

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: 'Successfully LeaveStore',
          success: true,
        },
      }),
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
