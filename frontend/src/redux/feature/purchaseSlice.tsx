import { baseApi } from './baseApi';

import { purchases } from '@/mocks/purchases';
import { SearchPhasesReturn,   } from '@/mocks/return';

import { CreatePurchase, Purchase } from '@/types/purchases.types';
import { ReturnSearchResponse } from '@/types/return.types';

type PurchaseListResponse = {
  message: string;
  success: boolean;
  data: {
    purchases: Purchase[];
    totalPage?: number;
  };
};

type PurchaseMutationResponse = {
  message: string;
  success: boolean;
};

type PurchaseQueryParams = {
  page?: number;
  search?: string;
};
type ReturnApiResponse = {
  message: string;
  success: boolean;
  data: ReturnSearchResponse;
};
export const purchaseApi = baseApi.injectEndpoints({
  endpoints: build => ({
    /*-----------------------------------------*
     * fetch all purchases with pagination
     *-----------------------------------------*/
    allPurchase: build.query<PurchaseListResponse, PurchaseQueryParams>({
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
      //     url: `/purchase?${query.toString()}`,
      //     method: 'GET',
      //   };
      // },

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: {
            purchases,
            totalPage: 4,
          },
        },
      }),

      providesTags: ['purchase'],
    }),

    /*-----------------------------------------*
     * fetch single purchase for return
     *-----------------------------------------*/
    getPurchaseForReturn: build.query<ReturnApiResponse, string>({
      // query: params => {
      //   return {
      //     url: `/purchase/${id}`,
      //     method: 'GET',
      //   };
      // },

      // Mock: Keep for frontend development
      queryFn: async (id) => {
        const result = SearchPhasesReturn.find(
          (item) => item.id === id,
        );

        if (!result) {
          return {
            error: {
              status: 404,
              data: { message: 'Return not found' },
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
     * create  purchase
     *-----------------------------------------*/
    createPurchase: build.mutation<PurchaseMutationResponse, CreatePurchase>({
      query: data => ({
        url: '/purchase',
        method: 'POST',
        body: data,
      }),

      invalidatesTags: ['purchase', 'supplier', 'inventory'],
    }),

    /*-----------------------------------------*
     * delete  purchase
     *-----------------------------------------*/
  }),
});

export const { useAllPurchaseQuery, useLazyGetPurchaseForReturnQuery,useCreatePurchaseMutation } = purchaseApi;
