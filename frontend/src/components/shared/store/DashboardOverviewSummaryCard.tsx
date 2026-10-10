'use client';

import clsx from 'clsx';
import { useId } from 'react';
import Card from '@/components/ui/card';

import {
  ArrowLeftRight,
  ArrowUpDown,
  ShoppingCart,
  Wallet,
} from '@/helpers/icon/icon';

import type { DashboardCardsData } from '@/types/dashboard.types';
import formatPrice from '@/helpers/formatPrice';

interface Props {
  cards?: DashboardCardsData['cards'];
  range?: string;
  isLoading?: boolean;
}

const STATUS_CONFIG = [
  {
    key: 'totalSales' as const,
    icon: ShoppingCart,
    iconBg: 'bg-accent',
    label: 'Total Sales',
    path: 'M0 32 L14 22 L26 26 L40 14 L52 18 L68 6 L82 12 L100 2',
  },
  {
    key: 'totalPurchases' as const,
    icon: Wallet,
    iconBg: 'bg-info',
    label: 'Total Purchases',
    path: 'M0 34 L20 26 L40 20 L60 14 L80 8 L100 2',
  },
  {
    key: 'grossProfit' as const,
    icon: Wallet,
    iconBg: 'bg-success',
    label: 'Gross Profit',
    path: 'M0 32 L14 22 L26 26 L40 14 L52 18 L68 6 L82 12 L100 2',
  },
  {
    key: 'netProfit' as const,
    icon: Wallet,
    iconBg: 'bg-warning',
    label: 'Net Profit',
    path: 'M0 4 L14 14 L26 8 L40 20 L52 12 L68 26 L82 18 L100 32',
  },
];

const Sparkling = ({ path, isUp }: { path: string; isUp: boolean }) => {
  const id = useId().replace(/:/g, '');

  return (
    <svg
      viewBox="0 0 100 40"
      fill="none"
      aria-hidden="true"
      className={clsx('h-10 w-24', isUp ? 'text-success' : 'text-danger')}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={`${path} L100 40 L0 40 Z`} fill={`url(#${id})`} />
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const DashboardOverviewSummaryCard = ({ cards, range, isLoading }: Props) => {
  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATUS_CONFIG.map(config => {
        const data = cards?.[config.key];
        const change = data?.change ?? 0;
        const value = data?.value ?? 0;
        const isUp = change >= 0;

        const TrendIcon = isUp ? ArrowLeftRight : ArrowUpDown;
        const tone = isUp ? 'text-success' : 'text-danger';
        const Icon = config.icon;

        return (
          <Card
            key={config.key}
            className={clsx(
              'transition-opacity duration-100 bg-primary-fade',
              isLoading && 'animate-pulse',
            )}
          >
            <div className="flex items-start justify-between">
              <Icon
                size={40}
                className={clsx('rounded-xl p-2.5 text-white', config.iconBg)}
              />
              <Sparkling path={config.path} isUp={isUp} />
            </div>

            <p className="mt-4 mb-1 text-sm">
              {range && range} {config.label}
            </p>

            <h3>
              {isLoading ? (
                <span className="text-muted">...</span>
              ) : (
                formatPrice(value)
              )}
            </h3>

            <div className="mt-2 flex items-center gap-1 text-xs">
              <TrendIcon size={14} className={tone} />
              <span className={clsx('font-semibold', tone)}>
                {Math.abs(change)}%
              </span>
              <span>vs last period</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardOverviewSummaryCard;
