
import { baseApi } from "./baseApi";
import { dashboardCards, dashboardOverviewData } from "@/mocks/dashboard";
import { DashboardCardsData, DashboardOverviewData, RangeKey, } from "@/types/dashboard.types";


type OverviewResponse = {
  message: string,
  success: boolean,
  data: DashboardOverviewData
}
type CardResponse = {
  message: string,
  success: boolean,
  data: DashboardCardsData
}
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: build => ({

    dashboardCards: build.query<OverviewResponse, void>({
      // query: () => ({
      //   url: '/dashboard/overview',
      //   method: 'GET',
      // }),

      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: dashboardOverviewData,
        },
      }),

      providesTags: ['dashboard'],
    }),

     dashboardOverview: build.query<CardResponse, RangeKey>({
      // query: () => ({
      //   url: '/dashboard/cards/${range}',
      //   method: 'GET',
      // }),

      queryFn: async () => ({
        data: {
          message: '',
          success: true,
          data: dashboardCards,
        },
      }),

      providesTags: ['dashboard'],
    }),

  })
})

export const {
  useDashboardCardsQuery,
  useDashboardOverviewQuery,
} = dashboardApi