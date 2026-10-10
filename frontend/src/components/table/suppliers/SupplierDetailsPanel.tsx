'use client';

import InfoCard from '../InfoCard';
import DetailsModel from '../DetailsModel';
import HistoryCard from '../HistoryCard';
import formatDate from '@/helpers/formatDate';
import Avatar from '@/components/shared/Avatar';

import { useSingleSupplierPaymentsQuery } from '@/redux/feature/payment/supplierPaymentSlice';
import { Supplier } from '@/types/supplier.types';

type ProductDetailsPanelProps = {
  supplier: Supplier | null;
  setSupplier: (supplier: Supplier | null) => void;
};

const SupplierDetailsPanel = ({
  supplier,
  setSupplier,
}: ProductDetailsPanelProps) => {
  const id = supplier?.id;

  // fetch supplier payment history
  const { data: supplierP } = useSingleSupplierPaymentsQuery(id!, {
    skip: !id,
  });
  const SUPPLIER_PAYMENT = supplierP?.data ?? [];
  return (
    <DetailsModel
      label="Supplier Details"
      onClose={() => setSupplier(null)}
      open={!!supplier}
    >
      <div className="space-y-3 p-5">
        <Avatar name={supplier?.name} details={supplier?.shopName} />
        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <InfoCard label="Supplier Email" value={supplier?.email ?? ''} />

          <InfoCard label="Supplier Phone" value={supplier?.phone ?? ''} />
        </div>
        <InfoCard label="Supplier Address" value={supplier?.address ?? ''} />
        <div className="flex flex-col gap-3 md:flex-row">
          <InfoCard
            label="Total Purchases"
            value={supplier?.totalPurchase ?? ''}
          />
          <InfoCard
            label="Total Paid"
            className="text-success!"
            value={supplier?.totalPaid ?? ''}
          />
          <InfoCard
            label="Total Due"
            className="text-warning!"
            value={supplier?.totalDue ?? ''}
          />
        </div>
        <h4 className="mt-5">Payment History</h4>
        <div className="space-y-3">
          {SUPPLIER_PAYMENT?.map(item => (
            <HistoryCard
              key={item.id}
              amount={item.amount}
              date={formatDate(item.createdAt)}
              historyId={`PurchaseID #${item.purchaseId}`}
            />
          ))}
        </div>
      </div>
    </DetailsModel>
  );
};

export default SupplierDetailsPanel;
