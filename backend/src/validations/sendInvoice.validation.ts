import z from 'zod';

export const sendInvoiceSchema = z.object({
  to: z.string().email('Invalid email address'),
  invoiceNo: z.string().min(1, 'Invoice number is required'),
  partyName: z.string().min(1, 'Party name is required'),
  storeName: z.string().min(1, 'Store name is required').max(250),
});
