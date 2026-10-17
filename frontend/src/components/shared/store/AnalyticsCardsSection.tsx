'use client';

import DashboardOverviewStrip from './DashboardOverviewStrip';
import DashboardOverviewSummaryCard from './DashboardOverviewSummaryCard';
import { useAnalyticsCardsQuery } from '@/redux/feature/analyticsSlice';

const AnalyticsCardsSection = () => {
  const { data, isLoading } = useAnalyticsCardsQuery('last30days');
  return (
    <>
      {/* Summary Cards */}
      <DashboardOverviewSummaryCard
        cards={data?.data?.cards}
        isLoading={isLoading}
        range="Last 30 Days"
      />
      {/* Overview Strip */}
      <DashboardOverviewStrip
        stats={data?.data?.stats}
        isLoading={isLoading}
        range="Last 30 Days"
      />
    </>
  );
};

export default AnalyticsCardsSection;
