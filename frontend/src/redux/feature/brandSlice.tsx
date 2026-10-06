import { baseApi } from './baseApi';

import { brands } from '@/mocks/product';

import { Brand, CreateBrand, UpdateBrand } from '@/types/brand.types';

type BrandResponse = {
  message: string;
  success: boolean;
  data: {
    brands: Brand[];
    totalPage: number;
  };
};

type BrandQueryParams = {
  page?: number;
  search?: string;
};

type BrandListResponse = {
  message: string;
  success: boolean;
  data: Brand[];
};

type BrandMutationResponse = {
  message: string;
  success: boolean;
  data?: Brand;
};

type DeleteBrandsRequest = {
  ids: string[];
};

type DeleteBrandsResponse = {
  message: string;
  success: boolean;
};

export const brandApi = baseApi.injectEndpoints({
  endpoints: build => ({
    allBrand: build.query<BrandResponse, BrandQueryParams>({
      /*-----------------------------------------*
       * fetch brands with pagination and search
       *-----------------------------------------*/

      // query: params => {
      //   const query = new URLSearchParams();

      //   if (params?.search) {
      //     query.set('search', params.search);
      //   }

      //   if (params?.page) {
      //     query.set('page', params.page.toString());
      //   }

      //   return {
      //     url: `/brand?${query.toString().toLocaleLowerCase()}`,
      //     method: 'GET',
      //   };
      // },

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: {
            brands,
            totalPage: 4,
          },
        },
      }),

      providesTags: ['brand'],
    }),

    /*-----------------------------------------*
     * fetch brands without pagination
     *-----------------------------------------*/
    brandList: build.query<BrandListResponse, void>({
      // query: () => ({
      //   url: '/brand/list',
      //   method: 'GET',
      // }),

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: brands,
        },
      }),
      providesTags: ['brand'],
    }),

    /*-----------------------------------------*
     * create brand
     *-----------------------------------------*/
    createBrand: build.mutation<BrandMutationResponse, CreateBrand>({
      query: data => ({
        url: '/brand',
        method: 'POST',
        body: data,
      }),

      invalidatesTags: ['brand'],
    }),

    /*-----------------------------------------*
     * update brands
     *-----------------------------------------*/
    updateBrand: build.mutation<BrandMutationResponse, UpdateBrand>({
      query: ({ id, ...data }) => ({
        url: `/brand/${id}`,
        method: 'PATCH',
        body: data,
      }),

      invalidatesTags: ['brand'],
    }),

    /*-----------------------------------------*
     * delete brand
     *-----------------------------------------*/
    deleteBrands: build.mutation<DeleteBrandsResponse, DeleteBrandsRequest>({
      query: data => ({
        url: '/brand',
        method: 'DELETE',
        body: data,
      }),

      invalidatesTags: ['brand'],
    }),
  }),
});

export const {
  useAllBrandQuery,
  useBrandListQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandsMutation,
} = brandApi;
