'use client';

import clsx from 'clsx';

import Card from '@/components/ui/card';
import getInitials from '@/helpers/getInitials';

type StoreCardProps = {
  store: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  onOpen: () => void;
};

const roleBadge: Record<string, string> = {
  OWNER: 'bg-warning-bg text-warning',
  ADMIN: 'bg-success-bg text-success',
  MANAGER: 'bg-info-bg text-info',
  SALESMAN: 'bg-accent-bg text-accent',
};

const roleLink: Record<string, string> = {
  OWNER: 'text-warning',
  ADMIN: 'text-success',
  MANAGER: 'text-info',
  SALESMAN: 'text-accent',
};

const StoreCard = ({ store, onOpen }: StoreCardProps) => {
  const { initials } = getInitials(store.name);

  return (
    <Card className="space-y-5">
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            'text-white font-medium',
            roleBadge[store.role],
          )}
        >
          {initials}
        </div>

        <div className="min-w-0">
          <h4 className="truncate">{store.name}</h4>
          <p className="p14 truncate">{store.email}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={clsx(
            'p12 rounded-md px-2.5 py-1 font-medium',
            roleBadge[store.role],
          )}
        >
          {store.role}
        </span>

        <button
          type="button"
          onClick={onOpen}
          className={clsx(
            roleLink[store.role],
            'p14 cursor-pointer px-2.5 py-1 font-medium',
          )}
        >
          Open
        </button>
      </div>
    </Card>
  );
};

export default StoreCard;
