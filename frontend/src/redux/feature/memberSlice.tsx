import { baseApi } from './baseApi';
import {
  CreateStoreMember,
  StoreMember,
  UpdateStoreMember,
} from '@/types/store.types';

type StoreMemberResponse = {
  message: string;
  success: boolean;
  data: {
    members: StoreMember[];
    totalPage: number;
  };
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
    allStoreMember: build.query<
      StoreMemberResponse,
      { search?: string; page?: number }
    >({
      query: params => {
        const query = new URLSearchParams();
        if (params?.search) {
          query.set('search', params.search.toString());
        }
        if (params?.page) {
          query.set('page', params.page.toString());
        }
        return {
          url: `/member?${query.toString()}`,
          method: 'GET',
        };
      },
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
      invalidatesTags: ['member', 'permission'],
    }),

    /*-----------------------------------------*
     * update member
     *-----------------------------------------*/
    updateStoreMember: build.mutation<Response, UpdateStoreMember>({
      query: ({ id, role }) => ({
        url: `/member/${id}`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['member', 'permission'],
    }),

    /*-----------------------------------------*
     * delete one or multiple store members
     *-----------------------------------------*/
    deleteStoreMember: build.mutation<Response, DeleteStoreMember>({
      query: ids => ({
        url: '/member',
        method: 'DELETE',
        body: ids,
      }),
      invalidatesTags: ['member', 'permission'],
    }),
  }),
});

export const {
  useAllStoreMemberQuery,
  useCreateStoreMemberMutation,
  useUpdateStoreMemberMutation,
  useDeleteStoreMemberMutation,
} = memberApi;
