// WHAT: Stock movement table for listing, selecting, and deleting movements

'use client';

import clsx from 'clsx';

import formatDate from '@/helpers/formatDate';
import getStockChange from '@/helpers/getStockChange';
import MOVEMENT_LABELS from '@/helpers/movementLabels';

import { StockMovement } from '@/types/product.types';

import Td from '../Td';
import Th from '../Th';
import Tr from '../Tr';

const COLUMNS = [
  { label: 'Type', align: 'left' },
  { label: 'Product id', align: 'left' },
  { label: 'Previous', align: 'left' },
  { label: 'Change', align: 'left' },
  { label: 'New Stock', align: 'left' },
  { label: 'Reason', align: 'left' },
  { label: 'Date', align: 'right' },
];

const MovementTable = ({ movement }: { movement: StockMovement[] }) => {
  return (
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {COLUMNS.map(col => (
              <Th
                key={col.label}
                className={clsx(
                  col.align === 'right' ? 'text-right' : 'text-left',
                )}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                </span>
              </Th>
            ))}
          </tr>
        </thead>

        <tbody>
          {movement?.map(item => {
            return (
              <Tr key={item?.id}>
                <Td>{item.type}</Td>
                <Td>{item?.productId}</Td>
                <Td className="text-text!">{item?.beforeStock} pcs</Td>
                <Td>{getStockChange(item.beforeStock, item.afterStock)} pcs</Td>
                <Td>{item?.afterStock} pcs</Td>
                <Td>{item?.reason || MOVEMENT_LABELS[item.type]}</Td>
                <Td className="text-right">{formatDate(item.createdAt)}</Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MovementTable;
