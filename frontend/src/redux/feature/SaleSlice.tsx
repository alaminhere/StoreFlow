import { SearchSaleReturn } from '@/mocks/return';
import { baseApi } from './baseApi';

import { SALES } from '@/mocks/sale';

import { CreateSales, Sales } from '@/types/sales.type';
import { ReturnSearchResponse } from '@/types/return.types';

type ApiResponse = {
  message: string;
  success: boolean;
  data: {
    sales: Sales[];
    totalPage?: number;
  };
};

type CreateSaleApiResponse = {
  message: string;
  success: boolean;
  data: Sales;
};
type ReturnApiResponse = {
  message: string;
  success: boolean;
  data: ReturnSearchResponse;
};

export const saleApi = baseApi.injectEndpoints({
  endpoints: build => ({
    /*-----------------------------------------*
     * fetch all sales with pagination and search
     *-----------------------------------------*/
    allSale: build.query<ApiResponse, { page?: number; search?: string }>({
      // query: params => {
      //   const query = new URLSearchParams();
      //
      //   if (params?.search) {
      //     query.set('search', params.search);
      //   }
      //
      //   if (params?.page) {
      //     query.set('page', params.page.toString());
      //   }
      //
      //   return {
      //     url: `/sale?${query.toString()}`,
      //     method: 'GET',
      //   };
      // },

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: {
            sales: SALES,
            totalPage: 4,
          },
        },
      }),
      providesTags: ['sale', 'stockMovement'],
    }),
    /*-----------------------------------------*
     * fetch single sales for return
     *-----------------------------------------*/
    getSaleForReturn: build.query<ReturnApiResponse, string>({
      // query: params => {
      //   return {
      //     url: `/sale/${id}`,
      //     method: 'GET',
      //   };
      // },

      // Mock: Keep for frontend development
      queryFn: async (id) => {
        const result = SearchSaleReturn.find((item) => item.id === id);

        if (!result) {
          return {
            error: {
              status: 404,
              data: {
                message: 'Return not found',
              },
            },
          };
        }

        return {
          data: {
            message: 'Return found successfully',
            success: true,
            data: result,
          },
        };
      },
    }),

    /*-----------------------------------------*
     * create sale
     *-----------------------------------------*/
    createSale: build.mutation<CreateSaleApiResponse, CreateSales>({
      // query: data => ({
      //   url: '/sale',
      //   method: 'POST',
      //   body: data,
      // }),

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: SALES[1],
        },
      }),

      invalidatesTags: ['sale'],
    }),
  }),
});

export const { useAllSaleQuery, useLazyGetSaleForReturnQuery,useCreateSaleMutation } = saleApi;
