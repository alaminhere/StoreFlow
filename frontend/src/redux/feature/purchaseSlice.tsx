import { baseApi } from './baseApi';
import { CreatePurchase, Purchase } from '@/types/purchases.types';
import { ReturnSearchResponse } from '@/types/return.types';

type PurchaseListResponse = {
  message: string;
  success: boolean;
  data: {
    purchase: Purchase[];
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
      query: params => {
        const query = new URLSearchParams();
        if (params?.search) {
          query.set('search', params.search);
        }
        if (params?.page) {
          query.set('page', params.page.toString());
        }
        return {
          url: `/purchase?${query.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['purchase'],
    }),

    /*-----------------------------------------*
     * fetch single purchase for return
     *-----------------------------------------*/
    getPurchaseForReturn: build.query<ReturnApiResponse, string>({
      query: id => {
        return {
          url: `/purchase/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['purchase'],
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

      invalidatesTags: [
        'purchase',
        'productSupplier',
        'product',
        'stockMovement',
        'inventory',
        'dashboard',
        'analytics',
        'supplier',
        'payment_purchase',
      ],
    }),

    /*-----------------------------------------*
     * delete  purchase
     *-----------------------------------------*/
  }),
});

export const {
  useAllPurchaseQuery,
  useLazyGetPurchaseForReturnQuery,
  useCreatePurchaseMutation,
} = purchaseApi;
