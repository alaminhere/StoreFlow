'use client';

import clsx from 'clsx';
import Td from '../Td';
import Th from '../Th';
import Tr from '../Tr';
import { useSearchParams } from 'next/navigation';
import Avatar from '@/components/shared/Avatar';
import formatPrice from '@/helpers/formatPrice';
import formatDate from '@/helpers/formatDate';
import Pagination from '../Pagination';
import { useCustomerPaymentsQuery } from '@/redux/feature/payment/customerPaymentSlice';

const COLUMNS = [
  { label: 'Customer', align: 'left' },
  { label: 'Contact', align: 'left' },
  { label: 'Amount', align: 'left' },
  { label: 'SaleId', align: 'left' },
  { label: '  Method', align: 'left', },
  { label: 'Date', align: 'right', },
];

const CustomerPaymentsTable = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const { data: paymentData, isLoading } = useCustomerPaymentsQuery({ page })

  const payment = paymentData?.data.customerPayment
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
                  <span
                    className='inline-flex items-center gap-1'
                  >
                    {col.label}
                  </span>
                </Th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {payment?.map(item => {
              return (
                <Tr key={item?.id}>
                  <Td>
                    <Avatar name={item?.customer?.name} details={item?.customer?.address} />
                  </Td>
                  <Td className="flex flex-col">
                    <span>{item?.customer?.email}</span>
                    <span className="text-xs">{item?.customer?.phone}</span>
                  </Td>
                  <Td>{formatPrice(item.amount)}</Td>
                  <Td>{item.saleId}</Td>
                  <Td>{item.paymentMethod}</Td>
                  <Td className='text-right'>{formatDate(item.createdAt)}</Td>
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
export default CustomerPaymentsTable