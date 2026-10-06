'use client';

import { Truck, User } from '@/helpers/icon/icon';
import clsx from 'clsx';
import { Suspense, useState } from 'react';
import SupplierPaymentsTable from './SupplierPaymentsTable';
import CustomerPaymentsTable from './CustomerPaymentsTable';
import Loading from '@/components/shared/Loading';



type TabKey = 'suppliers' | 'customers';

const TABS = [
  { key: 'customers', label: 'Customers Payment', icon: User },
  { key: 'suppliers', label: 'Suppliers Payment', icon: Truck },
] as const;

const PaymentsSection = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('customers');

  return (
    <>
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        {TABS.map(item => {
          const isActive = activeTab === item.key;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(item.key)}
              className={clsx(
                'group flex cursor-pointer items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text hover:text-primary',
              )}
            >
              <Icon
                size={16}
                className={clsx(
                  isActive ? 'text-primary!' : 'group-hover:text-primary!',
                )}
              />

              {item.label}
            </button>
          );
        })}
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-surface mt-5">
        {activeTab === 'customers' && (<Suspense fallback={<Loading />}><CustomerPaymentsTable /></Suspense>)}
        {activeTab === 'suppliers' && <Suspense fallback={<Loading />}><SupplierPaymentsTable /></Suspense>}
      </div>
    </>
  );
};



//
export default PaymentsSection