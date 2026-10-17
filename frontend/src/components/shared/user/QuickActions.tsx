'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';

import StoreForm from './StoreForm';
import Card from '@/components/ui/card';
import {
  User,
  Plus,
  Settings,
  Package,
  ArrowLeftRight,
} from '@/helpers/icon/icon';

const quickActions = [
  {
    icon: User,
    href: '/profile/settings',
    iconBg: 'bg-warning-bg',
    iconColor: 'text-warning!',
    title: 'My Profile',
    description: 'View and edit your personal information',
  },
  {
    icon: Package,
    href: '/profile/stores',
    iconBg: 'bg-success-bg',
    iconColor: 'text-success!',
    title: 'My Stores',
    description: 'Manage your connected stores',
  },

  {
    icon: Settings,
    href: '/profile/settings',
    iconBg: 'bg-accent-bg',
    iconColor: 'text-accent!',
    title: 'Account Settings',
    description: 'Security, preferences, and notifications',
  },
];

const QuickActions = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 ">
      {quickActions.map(action => (
        <Link key={action.title} href={action.href}>
          <Card className="flex items-center justify-between gap-4 bg-primary-fade">
            <div className="flex items-center gap-3">
              <div>
                <action.icon
                  size={40}
                  className={clsx(
                    'flex p-2 shrink-0 items-center justify-center rounded-xl',
                    action.iconBg,
                    action.iconColor,
                  )}
                />
              </div>
              <div>
                <h4>{action.title}</h4>
                <p className="p14">{action.description}</p>
              </div>
            </div>

            <ArrowLeftRight size={18} className={`${action.iconColor}`} />
          </Card>
        </Link>
      ))}
      <Card
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-4 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div>
            <Plus
              size={40}
              className={clsx(
                'flex p-2 shrink-0 items-center justify-center rounded-xl',
                'bg-info-bg! text-info!',
              )}
            />
          </div>
          <div>
            <h4>Create New Store</h4>
            <p className="p14">Set up a new store workspace</p>
          </div>
        </div>
        <ArrowLeftRight size={18} className=" text-info!" />
      </Card>
      <StoreForm open={open} setOpen={setOpen} />
    </div>
  );
};

export default QuickActions;
