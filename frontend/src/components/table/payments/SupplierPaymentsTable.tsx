'use client';

import clsx from 'clsx';
import Td from '../Td';
import Th from '../Th';
import Tr from '../Tr';
import { useSupplierPaymentsQuery } from '@/redux/feature/payment/supplierPaymentSlice';
import { useSearchParams } from 'next/navigation';
import Avatar from '@/components/shared/Avatar';
import formatPrice from '@/helpers/formatPrice';
import formatDate from '@/helpers/formatDate';
import Pagination from '../Pagination';

const COLUMNS = [
  { label: 'Supplier', align: 'left' },
  { label: 'Contact', align: 'left' },
  { label: 'Amount', align: 'left' },
  { label: 'PurchaseId', align: 'left' },
  { label: '  Method', align: 'left', },
  { label: 'Date', align: 'right', },
];

const SupplierPaymentsTable = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const { data: paymentData, isLoading } = useSupplierPaymentsQuery({ page })

  const payments = paymentData?.data.payments;
  const totalPage = paymentData?.data.totalPage || 1

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
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                  </span>
                </Th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {payments?.map(item => {
              return (
                <Tr key={item?.id}>
                  <Td>
                    <Avatar
                      name={item?.supplier?.name}
                      details={item?.supplier?.address}
                    />
                  </Td>
                  <Td className="flex flex-col">
                    <span>{item?.supplier?.email}</span>
                    <span className="text-xs">{item?.supplier?.phone}</span>
                  </Td>
                  <Td>{formatPrice(item.amount)}</Td>
                  <Td>{item.purchaseId}</Td>
                  <Td>{item.paymentMethod}</Td>
                  <Td className="text-right">{formatDate(item.createdAt)}</Td>
                </Tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!isLoading && <Pagination total={totalPage} />}
    </>
  );
};
export default SupplierPaymentsTable