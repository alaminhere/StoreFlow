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

    // Sign In
    signIn: build.mutation<ApiResponse, SignInFormType>({
      // query: data => ({
      //   url: '/auth/signin',
      //   method: 'POST',
      //   body: data,
      // }),
      // invalidatesTags: ['user'],
      queryFn: async () => ({
        data: {
          message: 'Successfully SignIn',
          success: true,
        },
      }),
    }),

    // Sign Up
    signUp: build.mutation<ApiResponse, SignUpFormType>({
      // query: data => ({
      //   url: '/auth/signup',
      //   method: 'POST',
      //   body: data,
      // }),
      queryFn: async () => ({
        data: {
          message: 'Successfully SignUp',
          success: true,
        },
      }),
    }),


    // Verify Sign Up
    verifySignUp: build.mutation<ApiResponse, { otp: string }>({
      // query: data => ({
      //   url: '/auth/verify-signup',
      //   method: 'POST',
      //   body: data,
      // }),
      // invalidatesTags: ['user'],
      queryFn: async () => ({
        data: {
          message: 'Successfully Verified',
          success: true,
        },
      }),
    }),


    // Forgot Password
    forgetPassword: build.mutation<ApiResponse, { email: string }>({
      // query: data => ({
      //   url: '/auth/forgot-password',
      //   method: 'POST',
      //   body: data,
      // }),
      queryFn: async () => ({
        data: {
          message: 'send code',
          success: true,
        },
      }),
    }),


    // Verify Forgot Password OTP
    verifyForgotPassword: build.mutation<ApiResponse, { otp: string }>({
      // query: data => ({
      //   url: '/auth/verify-forget-password',
      //   method: 'POST',
      //   body: data,
      // }),

      queryFn: async () => ({
        data: {
          message: 'verified ',
          success: true,
        },
      }),
    }),


    // Reset Password
    resetPassword: build.mutation<ApiResponse, ResetPasswordFormType>({
      // query: data => ({
      //   url: '/auth/reset-password',
      //   method: 'POST',
      //   body: data,
      // }),

      queryFn: async () => ({
        data: {
          message: 'Password Reset Successfully place login ',
          success: true,
        },
      }),
    }),


    // Sign Out
    signOut: build.mutation<ApiResponse, void>({
      // query: () => ({
      //   url: '/auth/signout',
      //   method: 'POST',
      // }),
      // invalidatesTags: ['user'],
      queryFn: async () => ({
        data: {
          message: 'Successfully SignOut',
          success: true,
        },
      }),
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
