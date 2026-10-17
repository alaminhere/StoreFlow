'use client';

import Avatar from '@/components/shared/Avatar';
import Button from '@/components/ui/button';
import handleAlert from '@/helpers/handleAlert';

import DetailsModel from '../DetailsModel';
import formatDate from '@/helpers/formatDate';
import getInvoiceStatus from '@/helpers/InvoiceStatus';

import { useGetStoreQuery } from '@/redux/feature/storeSlice';
import { Sales } from '@/types/sales.type';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import { PaymentMethod } from '@/types/payment.types';
import HistoryCard from '../HistoryCard';
import {
  useSaleReceivedPaymentMutation,
  useSingleSalePaymentsQuery,
} from '@/redux/feature/payment/customerPaymentSlice';
import useInvoiceActions from '@/helpers/invoice/useInvoiceActions';

const styles = {
  label: 'p12 text-text',
  value: 'p12',
  valueTitle: 'p12 text-text',
  rowLabel: 'p12 text-text',
  cell: 'px-3 py-2 p12',
  cellCenter: 'text-center p12',
  cellRight: 'text-right p12',
  summaryRow: 'flex justify-between py-1',
  summaryLabel: 'p14 text-text',
  summaryValue: 'p14',
  th: 'py-2.5 px-3 p12 text-text',
};

type ProductDetailsPanelProps = {
  sales: Sales | null;
  setSales: (sales: string | null) => void;
};
const PAYMENT_METHODS = ['CASH', 'BANK_TRANSFER', 'BKASH', 'CARD'];

const SaleDetailsPanel = ({ sales, setSales }: ProductDetailsPanelProps) => {
  const id = sales?.id;
  const [saleReceivedPayment] = useSaleReceivedPaymentMutation();
  const { data: storeData } = useGetStoreQuery();
  const { data: saleData } = useSingleSalePaymentsQuery(id!, {
    skip: !id,
  });
  const store = storeData?.data;
  const salePayment = saleData?.data ?? [];

  const { downloadInvoice, sendInvoiceByEmail, isSending } = useInvoiceActions({
    type: 'sale',
    store,
    data: sales,
  });

  //   Submit received payment
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const receivedAmount = Number(formData.getAll('amount'));
    const paymentMethod = formData.get('method') as string;
    if (receivedAmount <= 0) {
      handleAlert(false, 'Received amount must be greater than 0');
      return;
    }

    const payload = {
      saleId: sales?.id ?? '',
      amount: receivedAmount,
      paymentMethod: paymentMethod as PaymentMethod,
    };

    try {
      const res = await saleReceivedPayment(payload).unwrap();
      if (!res) return;
      handleAlert(res.success, res.message);
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <DetailsModel
      label={`SALE ID : #${sales?.id}`}
      onClose={() => setSales(null)}
      open={!!sales}
    >
      <div className="w-full p-5"> 
        <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row">
          <div className="w-full">
            <p className={styles.label}>SUPPLIER</p> 
            <div className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3">
              <Avatar
                name={sales?.customer?.name}
                details={sales?.customer?.email}
              />
            </div>
          </div>
        </div> 
        <div className="mb-3 flex flex-wrap justify-between gap-4 rounded-md bg-accent-bg px-4 py-2">
          <div>
            <p className={styles.rowLabel}>Purchase Date</p> 
            <p className={styles.valueTitle}>
              {formatDate(sales?.createdAt) || 'N/A'}
            </p>
          </div> 
          <div>
            <p className={styles.rowLabel}>Method</p>
            <p className={styles.valueTitle}>{sales?.paymentMethod || 'N/A'}</p>
          </div>
          <div>
            <p className={styles.rowLabel}>Status</p>
            <span
              className={`capitalize p12 ${
                sales?.due === 0
                  ? 'text-success bg-successBg'
                  : 'text-warning bg-warningBg'
              }`}
            >
              {getInvoiceStatus(sales?.paid ?? 0, sales?.due ?? 0)}
            </span>
          </div>
        </div>

        {/* items */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className={`text-left ${styles.th}`}>ITEM</th>
                <th className={`text-center ${styles.th}`}>QTY</th>
                <th className={`text-right ${styles.th}`}>PRICE</th>
                <th className={`text-right ${styles.th}`}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {sales?.items?.map(item => (
                <tr key={item.id} className="border-b border-border">
                  <td className={styles.cell}>{item.productName}</td>
                  <td className={styles.cellCenter}>{item.quantity}</td>
                  <td className={styles.cellRight}>৳{item.price}</td>
                  <td className={styles.cellRight}>৳{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* totals */}
        <div className="mb-6 flex justify-end">
          <div className="w-full">
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Subtotal</span>
              <span className={styles.summaryValue}>
                ৳{sales?.subtotal ?? 0}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Discount</span>
              <span className="p14 text-danger">− ৳{sales?.discount ?? 0}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-border py-2">
              <span className={styles.summaryLabel}>Total</span>
              <span className={styles.summaryValue}>৳{sales?.total ?? 0}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className="p14 text-success">Paid</span>
              <span className="p14 text-success">৳{sales?.paid ?? 0}</span>
            </div>
            {sales?.due ? (
              <div className="mt-2 flex items-center justify-between bg-warning-bg px-3 py-2">
                <span className="p14 text-warning">Due</span>
                <span className={styles.summaryValue}>৳{sales?.due}</span>
              </div>
            ) : null}
          </div>
        </div>
        {/* record payment */}
        {sales?.due ? (
          <div className="mt-10 w-full flex-1 border-t border-border pt-5 md:max-w-md">
            <h4 className="mb-3">Pay Now</h4>

            <form onSubmit={onSubmit}>
              <div className="mb-3 grid grid-cols-2 gap-3">
                <Input
                  label="Received amount "
                  type="number"
                  name="amount"
                  defaultValue={0}
                />
                <Select
                  label="Payment method"
                  name="method"
                  placeholder="Select payment method"
                >
                  {PAYMENT_METHODS.map(method => (
                    <option
                      key={method}
                      value={method}
                      className="bg-surface text-text-muted!"
                    >
                      {method}
                    </option>
                  ))}
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Confirm payment
              </Button>
            </form>
          </div>
        ) : null}
        {/* invoice actions */}
        <div className="grid grid-cols-2 gap-3 border-t border-border pt-5">
          <Button
            onClick={downloadInvoice}
            variant="secondary"
            className="w-full"
          >
            Download Invoice
          </Button>
          <Button
            disabled={isSending}
            loading={isSending}
            onClick={sendInvoiceByEmail}
            variant="secondary"
            className="w-full"
          >
            Email Invoice
          </Button>
        </div>
        {/* supplier payment history */}
        <h4 className="my-5 border-t border-border pt-5">Payment History</h4>
        <div className="space-y-3">
          {salePayment.map(item => (
            <HistoryCard
              key={item.id}
              amount={item.amount}
              paymentMethod={item.paymentMethod}
              date={formatDate(item.createdAt)}
              historyId={`SaleID #${item.saleId}`}
            />
          ))}
        </div>
      </div>
    </DetailsModel>
  );
};

export default SaleDetailsPanel;
