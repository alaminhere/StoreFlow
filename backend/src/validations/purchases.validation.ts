import { z } from 'zod';
import { PaymentMethod } from '../generated/prisma/enums.js';

const MAX_AMOUNT = 9999999999.99;

export const purchaseItemSchema = z
  .object({
    productName: z.string().trim().min(1, 'Product name is required'),
    productId: z.string().trim().min(1, 'Product ID is required'),
    quantity: z.number().int().positive('Quantity must be at least 1'),
    price: z
      .number({ message: 'Price is required' })
      .positive('Price must be positive')
      .max(MAX_AMOUNT, 'Price is too large'),
    total: z.number().nonnegative().max(MAX_AMOUNT, 'Total is too large'),
  })
  .refine(i => i.total === i.quantity * i.price, {
    message: 'Item total must equal quantity × price',
    path: ['total'],
  });

export const createPurchaseSchema = z
  .object({
    supplierId: z.string().trim().min(1, 'supplier is required'),
    dueDate: z
      .string()
      .datetime({ message: 'Invalid date format' })
      .or(z.literal('')),
    items: z.array(purchaseItemSchema).min(1, 'At least one item is required'),
    paymentMethod: z.nativeEnum(PaymentMethod, {
      message: 'Payment method must be CASH, BANK_TRANSFER, BKASH, or CARD',
    }),
    subtotal: z.number().positive().max(MAX_AMOUNT, 'Subtotal is too large'),
    discount: z
      .number()
      .nonnegative()
      .max(MAX_AMOUNT, 'Discount is too large')
      .default(0),
    total: z.number().nonnegative().max(MAX_AMOUNT, 'Total is too large'),
    paid: z.number().nonnegative().max(MAX_AMOUNT, 'Paid amount is too large'),
  })
  .refine(d => d.discount <= d.subtotal, {
    message: 'Discount cannot exceed subtotal',
    path: ['discount'],
  })
  .refine(d => d.total === d.subtotal - d.discount, {
    message: 'Total must equal subtotal minus discount',
    path: ['total'],
  })
  .refine(d => d.paid <= d.total, {
    message: 'Paid amount cannot exceed total',
    path: ['paid'],
  })
  .refine(d => new Set(d.items.map(i => i.productId)).size === d.items.length, {
    message: 'Duplicate products in items',
    path: ['items'],
  });
