'use client';

import clsx from 'clsx';

import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import getInitials from '@/helpers/getInitials';
import { Email, MapPin } from '@/helpers/icon/icon';
import useCurrentUserContext from '@/hooks/useCurrentUserContext';

const WelcomeBanner = () => {
  const { user } = useCurrentUserContext();
  const { initials } = getInitials(user?.name || 'N/A');

  return (
    <Card className=" flex flex-col lg:flex-row items-center justify-between gap-5 ">
      {/*  */}
      <div className="flex items-center justify-start gap-4 w-full">
        <div
          className={clsx(
            'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary',
            ' text-white text-2xl font-bold',
          )}
        >
          {initials}
        </div>

        <div>
          <p className="p14 text-text">Welcome back</p>
          <h3 className="text-title text-2xl">{user?.name || 'Loading..'}</h3>

          <div className="flex flex-wrap items-center gap-4">
            <span className="p14 flex items-center gap-1">
              <Email size={14} />
              {user?.email}
            </span>
            {user?.address && (
              <span className="p14 flex items-center gap-1">
                <MapPin size={14} />
                {user?.address}
              </span>
            )}
          </div>
        </div>
      </div>

      {/*   */}
      <div className="flex lg:justify-end items-center gap-3 w-full">
        <Button variant="secondary">Create Store</Button>
        <Button> Active Store</Button>
      </div>
    </Card>
  );
};

export default WelcomeBanner;
