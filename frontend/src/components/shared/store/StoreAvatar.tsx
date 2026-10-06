'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { useGetStoreQuery } from '@/redux/feature/storeSlice';
import getInitials from '@/helpers/getInitials';

const StoreAvatar = ({ className }: { className?: string }) => {
  const { data: storeData, isLoading } = useGetStoreQuery();

  const store = storeData?.data;
  const logo = store?.logo?.url?.trim();

  const { color, initials } = getInitials(store?.name || 'N/A');

  return (
    <div className={clsx('flex items-center justify-start gap-2', className)}>
      {/* Store Avatar */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md">
        {isLoading ? (
          <div className="h-full w-full animate-pulse rounded-md bg-primary" />
        ) : logo ? (
          <Image
            src={logo}
            alt={store?.name || 'Store'}
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={clsx(
              'flex h-full w-full items-center justify-center rounded-md text-sm font-semibold text-white',
              color,
            )}
          >
            {initials}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h4 className="truncate font-medium text-title">
          {isLoading ? 'Loading...' : store?.name || 'N/A'}
        </h4>

        <p className="p14 leading-[1em] ">
          {isLoading ? 'Loading...' : store?.tagline}
        </p>
      </div>
    </div>
  );
};

export default StoreAvatar;
