// WHAT: Category table for listing, selecting, editing, and deleting categories

'use client';

import clsx from 'clsx';

import formatDate from '@/helpers/formatDate';
import Checkbox from '@/components/ui/Checkbox';
import { Pencil, Trash2 } from '@/helpers/icon/icon';
import { Category } from '@/types/Category.types';

import Th from '../Th';
import Tr from '../Tr';
import Td from '../Td';
import ProductAvatar from '../product/ProductAvatar';

const COLUMNS = [
  { label: 'Categories', align: 'left' },
  { label: 'name', align: 'left' },
  { label: 'slug', align: 'left' },
  { label: 'createdAt', align: 'left' },
  { label: 'updatedAt', align: 'left' },
  { label: 'Actions', align: 'right' },
];

type Props = {
  brand: Category[];
  selected: string[];
  allChecked: boolean;
  toggleAll: () => void;
  toggleOne: (id: string) => void;
  handleBulkDelete: (id: string[]) => void;
  setIsEditFormOpen: (open: boolean) => void;
  setSelectedCategoryForEdit: (product: Category | null) => void;
};

const CategoryTable = ({
  brand,
  selected,
  allChecked,
  toggleAll,
  toggleOne,
  handleBulkDelete,
  setIsEditFormOpen,
  setSelectedCategoryForEdit,
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
            {brand?.map(item => {
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
                    <ProductAvatar name={item?.name} id={item?.id || ''} />
                  </Td>

                  <Td>{item?.name}</Td>

                  <Td>{item?.slug}</Td>

                  <Td>{formatDate(item?.createdAt)}</Td>

                  <Td>{formatDate(item?.updatedAt)}</Td>

                  <Td>
                    <div className="flex items-center justify-end gap-6 text-sidebar-text">
                      <button
                        onClick={() => {
                          setSelectedCategoryForEdit(item);
                          setIsEditFormOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={() => {
                          handleBulkDelete([item.id]);
                        }}
                        className="cursor-pointer"
                      >
                        <Trash2 size={15} className="text-danger!" />
                      </button>
                    </div>
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

export default CategoryTable;
