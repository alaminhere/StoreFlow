'use client';
import { useDashboardCardsQuery } from '@/redux/feature/dashboardSlice';
import DashboardOverviewSummaryCard from './DashboardOverviewSummaryCard'; 
import { getRangeLabel } from './DashboardCardsSection';

const InventorySummaryCard = () => {
  const { data, isLoading } = useDashboardCardsQuery('last30days');
  return (
    <DashboardOverviewSummaryCard
      cards={data?.data?.cards}
      isLoading={isLoading}
      range={getRangeLabel(data?.data.range ?? '')}
    />
  );
};

export default InventorySummaryCard;
