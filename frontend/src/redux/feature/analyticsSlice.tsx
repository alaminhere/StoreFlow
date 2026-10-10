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
export const analyticsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    /*----------------------------------------*
     *  fetch analytics overview chart data
     *----------------------------------------*/
    analyticsOverview: build.query<OverviewResponse, void>({
      query: () => ({
        url: '/analytics/overview',
        method: 'GET',
      }),
      providesTags: ['analytics'],
    }),

    /*----------------------------------------*
     *  fetch analytics overview card data
     *----------------------------------------*/
    analyticsCards: build.query<CardResponse, RangeKey>({
      query: range => ({
        url: `/analytics/cards?range=${range}`,
        method: 'GET',
      }),
      providesTags: ['analytics'],
    }),
  }),
});

export const { useAnalyticsCardsQuery, useAnalyticsOverviewQuery } =
  analyticsApi;
