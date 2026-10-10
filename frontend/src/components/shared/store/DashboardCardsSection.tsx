'use client';

import Button from '@/components/ui/button';
import { RangeKey } from '@/types/dashboard.types';
import { useState } from 'react';
import DashboardOverviewStrip from './DashboardOverviewStrip';
import { useDashboardCardsQuery } from '@/redux/feature/dashboardSlice';
import DashboardOverviewSummaryCard from './DashboardOverviewSummaryCard';

const RANGE = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'last7days', label: 'Last 7 Days' },
  { key: 'last30days', label: 'Last 30 Days' },
  { key: 'lastMonth', label: 'Last Month' },
  { key: 'thisYear', label: 'This Year' },
] as const;

export const getRangeLabel = (key: string): string => {
  return RANGE.find(r => r.key === key)?.label ?? 'Unknown';
};
const DashboardCardsSection = () => {
  const [activeRange, setActiveRange] = useState<RangeKey>('today');
  const { data, isLoading } = useDashboardCardsQuery(activeRange);
  return (
    <>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {RANGE.map(range => (
          <Button
            key={range.key}
            variant={activeRange === range.key ? 'primary' : 'secondary'}
            onClick={() => setActiveRange(range.key)}
          >
            {range.label}
          </Button>
        ))}
      </div>
      {/* Summary Cards */}
      <DashboardOverviewSummaryCard
        cards={data?.data?.cards}
        isLoading={isLoading}
        range={getRangeLabel(data?.data.range ?? '')}
      />
      {/* Overview Strip */}
      <DashboardOverviewStrip
        stats={data?.data?.stats}
        isLoading={isLoading}
        range={getRangeLabel(data?.data.range ?? '')}
      />
    </>
  );
};

export default DashboardCardsSection;
