'use client';

import clsx from 'clsx';
import Card from '@/components/ui/card';

import {
  AlertTriangle,
  Package,
  PackageX,
  Truck,
  User,
  Wallet,
} from '@/helpers/icon/icon';

import type { DashboardCardsData } from '@/types/dashboard.types';

const SUMMARY_CONFIG = [
  {
    key: 'totalProducts' as const,
    icon: Package,
    label: 'Total Products',
    iconStyle: 'bg-info-bg text-info!',
    valueStyle: 'text-white',
  },
  {
    key: 'stockValue' as const,
    icon: Wallet,
    label: 'Stock Value',
    iconStyle: 'bg-accent-bg text-accent!',
    valueStyle: 'text-white',
    prefix: '৳',
  },
  {
    key: 'lowStock' as const,
    icon: AlertTriangle,
    label: 'Low Stock',
    iconStyle: 'bg-warning-bg text-warning!',
    valueStyle: 'text-orange-400',
  },
  {
    key: 'outOfStock' as const,
    icon: PackageX,
    label: 'Out of Stock',
    iconStyle: 'bg-danger-bg text-danger!',
    valueStyle: 'text-orange-400',
  },
  {
    key: 'totalCustomers' as const,
    icon: User,
    label: 'Customers',
    iconStyle: 'bg-success-bg text-success!',
    valueStyle: 'text-white',
  },
  {
    key: 'totalSuppliers' as const,
    icon: Truck,
    label: 'Suppliers',
    iconStyle: 'bg-accent-bg text-accent!',
    valueStyle: 'text-white',
  },
];


interface Props {
  stats?: DashboardCardsData['stats'];
  isLoading?: boolean;
}

const DashboardOverviewStrip = ({ stats, isLoading }: Props) => {
  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {SUMMARY_CONFIG.map(config => {
        const value = stats?.[config.key] ?? 0;
        const Icon = config.icon;

        return (
          <Card
            key={config.key}
            className={clsx(
              'flex items-center gap-3 p-4! transition-opacity duration-150',
              isLoading && 'animate-pulse',
            )}
          >
            <Icon
              size={40}
              className={clsx('rounded-xl p-2.5', config.iconStyle)}
            />
            <div className="min-w-0">
              <p className="truncate p12">{config.label}</p>
              <h4 className={clsx('truncate', config.valueStyle)}>
                {isLoading ? (
                  <span className="text-muted">...</span>
                ) : (
                  <>
                    {config.prefix ?? ''}
                    {(value)}
                  </>
                )}
              </h4>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardOverviewStrip;