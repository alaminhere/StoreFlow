import { baseApi } from './baseApi';

type Response = { success: boolean; message: string };
export const invoiceApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    sendInvoiceEmail: builder.mutation<Response, FormData>({
      query: formData => ({
        url: '/invoices/send',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useSendInvoiceEmailMutation } = invoiceApi;
