
import { allReturn } from '@/mocks/return';
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
    return: Return[];
    totalPage: number;
  };
};

export const returnApi = baseApi.injectEndpoints({
  endpoints: build => ({
    createReturn: build.mutation<CreateResponse, CreateReturnRequest>({
      // query: body => ({
      //   url: '/return',
      //   method: 'POST',
      //   body,
      // }),
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: allReturn[1],
        },
      }),
    }),

    allReturn: build.query<
      Response,
      { search: string; party: string; page: number }
    >({
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
      //   if (params?.party) {
      //     query.set('party', params.party.toString());
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
            return: allReturn,
            totalPage: 4,
          },
        },
      }),

      providesTags: ['purchase'],
    }),
  }),
});

export const { useCreateReturnMutation, useAllReturnQuery } = returnApi;
