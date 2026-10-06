import { InvoiceStatus } from '@/types/invoice.types';

const getInvoiceStatus = (paid: number, due: number): InvoiceStatus => {
  if (due === 0) return 'paid';

  if (paid > 0 && due > 0) {
    return 'partial';
  }

  return 'due';
};
export default getInvoiceStatus;
