'use client';
import { Sales } from '@/types/sales.type';
import PopupModal from '../PopupModal';
import Avatar from '../Avatar';
import formatDate from '@/helpers/formatDate';
import Button from '@/components/ui/button';
import { useGetStoreQuery } from '@/redux/feature/storeSlice';
import useInvoiceActions from '@/helpers/invoice/useInvoiceActions';

interface Props {
  invoice: Sales | null;
  setInvoice: React.Dispatch<React.SetStateAction<Sales | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

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
const SaleInvoice = ({ open, invoice, setOpen, setInvoice }: Props) => {
  const { data: storeData } = useGetStoreQuery();
  const store = storeData?.data;

  const { downloadInvoice, sendInvoiceByEmail, isSending } = useInvoiceActions({
    type: 'sale',
    store,
    data: invoice,
  });

  return (
    <>
      {open && (
        <PopupModal
          className="max-w-2xl"
          onClose={() => {
            setOpen(false);
            setInvoice(null);
          }}
          label="download invoice"
        >
          <div className="w-full p-5">
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-5 mb-6">
              <div className="w-full">
                <p className={styles.label}>CUSTOMER</p>
                <div className="w-full rounded-lg border border-border bg-surface px-4 mt-2 py-3">
                  <Avatar
                    name={invoice?.customer.name}
                    details={invoice?.customer?.email}
                  />
                </div>
              </div>
            </div>
            {/* Date / Payment */}
            <div className="flex flex-wrap justify-between gap-4 bg-accent-bg px-4 py-2 mb-3 rounded-md">
              <div>
                <p className={styles.rowLabel}>Purchase Date</p>
                <p className={styles.valueTitle}>
                  {formatDate(invoice?.createdAt) || 'N/A'}
                </p>
              </div>
              <div>
                <p className={styles.rowLabel}>Method</p>
                <p className={styles.valueTitle}>
                  {invoice?.paymentMethod || 'N/A'}
                </p>
              </div>
              <div>
                <p className={styles.rowLabel}>Status</p>
                <span
                  className={`capitalize p12 ${invoice?.due === 0
                    ? 'text-success bg-successBg'
                    : 'text-warning bg-warningBg'
                    }`}
                >
                  {invoice?.due === 0 ? 'Paid' : 'Due'}
                </span>
              </div>
            </div>
            {/* Items */}
            <div className="overflow-x-auto mb-6">
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
                  {invoice?.items?.map(item => (
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
            {/* Totals */}
            <div className="flex justify-end mb-6 ">
              <div className="w-full max-w-sm">
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal</span>
                  <span className={styles.summaryValue}>
                    ৳{invoice?.subtotal ?? 0}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Discount</span>
                  <span className="p14 text-danger">
                    − ৳{invoice?.discount ?? 0}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t border-border mt-1">
                  <span className={styles.summaryLabel}> Total</span>
                  <span className={styles.summaryValue}>
                    ৳{invoice?.total ?? 0}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className="p14 text-success">Paid</span>
                  <span className="p14 text-success">
                    ৳{invoice?.paid ?? 0}
                  </span>
                </div>
                {invoice?.due ? (
                  <div className="flex justify-between items-center px-3 py-2 mt-2 bg-warning-bg">
                    <span className="p14 text-warning"> Due</span>
                    <span className={styles.summaryValue}>৳{invoice?.due}</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className=" flex justify-end gap-5 pt-5 border-t border-border">
              <Button
                onClick={downloadInvoice}
                variant="secondary"
                className="w-fit"
              >
                Download Invoice
              </Button>
              <Button
                disabled={isSending}
                loading={isSending}
                onClick={sendInvoiceByEmail}
                variant="secondary" className="w-fit">
                Email Invoice
              </Button>
            </div>
          </div>
        </PopupModal>
      )}
    </>
  );
};

export default SaleInvoice;
