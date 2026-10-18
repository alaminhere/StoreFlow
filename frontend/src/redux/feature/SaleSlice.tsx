import { baseApi } from './baseApi';
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
      query: params => {
        const query = new URLSearchParams();
        if (params?.search) {
          query.set('search', params.search);
        }
        if (params?.page) {
          query.set('page', params.page.toString());
        }
        return {
          url: `/sale?${query.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['sale'],
    }),
    /*-----------------------------------------*
     * fetch single sales for return
     *-----------------------------------------*/
    getSaleForReturn: build.query<ReturnApiResponse, string>({
      query: id => {
        return {
          url: `/sale/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['sale'],
    }),

    /*-----------------------------------------*
     * create sale
     *-----------------------------------------*/
    createSale: build.mutation<CreateSaleApiResponse, CreateSales>({
      query: data => ({
        url: '/sale',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        'sale',
        'product',
        'stockMovement',
        'inventory',
        'dashboard',
        'analytics',
        'customer',
        'payment_sale'
      ],
    }),
  }),
});

export const {
  useAllSaleQuery,
  useLazyGetSaleForReturnQuery,
  useCreateSaleMutation,
} = saleApi;
