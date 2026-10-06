

import { baseApi } from './baseApi';
import { PRODUCTS, mockProductSupplier, productList } from '@/mocks/product';
import { CreateProduct, Product,    ProductSupplier,    UpdateProduct } from '@/types/product.types';

type ProductApiResponse = {
  message: string;
  success: boolean;
  data: {
    Products: Product[];
    totalPage?: number;
  };
};

type ProductLis = {
  id: string;
  name: string;
  stock: number;
  price: number;
};

type ProductListApiResponse = {
  message: string;
  success: boolean;
  data: ProductLis[];
};
type ProductSupplierApiResponse = {
  message: string;
  success: boolean;
  data: ProductSupplier;
};

type ProductQueryParams = {
  page?: number;
  search?: string;
  stock?: string;
  category?: string;
  brand?: string;
};

type Response = {
  message: string;
  success: boolean;
};

export const productApi = baseApi.injectEndpoints({
  endpoints: build => ({
    /*-----------------------------------------*
     * fetch all products with pagination
     *-----------------------------------------*/
    allProduct: build.query<ProductApiResponse, ProductQueryParams>({
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
      //   if (params?.stock) {
      //     query.set('stock', params.stock);
      //   }
      //
      //   if (params?.category) {
      //     query.set('category', params.category);
      //   }
      //
      //   if (params?.brand) {
      //     query.set('brand', params.brand);
      //   }
      //
      //   return {
      //     url: `/product?${query.toString()}`,
      //     method: 'GET',
      //   };
      // },

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: {
            Products: PRODUCTS,
            totalPage: 5,
          },
        },
      }),

      providesTags: ['product', 'stockMovement'],
    }),

    /*-----------------------------------------*
     * fetch all products for select/dropdown
     * options
     *-----------------------------------------*/
    productList: build.query<ProductListApiResponse, void>({
      // API: Fetch product list
      // query: () => ({
      //   url: '/product/list',
      //   method: 'GET',
      // }),

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: productList,
        },
      }),

      providesTags: ['product', 'stockMovement'],
    }),


    /*-----------------------------------------*
     * fetch suppliers  a single product
     *-----------------------------------------*/
    productSupplier: build.query<ProductSupplierApiResponse, { id: string }>({
      // query: ({id}) => ({
      //   url: '/product/${id}/suppliers ',
      //   method: 'GET',
      // }),

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: mockProductSupplier
        }
      }),

      providesTags: ['supplier'],
    }),


    /*-----------------------------------------*
     * create a new product
     *-----------------------------------------*/
    createProduct: build.mutation<Response, CreateProduct>({
      query: data => ({
        url: '/product',
        method: 'POST',
        body: data,
      }),

      invalidatesTags: ['product'],
    }),

    /*-----------------------------------------*
     * update  product
     *-----------------------------------------*/
    updateProduct: build.mutation<Response, UpdateProduct>({
      query: ({ id, ...data }) => ({
        url: `/product/${id}`,
        method: 'PATCH',
        body: data,
      }),

      invalidatesTags: ['product'],
    }),

    /*-----------------------------------------*
     * delete product
     *-----------------------------------------*/
    deleteProducts: build.mutation<Response, { ids: string[] }>({
      query: data => ({
        url: '/product',
        method: 'DELETE',
        body: data,
      }),

      invalidatesTags: ['product'],
    }),
  }),
});

export const {
  useAllProductQuery,
  useProductListQuery,
  useProductSupplierQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductsMutation,
} = productApi;
