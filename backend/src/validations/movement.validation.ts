import { z } from 'zod';
import { StockMovementType } from '../generated/prisma/client.js';

export const createMovementSchema = z.object({
  productId: z
    .string({ message: 'Product ID is required' })
    .min(1, 'Product ID cannot be empty'),

  quantity: z
    .number({ message: 'Quantity is required' })
    .int('Quantity must be an integer')
    .positive('Quantity must be greater than 0'),

  type: z.nativeEnum(StockMovementType, {
    message: 'Invalid stock movement type',
  }),

  reason: z
    .string()
    .trim()
    .max(500, 'Reason must be less than 500 characters')
    .optional(),
});
