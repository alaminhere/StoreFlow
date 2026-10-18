import clsx from 'clsx';

import Checkbox from '../../ui/Checkbox';
import ActionMenu from '../ActionMenu';

import Td from '../Td';
import Th from '../Th';
import Tr from '../Tr';

import formatPrice from '@/helpers/formatPrice';
import {
  Eye,
  ArrowUpDown,
  History,
  Pencil,
  Trash2,
  Truck,
  Box,
} from '@/helpers/icon/icon';
import getStockStatus, { statusStyles } from '@/helpers/StockStatus';
import { Product } from '@/types/product.types';
import MenuItem from '@/components/shared/MenuItem';
import Image from 'next/image';

const COLUMNS = [
  { label: 'Product', align: 'left' },
  { label: 'SKU', align: 'left' },
  { label: 'Category', align: 'left' },
  { label: 'Brand', align: 'left' },
  { label: 'Price', sortable: true, align: 'right' },
  { label: 'Stock', sortable: true, align: 'right' },
  { label: 'Status', align: 'left' },
  { label: 'Actions', sortable: false, align: 'right' },
];

type Props = {
  products: Product[];
  selected: string[];
  allChecked: boolean;
  toggleAll: () => void;
  toggleOne: (id: string) => void;
  handleBulkDelete: (id: string[]) => void;

  setSelectedProductForDetails: (product: Product | null) => void;
  setProductIdForHistory: (id: string | null) => void;

  setSelectedProductForEdit: (product: Product | null) => void;
  setIsEditFormOpen: (open: boolean) => void;
  setProductIdIdForSupplier: (id: string | null) => void;
};

const ProductTable = ({
  products,
  selected,
  allChecked,
  toggleAll,
  toggleOne,
  handleBulkDelete,
  setSelectedProductForDetails,
  setProductIdForHistory,
  setSelectedProductForEdit,
  setIsEditFormOpen,
  setProductIdIdForSupplier,
}: Props) => {
  return (
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
                  {col.sortable && <ArrowUpDown size={12} />}
                </span>
              </Th>
            ))}
          </tr>
        </thead>

        <tbody>
          {products?.map(product => {
            const isChecked = selected.includes(product?.id);

            return (
              <Tr
                key={product?.id}
                className={clsx(isChecked && 'bg-sidebar-active-bg')}
              >
                <Td className="px-5 py-3.5">
                  <Checkbox
                    checked={isChecked}
                    onChange={() => toggleOne(product?.id)}
                  />
                </Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-sidebar-active-bg">
                      {product?.image?.url ? (
                        <Image
                          src={product.image.url}
                          alt={product.image.public_id}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      ) : (
                        <Box size={14} className="text-sidebar-text" />
                      )}
                    </div>
                    <div>
                      <h4>{product?.name}</h4>
                      <p className="p12">{product?.id}</p>
                    </div>
                  </div>
                </Td>
                <Td>{product?.sku}</Td>
                <Td>{product?.category.name}</Td>
                <Td>{product?.brand.name}</Td>

                <Td className="text-right text-text">
                  {formatPrice(product?.price)}
                </Td>

                <Td className="text-right">{product?.stock}</Td>

                <Td>
                  <span
                    className={clsx(
                      'inline-flex whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium',
                      statusStyles[
                        getStockStatus(
                          product?.stock,
                          product?.minimumStockLevel,
                        )
                      ],
                    )}
                  >
                    {getStockStatus(product?.stock, product?.minimumStockLevel)}
                  </span>
                </Td>

                <Td>
                  <div className="flex items-center justify-end gap-5 text-sidebar-text">
                    <button
                      onClick={() => setSelectedProductForDetails(product)}
                      className="cursor-pointer"
                    >
                      <Eye size={15} />
                    </button>

                    <ActionMenu>
                      <MenuItem
                        icon={<History size={15} />}
                        label="History"
                        className="px-4 py-2! text-sm! rounded-none!"
                        onClick={() => setProductIdForHistory(product?.id)}
                      />
                      <MenuItem
                        icon={<Truck size={15} />}
                        label="Supplier"
                        className="px-4 py-2! text-sm! rounded-none!"
                        onClick={() => setProductIdIdForSupplier(product?.id)}
                      />
                      <MenuItem
                        icon={<Pencil size={15} />}
                        label="Edit"
                        className="px-4 py-2! text-sm! rounded-none!"
                        onClick={() => {
                          setSelectedProductForEdit(product);
                          setIsEditFormOpen(true);
                        }}
                      />
                      <MenuItem
                        icon={<Trash2 size={14} className="text-danger!" />}
                        label="Delete"
                        className="px-4 py-2! text-sm! rounded-none! border-t border-border"
                        danger
                        onClick={() => handleBulkDelete([product.id])}
                      />
                    </ActionMenu>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
