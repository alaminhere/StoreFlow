import { baseApi } from './baseApi';

import { suppliers } from '@/mocks/suppliers';

import {
  CreateSupplier,
  Supplier,
  SupplierList,
  UpdateSupplier,
} from '@/types/supplier.types';

type SupplierResponse = {
  message: string;
  success: boolean;
  data: {
    suppliers: Supplier[];
    totalPage?: number;
  };
};

type SupplierListResponse = {
  success: boolean;
  data: SupplierList[];
};
type SupplierQueryParams = {
  page?: number;
  search?: string;
};

type Response = {
  message: string;
  success:boolean
};

type DeleteSuppliers = {
  ids: string[];
};

export const supplierApi = baseApi.injectEndpoints({
  endpoints: build => ({
    /*-----------------------------------------*
     * fetch all suppliers with pagination
     * and search
     *-----------------------------------------*/
    allSupplier: build.query<SupplierResponse, SupplierQueryParams>({
      // query: params => {
      //   const query = new URLSearchParams();
      //
      //   if (params?.search) {
      //     query.set('search', params.search);
      //   }
      //
      //   if (params?.page) {
      //   }
      //
      //   return {
      //     url: `/supplier?${query.toString()}`,
      //     method: 'GET',
      //   };
      // },

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: {
            suppliers,
            totalPage: 5,
          },
        },
      }),

      providesTags: ['supplier'],
    }),

    /*-----------------------------------------*
     * fetch all suppliers without pagination
     *-----------------------------------------*/
    supplierList: build.query<SupplierListResponse, void>({
      // query: () => ({
      //   url: '/supplier/list',
      //   method: 'GET',
      // }),

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: suppliers,
        },
      }),

      providesTags: ['supplier'],
    }),

    /*-----------------------------------------*
     * create suppliers
     *-----------------------------------------*/
    createSupplier: build.mutation<Response, CreateSupplier>({
      query: data => ({
        url: '/supplier',
        method: 'POST',
        body: data,
      }),

      invalidatesTags: ['supplier'],
    }),

    /*-----------------------------------------*
     * update suppliers
     *-----------------------------------------*/
    updateSupplier: build.mutation<Response, UpdateSupplier>({
      query: ({ id, ...data }) => ({
        url: `/supplier/${id}`,
        method: 'PATCH',
        body: data,
      }),

      invalidatesTags: ['supplier'],
    }),

    /*-----------------------------------------*
     * delete suppliers
     *-----------------------------------------*/
    deleteSuppliers: build.mutation<Response, DeleteSuppliers>({
      query: data => ({
        url: '/supplier',
        method: 'DELETE',
        body: data,
      }),

      invalidatesTags: ['supplier'],
    }),
  }),
});

export const {
  useAllSupplierQuery,
  useCreateSupplierMutation,
  useSupplierListQuery,
  useUpdateSupplierMutation,
  useDeleteSuppliersMutation,
} = supplierApi;
