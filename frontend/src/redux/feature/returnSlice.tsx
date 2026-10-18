import { baseApi } from './baseApi';
import { CreateReturnRequest, Return } from '@/types/return.types';

type CreateResponse = {
  success: boolean;
  message: string;
  data: Return;
};
type Response = {
  success: boolean;
  message: string;
  data: {
    returns: Return[];
    totalPage: number;
  };
};

export const returnApi = baseApi.injectEndpoints({
  endpoints: build => ({
    /*------------------------------------ *
     *        create return
     *-------------------------------------*/
    createReturn: build.mutation<CreateResponse, CreateReturnRequest>({
      query: body => ({ url: '/return', method: 'POST', body }),
      invalidatesTags: (result, error, arg) => [
        'return',
        'product',
        'stockMovement',
        'inventory',
        'customer',
        'supplier',
        'dashboard',
        'analytics',
        ...(arg?.type === 'SALE_RETURN'
          ? (['sale', 'payment_sale'] as const)
          : (['purchase', 'payment_purchase'] as const)),
      ],
    }),

    /*----------------------------------------*
     *        fetch all return
     *----------------------------------------*/
    allReturn: build.query<
      Response,
      { search: string; party: string; page: number }
    >({
      query: params => {
        const query = new URLSearchParams();
        if (params?.search) {
          query.set('search', params.search);
        }
        if (params?.page) {
          query.set('page', params.page.toString());
        }
        if (params?.party) {
          query.set('party', params.party.toString());
        }
        return {
          url: `/return?${query.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['return'],
    }),
  }),
});

export const { useCreateReturnMutation, useAllReturnQuery } = returnApi;
