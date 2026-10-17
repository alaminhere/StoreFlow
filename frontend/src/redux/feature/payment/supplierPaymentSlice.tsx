import { baseApi } from '../baseApi';
import {
  PurchasePayment,
  ReceivedPurchasePayment,
} from '@/types/payment.types';

type supplierPaymentsApiRes = {
  message: string;
  success: boolean;
  data: { payments: PurchasePayment[]; totalPage: number };
};
type singleSupplierPaymentsApiRes = {
  message: string;
  success: boolean;
  data: PurchasePayment[];
};

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
      query: params => {
        const query = new URLSearchParams();
        if (params?.page) {
          query.set('page', params.page.toString());
        }
        return {
          url: `/payment/supplier?${query.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['payment_purchase'],
    }),

    /*-----------------------------------------*
     * fetch all payments made to a supplier
     *-----------------------------------------*/
    singleSupplierPayments: build.query<singleSupplierPaymentsApiRes, string>({
      query: supplierId => ({
        url: `/payment/supplier/${supplierId}`,
        method: 'GET',
      }),
      providesTags: ['payment_purchase'],
    }),

    /*-----------------------------------------*
     * fetch all payments made to a purchase
     *-----------------------------------------*/
    singlePurchasePayments: build.query<singleSupplierPaymentsApiRes, string>({
      query: purchaseId => ({
        url: `/payment/purchase/${purchaseId}`,
        method: 'GET',
      }),
      providesTags: ['payment_purchase'],
    }),

    /*-----------------------------------------*
     *  received payment
     *-----------------------------------------*/
    purchaseReceivedPayment: build.mutation<Response, ReceivedPurchasePayment>({
      query: data => ({
        url: `/payment/purchase/receive`,
        method: 'POST',
        body: data,
      }),

      invalidatesTags: [
        'payment_purchase',
        'purchase',
        'dashboard',
        'analytics',
        'supplier',
      ],
    }),
  }),
});

export const {
  useSupplierPaymentsQuery,
  useSingleSupplierPaymentsQuery,
  useSinglePurchasePaymentsQuery,
  usePurchaseReceivedPaymentMutation,
} = supplierPaymentApi;
