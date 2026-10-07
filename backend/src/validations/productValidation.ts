import { z } from 'zod';

export const logoSchema = z.object({
  url: z.string().url('Invalid logo URL'),
  public_id: z.string().min(1, 'Logo public ID is required'),
});

export const createProductSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .trim()
    .max(200, 'Name must be less than 200 characters'),
  image: logoSchema,
  sku: z
    .string({ message: 'SKU is required' })
    .trim()
    .min(1, 'SKU is required')
    .max(50, 'SKU must be less than 50 characters'),
  barcode: z.string().trim().max(50, 'Barcode must be less than 50 characters'),
  category: z.string({ message: 'Category is required' }).trim(),
  brand: z.string({ message: 'Brand is required' }).trim(),
  description: z
    .string()
    .trim()
    .max(1000, 'Description must be less than 1000 characters'),
  price: z
    .number({ message: 'Price is required' })
    .positive('Price must be positive')
    .max(9999999999.99, 'Price is too large'),
  sellingPrice: z
    .number({ message: 'Selling price is required' })
    .positive('Selling price must be positive')
    .max(9999999999.99, 'Selling price is too large'),
  stock: z
    .number({ message: 'Stock is required' })
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative'),
  minimumStockLevel: z
    .number()
    .int('Minimum stock level must be an integer')
    .min(0, 'Minimum stock level cannot be negative')
    .default(0),
});
export const updateProductSchema = createProductSchema.partial();

export const deleteProductSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one Product Id is required'),
});
