'use client';

import { useState } from 'react';

import Card from '@/components/ui/card';
import Loading from '@/components/shared/Loading';
import useCurrentUserContext from '@/hooks/useCurrentUserContext';

import MenuItem from '../MenuItem';
import UserProfile from './Profile';
import UserPassword from './Password';
import UserDeleteAccount from './DeleteAccount';
import UserPreferences from './UserPreferences';
import { User as UserType } from '@/types/user/user.types';

import {
  RectangleEllipsis,
  SlidersHorizontal,
  Trash2,
  User,
} from '@/helpers/icon/icon';

const MENU_ITEMS = [
  { id: 'profile', label: 'Profile', icon: User },
  {
    id: 'password',
    label: 'Password',
    icon: RectangleEllipsis,
  },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: SlidersHorizontal,
  },
  {
    id: 'delete-account',
    label: 'Delete Account',
    icon: Trash2,
  },
];

const SettingMenu = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, isLoading } = useCurrentUserContext();

  return (
    <div className="flex h-full flex-col gap-4 lg:flex-row">
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
      <Card className="w-full hover:bg-card!">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {activeTab === 'profile' && <UserProfile user={user as UserType} />}
            {activeTab === 'password' && <UserPassword />}
            {activeTab === 'preferences' && <UserPreferences />}
            {activeTab === 'delete-account' && <UserDeleteAccount />}
          </>
        )}
      </Card>
    </div>
  );
};

export default SettingMenu;
