import z from 'zod';
import { PaymentMethod } from '../generated/prisma/enums.js';

export const ReceivedPurchasePaymentSchema = z.object({
  purchaseId: z.string().min(1, 'Purchase ID is required'),
  amount: z.number().positive('Amount must be greater than zero'),
  paymentMethod: z.nativeEnum(PaymentMethod),
});
export const ReceivedSalePaymentSchema = z.object({
  saleId: z.string().min(1, 'Sale ID is required'),
  amount: z.number().positive('Amount must be greater than zero'),
  paymentMethod: z.nativeEnum(PaymentMethod),
});
