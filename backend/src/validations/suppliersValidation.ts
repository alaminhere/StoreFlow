import { z } from 'zod';

export const createSupplierSchema = z.object({
  name: z.string({ message: 'Name is required' }),
  shopName: z
    .string()
    .trim()
    .max(100, 'Shop name must be less than 100 characters'),
  phone: z.string({ message: 'Phone is required' }).trim(),
  email: z.string().trim().email('Invalid email address'),
  address: z
    .string()
    .trim()
    .max(500, 'Address must be less than 500 characters'),
});

export const deleteSupplierSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one brand ID is required'),
});
