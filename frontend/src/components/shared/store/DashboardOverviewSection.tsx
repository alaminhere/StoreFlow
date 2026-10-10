'use client';

import DonutChartCard from './DashboardDonutChartCard';
import DashboardBarChartCard from './DashboardBarChartCard';
import { useDashboardOverviewQuery } from '@/redux/feature/dashboardSlice';
import DashboardSalesChart from './DashboardSalesChart';

const DashboardOverviewSection = () => {
  const { data: chartData, isLoading } = useDashboardOverviewQuery();
  const data = chartData?.data;

  return (
    <>
      {/* Sales Overview / Sales by Category */}
      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <DashboardSalesChart
          className="xl:col-span-2"
          title="Sales Overview"
          subtitle="Last 6 months"
          labels={data?.labels ?? []}
          series={[
            {
              label: 'Sales',
              data: data?.sales ?? [],
              tone: 'accent',
              filled: true,
            },
            { label: 'Purchases', data: data?.purchases ?? [], tone: 'info' },
            {
              label: 'Revenue',
              data: data?.revenue ?? [],
              tone: 'success',
              dashed: true,
            },
          ]}
          isLoading={isLoading}
        />
        <DonutChartCard
          title="Sales by Category"
          subtitle="Last 6 months"
          items={data?.salesByCategory ?? []}
          isLoading={isLoading}
        />
      </div>

      {/* Payment Methods / Purchase vs Sales */}
      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <DonutChartCard
          title="Payment Methods"
          subtitle="Last 6 months"
          items={
            data?.paymentMethods.map(p => ({
              ...p,
              tone:
                p.label === 'CASH'
                  ? 'success'
                  : p.label === 'BKASH'
                    ? 'danger'
                    : p.label === 'BANK_TRANSFER'
                      ? 'info'
                      : 'accent',
            })) ?? []
          }
          isLoading={isLoading}
        />
        <DashboardBarChartCard
          className="xl:col-span-2"
          title="Purchase vs Sales"
          subtitle="Last 6 months"
          labels={data?.labels ?? []}
          series={[
            { label: 'Sales', data: data?.sales ?? [], tone: 'accent' },
            { label: 'Purchases', data: data?.purchases ?? [], tone: 'info' },
          ]}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default DashboardOverviewSection;
