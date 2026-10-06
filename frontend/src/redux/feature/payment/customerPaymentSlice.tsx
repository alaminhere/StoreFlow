
import { supplierPayments } from '@/mocks/suppliers';
import { baseApi } from '../baseApi';
import { ReceivedSalePayment, SalePayment } from '@/types/payment.types';
import { salePayments } from '@/mocks/sale';


type customerPaymentsApiRes = {
  message: string;
  success: boolean;
  data: { customerPayment: SalePayment[], totalPage: number };
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
            customerPayment: salePayments, totalPage: 8
          }
        },
      }),

      providesTags: ['payment_purchase'],
    }),


    /*-----------------------------------------*
     * fetch all payments made to a  customer
     *-----------------------------------------*/
    singleCustomerPayments: build.query<singleCustomerPaymentsApiRes, string>({
      // query: customerId => ({
      //   url: `/payment/customer/${customerId}`,
      //   method: 'GET',
      // }),

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: supplierPayments,
        },
      }),

      providesTags: ['payment_sale'],
    }),

    /*-----------------------------------------*
     * fetch all payments made to a sale
     *-----------------------------------------*/
    SingleSalePayments: build.query<SaleApiResponse, string>({
      // query: saleId => ({
      //   url: `/payment/sale/${saleId}`,
      //   method: 'GET',
      // }),

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: supplierPayments,
        },
      }),

      providesTags: ['payment_sale'],
    }),
    /*-----------------------------------------*
     *  received payment
     *-----------------------------------------*/
    saleReceivedPayment: build.mutation<Response, ReceivedSalePayment>({
      query: (data) => ({
        url: `/payment/sale`,
        method: 'PATCH',
        body: data,
      }),

      invalidatesTags: ['payment_sale', 'sale', 'customer'],
    }),


  })
})

export const {
  useCustomerPaymentsQuery,
  useSingleCustomerPaymentsQuery,
  useSingleSalePaymentsQuery,
  useSaleReceivedPaymentMutation

} = customerPaymentApi
