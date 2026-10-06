'use client';

import clsx from 'clsx';

import ActionMenu from '../ActionMenu';
import Checkbox from '@/components/ui/Checkbox';
import Avatar from '@/components/shared/Avatar';

import Th from '../Th';
import Tr from '../Tr';
import Td from '../Td';

import formatPrice from '@/helpers/formatPrice';
import { Customer } from '@/types/customer.types';
import MenuItem from '@/components/shared/MenuItem';
import { History, Pencil, Trash2 } from '@/helpers/icon/icon';

const COLUMNS = [
  { label: 'Supplier', align: 'left' },
  { label: 'Contact', align: 'left' },
  { label: 'Total Purchases', align: 'left' },
  { label: 'Paid', align: 'left' },
  { label: 'Due', align: 'left' },
  { label: 'Actions', align: 'right' },
];

type Props = {
  customer: Customer[];
  selected: string[];
  allChecked: boolean;
  toggleAll: () => void;
  toggleOne: (id: string) => void;
  handleBulkDelete: (id: string[]) => void;
  setIsEditFormOpen: (open: boolean) => void;
  setSelectedForDetails: (customer: Customer | null) => void;
  setSelectedForEdit: (customer: Customer | null) => void;
};

const CustomerTable = ({
  customer,
  selected,
  allChecked,
  toggleAll,
  toggleOne,
  handleBulkDelete,
  setIsEditFormOpen,
  setSelectedForDetails,
  setSelectedForEdit,
}: Props) => {
  return (
    <>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="w-12 px-5 py-3.5">
                <Checkbox checked={allChecked} onChange={toggleAll} />
              </th>

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
            {customer?.map(item => {
              const isChecked = selected.includes(item?.id);

              return (
                <Tr
                  key={item?.id}
                  className={clsx(isChecked && 'bg-sidebar-active-bg')}
                >
                  <Td className="px-5 py-3.5">
                    <Checkbox
                      checked={isChecked}
                      onChange={() => toggleOne(item?.id)}
                    />
                  </Td>

                  <Td>
                    <Avatar name={item?.name} details={item?.address} />
                  </Td>

                  <Td className="flex flex-col">
                    <span>{item?.email}</span>
                    <span className="text-xs">{item?.phone}</span>
                  </Td>

                  <Td>{formatPrice(item?.totalSale)}</Td>
                  <Td>{formatPrice(item?.totalPaid)}</Td>
                  <Td>{formatPrice(item?.totalDue)}</Td>

                  <Td>
                    <ActionMenu>
                      <MenuItem
                        icon={<History size={15} />}
                        label="Details"
                        className="px-4 py-2! text-sm! rounded-none!"
                        onClick={() => setSelectedForDetails(item)}
                      />
                      <MenuItem
                        icon={<Pencil size={15} />}
                        label="Edit"
                        className="px-4 py-2! text-sm! rounded-none!"
                        onClick={() => {
                          setSelectedForEdit(item);
                          setIsEditFormOpen(true);
                        }}
                      />
                      <MenuItem
                        icon={<Trash2 size={14} className="text-danger!" />}
                        label="Delete"
                        className="px-4 py-2! text-sm! rounded-none! border-t border-border"
                        danger
                        onClick={() => handleBulkDelete([item.id])}
                      />

                    </ActionMenu>
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

export default CustomerTable;
