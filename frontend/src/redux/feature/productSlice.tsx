import { baseApi } from './baseApi'; 
import {
  CreateProduct,
  Product,
  ProductSupplier,
  UpdateProduct,
} from '@/types/product.types';

type ProductApiResponse = {
  message: string;
  success: boolean;
  data: {
    products: Product[];
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
      query: params => {
        const query = new URLSearchParams();
        if (params?.search) {
          query.set('search', params.search);
        }
        if (params?.page) {
          query.set('page', params.page.toString());
        }
        if (params?.stock) {
          query.set('stock', params.stock);
        }
        if (params?.category) {
          query.set('category', params.category);
        }
        if (params?.brand) {
          query.set('brand', params.brand);
        }
        return {
          url: `/product?${query.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['product'],
    }),

    /*-----------------------------------------*
     * fetch all products for select/dropdown
     * options
     *-----------------------------------------*/
    productList: build.query<ProductListApiResponse, void>({
      query: () => ({
        url: '/product/list',
        method: 'GET',
      }),
      providesTags: ['product'],
    }),

    /*-----------------------------------------*
     * fetch suppliers  a single product
     *-----------------------------------------*/
    productSupplier: build.query<ProductSupplierApiResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/product/${id}/suppliers`,
        method: 'GET',
      }),
      providesTags: ['productSupplier'],
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
      invalidatesTags: ['product', 'inventory'],
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
      invalidatesTags: ['product', 'productSupplier', 'inventory'],
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
      invalidatesTags: ['product', 'productSupplier', 'inventory'],
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
