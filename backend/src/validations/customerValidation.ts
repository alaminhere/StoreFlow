import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().trim().min(2, 'Customer name is required'),
  phone: z.string().trim(),
  email: z.string().trim().email('Invalid email address'),
  address: z
    .string()
    .trim()
    .max(255, 'Address must be less than 255 characters'),
});

export const deleteCustomerSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one customer ID is required'),
});
