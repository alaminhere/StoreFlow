'use client'

import Button from "@/components/ui/button";
import { RangeKey } from "@/types/dashboard.types";
import { useState } from "react";
import DashboardOverviewStrip from "./DashboardOverviewStrip";
import { useDashboardOverviewQuery, } from "@/redux/feature/dashboardSlice";
import DashboardOverviewSummaryCard from "./DashboardOverviewSummaryCard";


const RANGE = [
     { key: 'today', label: 'Today' },
     { key: 'yesterday', label: 'Yesterday' },
     { key: 'last7', label: 'Last 7 Days' },
     { key: 'last30', label: 'Last 30 Days' },
     { key: 'lastMonth', label: 'Last Month' },
     { key: 'thisYear', label: 'This Year' },
] as const;

const DashboardOverviewSection = () => {
     const [activeRange, setActiveRange] = useState<RangeKey>('today');
     const { data, isLoading } = useDashboardOverviewQuery(activeRange)

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
               />
               {/* Overview Strip */}
               <DashboardOverviewStrip
                    stats={data?.data?.stats}
                    isLoading={isLoading}
               />

          </>
     )
}

export default DashboardOverviewSection