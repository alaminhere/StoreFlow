import { baseApi } from '../baseApi';
import { user, users } from '@/mocks/user';
import { UpdatePassword } from '@/types/user/auth.types';
import { UpdateUser, User } from '@/types/user/user.types';

type ApiResponse = {
  success: boolean;
  message: string;
  data?: User;
};

export const userApi = baseApi.injectEndpoints({
  endpoints: build => ({

    getMe: build.query<ApiResponse, void>({
      // API: Fetch the currently authenticated user
      // query: () => ({
      //   url: '/user/me',
      //   method: 'GET',
      // }),

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: user,
        },
      }),

      providesTags: ['user'],
    }),

    getUserByEmail: build.query<ApiResponse, string>({
      // API: Fetch a user by email
      // query: email => ({
      //   url: `/user/${email}`,
      //   method: 'GET',
      // }),

      // Mock: Keep for frontend development
      queryFn: async email => {
        const userByEmail = users.find(item => item.email === email);

        return {
          data: {
            message: '',
            success: true,
            data: userByEmail,
          },
        };
      },
    }),

    updateUserProfile: build.mutation<ApiResponse, UpdateUser>({
      query: data => ({
        url: '/user/me/profile',
        method: 'PATCH',
        body: data,
      }),

      invalidatesTags: ['user'],
    }),

    updateUserPassword: build.mutation<ApiResponse, UpdatePassword>({
      query: data => ({
        url: '/user/password',
        method: 'PATCH',
        body: data,
      }),

      invalidatesTags: ['user'],
    }),

    deleteUser: build.mutation<ApiResponse, { password: string }>({
      query: data => ({
        url: '/user/me/delete',
        method: 'DELETE',
        body: data,
      }),

      invalidatesTags: ['user'],
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
