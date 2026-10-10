import { baseApi } from '../baseApi';
import { UpdatePassword } from '@/types/user/auth.types';
import { UpdateUser, User } from '@/types/user/user.types';

type ApiResponse = {
  success: boolean;
  message: string;
  data?: User;
};

export const userApi = baseApi.injectEndpoints({
  endpoints: build => ({
    /*----------------------------------------*
     *  fetch the currently authenticated user
     *----------------------------------------*/
    getMe: build.query<ApiResponse, void>({
      query: () => ({
        url: '/user/me',
        method: 'GET',
      }),
      providesTags: ['user'],
    }),

    /*----------------------------------------*
     *        fetch a user by email
     *----------------------------------------*/
    getUserByEmail: build.query<ApiResponse, { email: string }>({
      query: ({ email }) => ({
        url: `/user/email?email=${email}`,
        method: 'GET',
      }),
    }),

    /*----------------------------------------*
     *       update profile
     *----------------------------------------*/
    updateUserProfile: build.mutation<ApiResponse, UpdateUser>({
      query: data => ({
        url: '/user/me/profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['user'],
    }),

    /*----------------------------------------*
     *        update password
     *----------------------------------------*/
    updateUserPassword: build.mutation<ApiResponse, UpdatePassword>({
      query: data => ({
        url: '/user/me/password',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['user'],
    }),

    /*----------------------------------------*
     *        delete may account
     *----------------------------------------*/
    deleteUser: build.mutation<ApiResponse, { password: string }>({
      query: data => ({
        url: '/user/me/delete',
        method: 'DELETE',
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.resetApiState());
        } catch {}
      },
    }),
  }),
});

export const {
  useGetMeQuery,
  useLazyGetUserByEmailQuery,
  useUpdateUserProfileMutation,
  useUpdateUserPasswordMutation,
  useDeleteUserMutation,
} = userApi;
