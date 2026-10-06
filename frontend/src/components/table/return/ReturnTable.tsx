'use client';

import clsx from 'clsx';
import Avatar from '@/components/shared/Avatar';

import Th from '../Th';
import Tr from '../Tr';
import Td from '../Td';

import formatPrice from '@/helpers/formatPrice';
import { Return } from '@/types/return.types';
import { History } from '@/helpers/icon/icon';

const COLUMNS = [
  { label: 'Party', align: 'left' },
  { label: 'Contact', align: 'left' },
  { label: 'type', align: 'left' },
  { label: 'condition', align: 'left' },
  { label: 'reason', align: 'left' },
  { label: 'Refund', align: 'left' },
  { label: 'Actions', align: 'right' },
];

type Props = {
  returnData: Return[];
  setSelectedForDetails: (returnData: Return | null) => void;
};

const ReturnTable = ({
  returnData,
  setSelectedForDetails,
}: Props) => {
  return (
    <>
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
            {returnData?.map(item => {


              return (
                <Tr
                  key={item?.id}
                >
                  <Td>
                    <Avatar
                      name={item?.party.name}
                      details={item?.party.address}
                    />
                  </Td>

                  <Td className="flex flex-col">
                    <span>{item?.party.email}</span>
                    <span className="text-xs">{item?.party.phone}</span>
                  </Td>
                  <Td>{item?.type}</Td>
                  <Td>{item?.condition}</Td>
                  <Td>{item?.reason}</Td>
                  <Td>{formatPrice(item?.total)}</Td>

                  <Td className="text-right">
                    <button
                      className="cursor-pointer px-3"
                      onClick={() => setSelectedForDetails(item)}
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

export default ReturnTable;
