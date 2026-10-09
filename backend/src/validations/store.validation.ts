import z from 'zod';

export const logoSchema = z.object({
  url: z.string().url('Invalid logo URL'),
  public_id: z.string().min(1, 'Invalid logo URL'),
});

export const createStoreSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Store name is required')
    .max(100, 'Store name must be less than 100 characters'),
  email: z.string().trim().email('Invalid email address'),
  phone: z.string(),
  logo: logoSchema,
  tagline: z
    .string()
    .trim()
    .max(200, 'Tagline must be less than 200 characters'),
  address: z
    .string()
    .trim()
    .max(255, 'Address must be less than 255 characters'),
  invoiceFooterNote: z
    .string()
    .trim()
    .max(255, 'Footer Note must be less than 255 characters')
    .optional(),
});

export const storeUpdateSchema = createStoreSchema.partial();
export const openStoreSchema = z.object({
  storeId: z.string().trim().min(1, 'Store ID is required'),
});
