import { CreateStockMovement, StockMovement } from '@/types/product.types';
import { baseApi } from './baseApi';
import { stockMovements } from '@/mocks/product';

type StockMovementListResponse = {
  message: string;
  success: boolean;
  data: {
    movements: StockMovement[];
    totalPage: number;
  };
};

type Response = {
  message: string;
  success: boolean;
};

type ProductStockMovementResponse = {
  message: string;
  success: boolean;
  data: StockMovement[];
};

type MovementQueryParams = {
  page?: number;
  search?: string;
};

export const movementApi = baseApi.injectEndpoints({
  endpoints: build => ({


    /*-----------------------------------------*
   * fetch all stock movement history
   *-----------------------------------------*/
    getAllStockMovement: build.query<StockMovementListResponse, MovementQueryParams>(
      {
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
        //     url: `/movement?${query.toString()}`,
        //     method: 'GET',
        //   };
        // },

        // Mock: Keep for frontend development
        queryFn: async () => ({
          data: {
            message: '',
            success: true,
            data: {
              movements: stockMovements,
              totalPage: 5,
            },
          },
        }),

        providesTags: ['stockMovement'],
      },
    ),
    /*-----------------------------------------*
     * creates a new stock movement record.
     *-----------------------------------------*/
    createStockMovement: build.mutation<Response, CreateStockMovement>({
      query: data => ({
        url: '/movement',
        method: 'POST',
        body: data,
      }),

      invalidatesTags: ['stockMovement'],
    }),

    /*-----------------------------------------*
     * Fetches the stock movement history
     * for a specific product.
     *-----------------------------------------*/
    SingleStockMovements: build.query<ProductStockMovementResponse, string>({
      // query: productId => ({
      //   url: `/movement/${productId}`,
      //   method: 'GET',
      // }),

      // Mock: Keep for frontend development
      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: stockMovements,
        },
      }),

      providesTags: ['stockMovement'],
    }),



  }),
});


export const {
  useGetAllStockMovementQuery,
  useCreateStockMovementMutation,
  useSingleStockMovementsQuery,
} = movementApi;
