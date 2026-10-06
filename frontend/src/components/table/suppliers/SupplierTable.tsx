'use client';

import clsx from 'clsx';

import Avatar from '@/components/shared/Avatar';
import Checkbox from '@/components/ui/Checkbox';
import formatPrice from '@/helpers/formatPrice';

import Td from '../Td';
import Th from '../Th';
import Tr from '../Tr';
import ActionMenu from '../ActionMenu';

import { Supplier } from '@/types/supplier.types';
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
  supplier: Supplier[];
  selected: string[];
  allChecked: boolean;
  toggleAll: () => void;
  toggleOne: (id: string) => void;
  handleBulkDelete: (id: string[]) => void;
  setIsEditFormOpen: (open: boolean) => void;
  setSelectedForDetails: (supplier: Supplier | null) => void;
  setSelectedForEdit: (supplier: Supplier | null) => void;
};

const SupplierTable = ({
  supplier,
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
      {/* Table */}
      <div className="scrollbar-thin scrollbar-thumb-border overflow-x-auto">
        <table className="w-full text-sm">
          {/* Header */}
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

          {/* Body */}
          <tbody>
            {supplier?.map(item => {
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
                  <Td>{formatPrice(item?.totalPurchase)}</Td>
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

export default SupplierTable;
