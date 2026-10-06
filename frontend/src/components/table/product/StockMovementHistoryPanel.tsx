'use client';

import { useEffect, useState } from 'react';

import { ArrowUpDown } from '@/helpers/icon/icon';
import Loading from '@/components/shared/Loading';

import DetailsModel from '../DetailsModel';
import formatDate from '@/helpers/formatDate';
import getStockChange from '@/helpers/getStockChange';
import MOVEMENT_LABELS from '@/helpers/movementLabels';

import { StockMovement } from '@/types/product.types';
import { useSingleStockMovementsQuery } from '@/redux/feature/movementSlice';

type Props = {
  id: string | null;
  setId: (product: string | null) => void;
};

const StockMovementHistoryPanel = ({ id, setId }: Props) => {
  const [history, setHistory] = useState<StockMovement[]>([]);

  const productId = id;
  const { data, isLoading } = useSingleStockMovementsQuery(productId!, {
    skip: !productId,
  });
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(data?.data ?? []);
  }, [data]);

  return (
    <>
      <DetailsModel
        label="Stock History"
        onClose={() => setId(null)}
        open={!!id}
      >
        {isLoading ? (
          <Loading />
        ) : (
          history.map(movement => (
            <div
              key={movement.id}
              className="flex items-center justify-between gap-4 border-y border-border bg-surface px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full border border-border p-3">
                  <ArrowUpDown size={16} />
                </div>

                <div>
                  <p className="p14 font-medium text-text">
                    {movement.type === 'PURCHASE' ? 'STOCK_IN' : movement.type}{' '}
                    •{' '}
                    {getStockChange(
                      movement.beforeStock,
                      movement.afterStock,
                    )}{' '}
                  </p>

                  <p className="p12 mt-0.5">
                    {movement.reason || MOVEMENT_LABELS[movement.type]}
                  </p>

                  <p className="p12 mt-0.5">{formatDate(movement.createdAt)}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="p12">Stock</p>

                <p className="p14 text-text">
                  {movement.beforeStock} → {movement.afterStock} pcs
                </p>
              </div>
            </div>
          ))
        )}
      </DetailsModel>
    </>
  );
};

export default StockMovementHistoryPanel;
