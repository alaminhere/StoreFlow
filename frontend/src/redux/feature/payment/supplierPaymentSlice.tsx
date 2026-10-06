import { purchasesPayments } from '@/mocks/purchases';
import { baseApi } from '../baseApi';

import {
  PurchasePayment,
  ReceivedPurchasePayment,
} from '@/types/payment.types';

type supplierPaymentsApiRes = {
  message: string;
  success: boolean;
  data: { supplierPayments: PurchasePayment[], totalPage: number };
};
type singleSupplierPaymentsApiRes = {
  message: string;
  success: boolean;
  data: PurchasePayment[];
};

;

type Response = {
  message: string;
  success: boolean;
};

export const supplierPaymentApi = baseApi.injectEndpoints({
  endpoints: build => ({

    /*-----------------------------------------*
     * fetch all supplier payments
     *-----------------------------------------*/
    supplierPayments: build.query<supplierPaymentsApiRes, { page: number }>({

      // query: params => {
      //   const query = new URLSearchParams();
      //
      //
      //   if (params?.page) {
      //     query.set('page', params.page.toString());
      //   }
      //
      //   return {
      //      url: `/payment/supplier`,
      //     method: 'GET',
      //   };
      // },


      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: {
            supplierPayments: purchasesPayments,
            totalPage: 5
          }
        },
      }),

      providesTags: ['payment_purchase'],
    }),

    /*-----------------------------------------*
     * fetch all payments made to a supplier
     *-----------------------------------------*/
    singleSupplierPayments: build.query<singleSupplierPaymentsApiRes, string>({
      // query: supplierId => ({
      //   url: `/payment/supplier/${supplierId}`,
      //   method: 'GET',
      // }),

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: purchasesPayments,
        },
      }),

      providesTags: ['payment_purchase'],
    }),

    /*-----------------------------------------*
     * fetch all payments made to a purchase
     *-----------------------------------------*/
    singlePurchasePayments: build.query<singleSupplierPaymentsApiRes, string>({
      // query: purchaseId => ({
      //   url: `/payment/purchase/${purchaseId}`,
      //   method: 'GET',
      // }),

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: purchasesPayments,
        },
      }),

      providesTags: ['payment_purchase'],
    }),

    /*-----------------------------------------*
     *  received payment
     *-----------------------------------------*/
    purchaseReceivedPayment: build.mutation<Response, ReceivedPurchasePayment>({
      query: (data) => ({
        url: `/payment/purchase`,
        method: 'PATCH',
        body: data,
      }),

      invalidatesTags: ['payment_purchase', 'purchase', 'supplier'],
    }),

  }),
});

export const {
  useSupplierPaymentsQuery,
  useSingleSupplierPaymentsQuery,
  useSinglePurchasePaymentsQuery,
  usePurchaseReceivedPaymentMutation,
} = supplierPaymentApi;
