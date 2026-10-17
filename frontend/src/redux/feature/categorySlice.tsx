import { baseApi } from './baseApi'; 
import {
  Category,
  CreateCategory,
  UpdateCategory,
} from '@/types/Category.types';

type CategoryResponse = {
  message: string;
  success: boolean;
  data: {
    categories: Category[];
    totalPage: number;
  };
};

type CategoryQueryParams = {
  page?: number;
  search?: string;
};

type CategoryListResponse = {
  message: string;
  success: boolean;
  data: Category[];
};

type DeleteCategory = {
  ids: string[];
};

type Response = {
  message: string;
  success: boolean;
};

export const categoryApi = baseApi.injectEndpoints({
  endpoints: build => ({
    /*-----------------------------------------*
     * fetch category without pagination
     *-----------------------------------------*/
    allCategory: build.query<CategoryResponse, CategoryQueryParams>({
      query: params => {
        const query = new URLSearchParams();
        if (params?.search) {
          query.set('search', params.search);
        }
        if (params?.page) {
          query.set('page', params.page.toString());
        }
        return {
          url: `/category?${query.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['category'],
    }),

    /*-----------------------------------------*
     * fetch all categories without pagination
     *-----------------------------------------*/
    categoryList: build.query<CategoryListResponse, void>({
      query: () => ({
        url: '/category/list',
        method: 'GET',
      }),
      providesTags: ['category'],
    }),

    /*-----------------------------------------*
     * create a new category
     *-----------------------------------------*/
    createCategory: build.mutation<Response, CreateCategory>({
      query: data => ({
        url: '/category',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['category'],
    }),

    /*-----------------------------------------*
     * update category
     *-----------------------------------------*/
    updateCategory: build.mutation<Response, UpdateCategory>({
      query: ({ id, ...data }) => ({
        url: `/category/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['category', 'product'],
    }),

    /*-----------------------------------------*
     * delete one or multiple categories
     *-----------------------------------------*/
    deleteCategory: build.mutation<Response, DeleteCategory>({
      query: data => ({
        url: '/category',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['category'],
    }),
  }),
});

export const {
  useAllCategoryQuery,
  useCategoryListQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
