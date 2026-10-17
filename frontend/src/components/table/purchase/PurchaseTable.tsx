'use client';

import clsx from 'clsx';

import formatDate from '@/helpers/formatDate';
import formatPrice from '@/helpers/formatPrice';

import Td from '../Td';
import Th from '../Th';
import Tr from '../Tr';
import { Purchase } from '@/types/purchases.types';
import { History } from '@/helpers/icon/icon';

const COLUMNS = [
  { label: 'Purchase ID', align: 'left' },
  { label: 'Supplier', align: 'left' },
  { label: 'Items', align: 'left' },
  { label: 'Subtotal', align: 'left' },
  { label: 'Total', align: 'left', className: 'text-info' },
  { label: 'Paid', align: 'left', className: 'text-success' },
  { label: 'Due', align: 'left', className: 'text-warning' },
  { label: 'Date', align: 'left' },
  { label: 'Actions', align: 'right' },
];

type Props = {
  purchases: Purchase[];

  setSelectedPurchaseId: (purchase: string | null) => void;
};

const PurchaseTable = ({ purchases, setSelectedPurchaseId }: Props) => {
  return (
    <>
      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border">
        <table className="w-full text-sm">
          {/* Header */}
          <thead>
            <tr className="border-b border-border">
              {COLUMNS.map(col => (
                <Th
                  key={col.label}
                  className={clsx(
                    col.align === 'right' ? 'text-right' : 'text-left',
                  )}
                >
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1',
                      col.className,
                    )}
                  >
                    {col.label}
                  </span>
                </Th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {purchases?.map(item => {
              return (
                <Tr key={item?.id}>
                  <Td>{`${item?.id}`}</Td>
                  <Td className="flex flex-col">
                    <span>{item?.supplier?.name}</span>
                    <span className="text-xs">{item?.supplier?.email}</span>
                  </Td>
                  <Td>{formatPrice(item?.subtotal)}</Td>
                  <Td>{formatPrice(item?.subtotal)}</Td>
                  <Td>{formatPrice(item?.total)}</Td>
                  <Td className="text-success">{formatPrice(item?.paid)}</Td>
                  <Td className="text-warning">{formatPrice(item?.due)}</Td>
                  <Td>{formatDate(item?.createdAt)}</Td>
                  <Td className="text-right">
                    <button
                      className="cursor-pointer px-3"
                      onClick={() => setSelectedPurchaseId(item.id)}
                    >
                      <History size={15} />
                    </button>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PurchaseTable;
