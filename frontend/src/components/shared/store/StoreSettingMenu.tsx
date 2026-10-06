'use client';

import { useState } from 'react';

import Card from '@/components/ui/card';
import Loading from '@/components/shared/Loading';
import { FileText, SlidersHorizontal, Trash2, User } from '@/helpers/icon/icon';

import MenuItem from '../MenuItem';
import InvoiceSetting from './InvoiceSetting';
import StoreDeleteAccount from './StoreDeleteAccount';
import StorePreferences from './StorePreferences';
import StoreProfile from './StoreProfile';

import { useGetStoreQuery } from '@/redux/feature/storeSlice';
import { Store } from '@/types/store.types';

const MENU_ITEMS = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
  },
  {
    id: 'invoice-settings',
    label: 'Invoice Settings',
    icon: FileText,
  },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: SlidersHorizontal,
  },
  {
    id: 'delete-store',
    label: 'Delete Store',
    icon: Trash2,
  },
];

const SettingMenu = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { data: storeData, isLoading } = useGetStoreQuery();
  const store = storeData?.data;

  return (
    <div className="flex h-full flex-col gap-4 lg:flex-row">
      {/* Settings Menu */}
      <Card className="w-full hover:border-border! lg:w-75">
        {MENU_ITEMS.map(item => {
          const Icon = item.icon;

          return (
            <MenuItem
              key={item.id}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              icon={<Icon size={16} />}
              label={item.label}
              className="py-2.5! text-sm!"
            />
          );
        })}
      </Card>

      {/* Content */}
      <Card className="w-full hover:bg-card!">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {/* Store Profile */}
            {activeTab === 'profile' && <StoreProfile store={store as Store} />}

            {/* Invoice Settings */}
            {activeTab === 'invoice-settings' && (
              <InvoiceSetting store={store as Store} />
            )}

            {/* Store Preferences */}
            {activeTab === 'preferences' && <StorePreferences />}

            {/* Delete Store */}
            {activeTab === 'delete-store' && (
              <StoreDeleteAccount store={store as Store} />
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default SettingMenu;
