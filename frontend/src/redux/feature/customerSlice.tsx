import { baseApi } from './baseApi'; 
import {
  CreateCustomer,
  Customer,
  CustomerList,
  UpdateCustomer,
} from '@/types/customer.types';

type CustomerResponse = {
  message: string;
  success: boolean;
  data: {
    customers: Customer[];
    totalPage?: number;
  };
};

type CustomerQueryParams = {
  page?: number;
  search?: string;
};

type CustomerListResponse = {
  message: string;
  success: boolean;
  data: CustomerList[];
};

type DeleteCustomers = {
  ids: string[];
};

type Response = {
  message: string;
  success: boolean;
};

export const customerApi = baseApi.injectEndpoints({
  endpoints: build => ({
    /*-----------------------------------------*
     * fetch all customer with pagination and search
     *-----------------------------------------*/
    allCustomer: build.query<CustomerResponse, CustomerQueryParams>({
      query: params => {
        const query = new URLSearchParams();
        if (params?.search) {
          query.set('search', params.search);
        }
        if (params?.page) {
          query.set('page', params.page.toString());
        }
        return {
          url: `/customer?${query.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['customer'],
    }),

    /*-----------------------------------------*
     * fetch all customers without pagination
     *-----------------------------------------*/
    customerList: build.query<CustomerListResponse, void>({
      query: () => ({
        url: '/customer/list',
        method: 'GET',
      }),
      providesTags: ['customer'],
    }),

    /*-----------------------------------------*
     * create a new customer
     *-----------------------------------------*/
    createCustomer: build.mutation<Response, CreateCustomer>({
      query: data => ({
        url: '/customer',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['customer'],
    }),

    /*-----------------------------------------*
     * update customer
     *-----------------------------------------*/
    updateCustomer: build.mutation<Response, UpdateCustomer>({
      query: ({ id, ...data }) => ({
        url: `/customer/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['customer', 'sale', 'payment_sale'],
    }),

    /*-----------------------------------------*
     * delete customer
     *-----------------------------------------*/
    deleteCustomers: build.mutation<Response, DeleteCustomers>({
      query: data => ({
        url: '/customer',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['customer'],
    }),
  }),
});

export const {
  useAllCustomerQuery,
  useCustomerListQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomersMutation,
} = customerApi;
