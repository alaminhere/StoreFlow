import { baseApi } from '../baseApi';
import { ReceivedSalePayment, SalePayment } from '@/types/payment.types';

type customerPaymentsApiRes = {
  message: string;
  success: boolean;
  data: { payments: SalePayment[]; totalPage: number };
};
type singleCustomerPaymentsApiRes = {
  message: string;
  success: boolean;
  data: SalePayment[];
};

type SaleApiResponse = {
  message: string;
  success: boolean;
  data: SalePayment[];
};

type Response = {
  message: string;
  success: boolean;
};

export const customerPaymentApi = baseApi.injectEndpoints({
  endpoints: build => ({
    /*-----------------------------------------*
     * fetch all customer payments
     *-----------------------------------------*/
    customerPayments: build.query<customerPaymentsApiRes, { page: number }>({
      query: params => {
        const query = new URLSearchParams();
        if (params?.page) {
          query.set('page', params.page.toString());
        }
        return {
          url: `/payment/customer?${query.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['payment_sale'],
    }),

    /*-----------------------------------------*
     * fetch all payments made to a  customer
     *-----------------------------------------*/
    singleCustomerPayments: build.query<singleCustomerPaymentsApiRes, string>({
      query: customerId => ({
        url: `/payment/customer/${customerId}`,
        method: 'GET',
      }),
      providesTags: ['payment_sale'],
    }),

    /*-----------------------------------------*
     * fetch all payments made to a sale
     *-----------------------------------------*/
    SingleSalePayments: build.query<SaleApiResponse, string>({
      query: id => ({
        url: `/payment/sale/${id}`,
        method: 'GET',
      }),
      providesTags: ['payment_sale'],
    }),
    /*-----------------------------------------*
     *  received payment
     *-----------------------------------------*/
    saleReceivedPayment: build.mutation<Response, ReceivedSalePayment>({
      query: data => ({
        url: `/payment/sale/receive`,
        method: 'POST',
        body: data,
      }),

      invalidatesTags: ['payment_sale', 'sale', 'dashboard','analytics', 'customer'],
    }),
  }),
});

export const {
  useCustomerPaymentsQuery,
  useSingleCustomerPaymentsQuery,
  useSingleSalePaymentsQuery,
  useSaleReceivedPaymentMutation,
} = customerPaymentApi;
