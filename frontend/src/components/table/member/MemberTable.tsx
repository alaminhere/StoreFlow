'use client';

import clsx from 'clsx';

import Avatar from '@/components/shared/Avatar';
import Checkbox from '@/components/ui/Checkbox';

import { Pencil, Trash2 } from '@/helpers/icon/icon';
import formatDate from '@/helpers/formatDate';

import Td from '../Td';
import Th from '../Th';
import Tr from '../Tr';
import { StoreMember } from '@/types/store.types';

const COLUMNS = [
  { label: 'Member', align: 'left' },
  { label: 'Contact', align: 'left' },
  { label: 'Role', align: 'left' },
  { label: 'Joined Date', align: 'left' },
  { label: 'Actions', align: 'right' },
];

type Props = {
  member: StoreMember[];
  selected: string[];
  allChecked: boolean;
  toggleAll: () => void;
  toggleOne: (id: string) => void;
  handleBulkDelete: (id: string[]) => void;
  setIsEditFormOpen: (open: boolean) => void;
  setSelectedForEdit: (customer: StoreMember | null) => void;
};

const MemberTable = ({
  member,
  selected,
  allChecked,
  toggleAll,
  toggleOne,
  handleBulkDelete,
  setIsEditFormOpen,
  setSelectedForEdit,
}: Props) => {
  return (
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
                <span className={clsx('inline-flex items-center gap-1')}>
                  {col.label}
                </span>
              </Th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {member?.map(item => {
            const isChecked = selected.includes(item?.id);

            return (
              <Tr
                key={item?.id}
                className={clsx(isChecked && 'bg-sidebar-active-bg')}
              >
                {/* Selection */}
                <Td className="px-5 py-3.5">
                  <Checkbox
                    checked={isChecked}
                    onChange={() => toggleOne(item?.id)}
                  />
                </Td>

                {/* Member */}
                <Td>
                  <Avatar
                    name={item?.name}
                    details={item?.address ?? 'Bangladesh'}
                  />
                </Td>

                {/* Contact */}
                <Td className="flex flex-col">
                  <span>{item?.email}</span>
                  <span className="text-xs">{item?.phone}</span>
                </Td>

                {/* Role */}
                <Td className="text-info">{item.role}</Td>

                {/* Joined Date */}
                <Td>{formatDate(item?.createdAt)}</Td>

                {/* Actions */}
                <Td className="text-end! ">
                  <button
                    onClick={() => {
                      setIsEditFormOpen(true);
                      setSelectedForEdit(item);
                    }}
                    className="cursor-pointer"
                  >
                    <Pencil size={15} className=" " />
                  </button>
                  <button
                    onClick={() => {
                      handleBulkDelete([item.id]);
                    }}
                    className="cursor-pointer ml-4"
                  >
                    <Trash2 size={15} className="text-danger!" />
                  </button>
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
