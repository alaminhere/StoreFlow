import { baseApi } from './baseApi';
import {
  DashboardCardsData,
  DashboardOverviewData,
  RangeKey,
} from '@/types/dashboard.types';

type OverviewResponse = {
  message: string;
  success: boolean;
  data: DashboardOverviewData;
};
type CardResponse = {
  message: string;
  success: boolean;
  data: DashboardCardsData;
};
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: build => ({
    /*----------------------------------------*
     *   fetch dashboard overview chart data
     *----------------------------------------*/
    dashboardOverview: build.query<OverviewResponse, void>({
      query: () => ({
        url: '/dashboard/overview',
        method: 'GET',
      }),
      providesTags: ['dashboard'],
    }),
    /*----------------------------------------*
     *  fetch dashboard overview card dta
     *----------------------------------------*/
    dashboardCards: build.query<CardResponse, RangeKey>({
      query: range => ({
        url: `/dashboard/cards?range=${range}`,
        method: 'GET',
      }),
      providesTags: ['dashboard'],
    }),
  }),
});

export const { useDashboardCardsQuery, useDashboardOverviewQuery } =
  dashboardApi;
