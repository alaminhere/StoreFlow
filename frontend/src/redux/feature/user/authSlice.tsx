import {
  ResetPasswordFormType,
  SignInFormType,
  SignUpFormType,
} from '@/types/user/auth.types';
import { baseApi } from '../baseApi';
import { User } from '@/types/user/user.types';

type ApiResponse = {
  success: boolean;
  message: string;
  data?: User;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    /*-------------------------------*
     *        Sign In
     *-------------------------------*/
    signIn: build.mutation<ApiResponse, SignInFormType>({
      query: data => ({
        url: '/auth/signin',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['user'],
    }),

    /*-------------------------------*
     *        Sign up
     *-------------------------------*/
    signUp: build.mutation<ApiResponse, SignUpFormType>({
      query: data => ({
        url: '/auth/signup',
        method: 'POST',
        body: data,
      }),
    }),

    /*-------------------------------*
     *        verify Sign Up
     *-------------------------------*/
    verifySignUp: build.mutation<ApiResponse, { otp: string }>({
      query: data => ({
        url: '/auth/verify-signup',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['user'],
    }),

    /*-------------------------------*
     *        forgot Password
     *-------------------------------*/
    forgetPassword: build.mutation<ApiResponse, { email: string }>({
      query: data => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    /*-------------------------------*
     *   verify Forgot Password OTP
     *-------------------------------*/
    verifyForgotPassword: build.mutation<ApiResponse, { otp: string }>({
      query: data => ({
        url: '/auth/verify-forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    /*-------------------------------*
     *          reset Password
     *-------------------------------*/
    resetPassword: build.mutation<ApiResponse, ResetPasswordFormType>({
      query: data => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    /*-------------------------------*
     *        sign Out
     *-------------------------------*/
    signOut: build.mutation<ApiResponse, void>({
      query: () => ({
        url: '/auth/signout',
        method: 'POST',
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
  useSignInMutation,
  useSignUpMutation,
  useVerifySignUpMutation,
  useForgetPasswordMutation,
  useVerifyForgotPasswordMutation,
  useResetPasswordMutation,
  useSignOutMutation,
} = authApi;
