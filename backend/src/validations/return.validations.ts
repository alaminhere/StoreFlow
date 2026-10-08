import { z } from 'zod';
import { ReturnType, ReturnCondition } from '../generated/prisma/client.js';

const returnItemSchema = z.object({
  productId: z.string({ message: 'Product ID is required' }).min(1),
  quantity: z.number().int().positive('Quantity must be positive'),
});

export const createReturnSchema = z.object({
  type: z.nativeEnum(ReturnType, { message: 'Invalid return type' }),
  referenceId: z.string({ message: 'Reference ID is required' }).min(1),
  reason: z.string({ message: 'Reason is required' }).trim().min(2).max(500),
  condition: z.nativeEnum(ReturnCondition, {
    message: 'Invalid condition',
  }),
  items: z.array(returnItemSchema).min(1, 'At least one item is required'),
});
