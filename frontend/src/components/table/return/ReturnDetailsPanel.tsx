import Avatar from '@/components/shared/Avatar';
import DetailsModel from '../DetailsModel';
import InfoCard from '../InfoCard';
import { Return } from '@/types/return.types';
import formatDate from '@/helpers/formatDate';
import getInvoiceStatus from '@/helpers/InvoiceStatus';
import Button from '@/components/ui/button';
import useInvoiceActions from '@/helpers/invoice/useInvoiceActions';
import { useGetStoreQuery } from '@/redux/feature/storeSlice';
import { useEffect, useState } from 'react';
import { InvoiceStore } from '@/types/invoice.types';
import handleAlert from '@/helpers/handleAlert';

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
  returnData: Return | null;
  setReturnData: (returnData: Return | null) => void;
};
interface InvoiceState {
  type: 'sale' | 'purchase';
  store: InvoiceStore;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const ReturnDetailsPanel = ({
  returnData,
  setReturnData,
}: ProductDetailsPanelProps) => {
  const { data: storeData } = useGetStoreQuery();
  const store = storeData?.data;

  const type = returnData?.party.shopName ? 'Supplier ' : 'Customer';
  const [invoiceState, setInvoiceState] = useState<InvoiceState | null>(null);

  const { downloadInvoice, sendInvoiceByEmail, isSending } = useInvoiceActions({
    type: invoiceState?.type ?? 'sale',
    store: invoiceState?.store ?? null,
    data: invoiceState?.data ?? null,
  });

  useEffect(() => {
    if (!store || !returnData?.party?.name) return;

    const { type, party, ...invoiceRest } = returnData;
    const { shopName, ...partyRest } = party;
    const isSaleReturn = type === 'SALE_RETURN';

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInvoiceState({
      data: {
        ...invoiceRest,
        ...(isSaleReturn
          ? { customer: { ...partyRest } }
          : { supplier: { ...partyRest, shopName } }),
      },
      type: isSaleReturn ? 'sale' : 'purchase',
      store,
    });
  }, [returnData, store]);

  const handleDownload = () => {
    if (!invoiceState) {
      handleAlert(false, 'Invoice data not ready');
      return;
    }
    downloadInvoice();
  };

  const handleSendEmail = async () => {
    if (!invoiceState) {
      handleAlert(false, 'Invoice data not ready');
      return;
    }
    sendInvoiceByEmail();
  };

  return (
    <DetailsModel
      label="Return Details"
      onClose={() => setReturnData(null)}
      open={!!returnData}
    >
      {/* supplier details  */}
      <div className="space-y-3 p-5">
        <Avatar
          name={returnData?.party.name}
          details={returnData?.party.email}
        />
        <div className="flex flex-col md:flex-row gap-3 mt-5">
          <InfoCard
            label={`${type} Email`}
            value={returnData?.party.email ?? ''}
          />
          <InfoCard
            label={`${type} Phone`}
            value={returnData?.party.phone ?? ''}
          />
        </div>
        <InfoCard
          label={`${type} Address`}
          value={returnData?.party.address ?? ''}
        />
        {/* date / payment */}
        <div className="mb-3 flex flex-wrap justify-between gap-4 rounded-md bg-accent-bg px-4 py-2">
          <div>
            <p className={styles.rowLabel}>Purchase Date</p>
            <p className={styles.valueTitle}>
              {formatDate(returnData?.createdAt) || 'N/A'}
            </p>
          </div>
          <div>
            <p className={styles.rowLabel}>Method</p>
            <p className={styles.valueTitle}>
              {returnData?.paymentMethod || 'N/A'}
            </p>
          </div>
          <div>
            <p className={styles.rowLabel}>Status</p>
            <span
              className={`capitalize p12 ${returnData?.due === 0
                ? 'text-success bg-successBg'
                : 'text-warning bg-warningBg'
                }`}
            >
              {getInvoiceStatus(returnData?.paid ?? 0, returnData?.due ?? 0)}
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
              {returnData?.items?.map(item => (
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
                ৳{returnData?.subtotal ?? 0}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Discount</span>
              <span className="p14 text-danger">
                − ৳{returnData?.discount ?? 0}
              </span>
            </div>
            <div className="mt-1 flex justify-between border-t border-border py-2">
              <span className={styles.summaryLabel}>Total</span>
              <span className={styles.summaryValue}>
                ৳{returnData?.total ?? 0}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className="p14 text-success">Paid</span>
              <span className="p14 text-success">৳{returnData?.paid ?? 0}</span>
            </div>
            {returnData?.due ? (
              <div className="mt-2 flex items-center justify-between bg-warning-bg px-3 py-2">
                <span className="p14 text-warning">Due</span>

                <span className={styles.summaryValue}>৳{returnData?.due}</span>
              </div>
            ) : null}
          </div>
        </div>
        {/* invoice Actions */}
        <div className="grid grid-cols-2 gap-3 border-t border-border pt-5">
          <Button
            onClick={handleDownload}
            variant="secondary"
            className="w-full"
          >
            Download Invoice
          </Button>
          <Button
            loading={isSending}
            disabled={isSending}
            onClick={handleSendEmail}
            variant="secondary"
            className="w-full"
          >
            Email Invoice
          </Button>
        </div>
      </div>
    </DetailsModel>
  );
};

export default ReturnDetailsPanel;
