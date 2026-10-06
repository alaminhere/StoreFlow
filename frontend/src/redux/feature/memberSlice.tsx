import { baseApi } from './baseApi';

import { storeMembers } from '@/mocks/store';

import {
  CreateStoreMember,
  StoreMember,
  UpdateStoreMember,
} from '@/types/store.types';

type StoreMemberResponse = {
  message: string;
  success: boolean;
  data: StoreMember[];
};

type Response = {
  message: string;
  success: boolean;
};

type DeleteStoreMember = {
  ids: string[];
};

export const memberApi = baseApi.injectEndpoints({
  endpoints: build => ({
    /*-----------------------------------------*
     * fetch all store members
     *-----------------------------------------*/
    allStoreMember: build.query<StoreMemberResponse, void>({

      // query: params => {
      //   const query = new URLSearchParams();
      //
      //   if (params?.search) {
      //     query.set('search', params.search);
      //   }
      //
      //   if (params?.page) {
      //     query.set('page', params.page);
      //   }
      //
      //   return {
      //     url: `/member?${query.toString()}`,
      //     method: 'GET',
      //   };
      // },
      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: storeMembers,
        },
      }),

      providesTags: ['member'],
    }),

    /*-----------------------------------------*
     * create a new store member
     *-----------------------------------------*/
    createStoreMember: build.mutation<Response, CreateStoreMember>({
      query: data => ({
        url: '/member',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['member'],
    }),


    /*-----------------------------------------*
     * update member
     *-----------------------------------------*/
    updateStoreMember: build.mutation<Response, UpdateStoreMember>({
      query: ({ id, role }) => ({
        url: `/member/${id}`,
        method: 'PATCH',
        body: role,
      }),

      invalidatesTags: ['member'],
    }),

    /*-----------------------------------------*
     * delete one or multiple store members
     *-----------------------------------------*/
    deleteStoreMember: build.mutation<Response, DeleteStoreMember>({
      query: ids => ({
        url: '/store/member',
        method: 'DELETE',
        body: ids,
      }),

      invalidatesTags: ['member'],
    }),
  }),
});

export const {
  useAllStoreMemberQuery,
  useCreateStoreMemberMutation,
  useUpdateStoreMemberMutation,
  useDeleteStoreMemberMutation,
} = memberApi;
