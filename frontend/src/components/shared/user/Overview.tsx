'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Card from '@/components/ui/card';
import { Plus } from '@/helpers/icon/icon';
import handleAlert from '@/helpers/handleAlert';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import { useOpenStoreMutation } from '@/redux/feature/storeSlice';
import useCurrentUserContext from '@/hooks/useCurrentUserContext';

import Loading from '../Loading';
import StoreForm from './StoreForm';
import StoreCard from './StoreCard';
import PopupModal from '../PopupModal';

type Props = {
  limit?: number;
  showViewAll?: boolean;
};

const Overview = ({ limit, showViewAll = false }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [openStore, { isLoading }] = useOpenStoreMutation();
  const { user, isLoading: userLoading } = useCurrentUserContext();

  const stores = user?.stores ?? [];
  const visibleStores = limit ? stores.slice(0, limit) : stores;

  const handleOpenStore = async (id: string) => {
    try {
      const res = await openStore({ storeId: id }).unwrap();
      if (!res) return;
      handleAlert(res.success, res.message);
      if (res.success) {
        router.push('/dashboard');
      }
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpening(isLoading);
  }, [isLoading]);

  return (
    <>
      {opening && (
        <PopupModal
          onClose={() => setOpening(false)}
          label="Opening"
          className="max-w-md!"
        >
          <Loading message="Your store is opening, please wait..." />
        </PopupModal>
      )}

      <div>
        {/* Store Overview Header */}
        {showViewAll && (
          <div className="mt-5 mb-2 flex items-center justify-between">
            <h4>Your Stores</h4>
            <Link
              href="/profile/stores"
              className="flex cursor-pointer items-center gap-1 p14 text-primary"
            >
              View All
            </Link>
          </div>
        )}
        {/* Store List */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {userLoading ? (
            <Loading />
          ) : visibleStores.length > 0 ? (
            visibleStores.map(store => (
              <StoreCard
                key={store.id}
                store={store}
                onOpen={() => handleOpenStore(store.id)}
              />
            ))
          ) : (
            <div className="flex items-center justify-center">
              <h4>Store not found</h4>
            </div>
          )}{' '}
          {!showViewAll && (
            <Card
              onClick={() => setOpen(!open)}
              className="flex cursor-pointer flex-col items-center justify-center space-y-1 border-2 border-dashed bg-background!"
            >
              <Plus />

              <h4>Create New Store</h4>
            </Card>
          )}
        </div>{' '}
        <StoreForm open={open} setOpen={setOpen} />
      </div>
    </>
  );
};

export default Overview;
