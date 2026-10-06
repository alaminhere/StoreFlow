import Avatar from '@/components/shared/Avatar';
import DetailsModel from '../DetailsModel';
import InfoCard from '../InfoCard';
import HistoryCard from '../HistoryCard';

import formatDate from '@/helpers/formatDate';
import { Customer } from '@/types/customer.types';
import { useSingleCustomerPaymentsQuery } from '@/redux/feature/payment/customerPaymentSlice';

type ProductDetailsPanelProps = {
  customer: Customer | null;
  setCustomer: (customer: Customer | null) => void;
};

const CustomerDetailsPanel = ({
  customer,
  setCustomer,
}: ProductDetailsPanelProps) => {
  const id = customer?.id;

  const { data } = useSingleCustomerPaymentsQuery(id!, {
    skip: !id,
  });
  const CUSTOMER_PAYMENT = data?.data ?? [];

  return (
    <DetailsModel
      label="Customer Details"
      onClose={() => setCustomer(null)}
      open={!!customer}
    >
      {/* supplier details  */}
      <div className="space-y-3 p-5">
        <Avatar name={customer?.name} details={customer?.name} />
        <div className="flex flex-col md:flex-row gap-3 mt-5">
          <InfoCard label="Supplier Email" value={customer?.email ?? ''} />
          <InfoCard label="Supplier Phone" value={customer?.phone ?? ''} />
        </div>
        <InfoCard label="Supplier Address" value={customer?.address ?? ''} />
        <div className="flex flex-col md:flex-row gap-3">
          <InfoCard label="Total Purchases" value={customer?.totalSale ?? ''} />
          <InfoCard
            label="Total Paid"
            className="text-success!"
            value={customer?.totalPaid ?? ''}
          />
          <InfoCard
            label="Total Due"
            className="text-warning!"
            value={customer?.totalDue ?? ''}
          />
        </div>
        {/* Customer payment history */}{' '}
        <h4 className="mt-5">Payment History</h4>
        <div className=" space-y-3">
          {CUSTOMER_PAYMENT.map(item => (
            <HistoryCard
              key={item.id}
              amount={item.amount}
              date={formatDate(item.createdAt)}
              historyId={`SaleID #${item.saleId}`}
            />
          ))}
        </div>
      </div>
    </DetailsModel>
  );
};

export default CustomerDetailsPanel;
