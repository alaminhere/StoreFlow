import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, 'Brand name is required'),
});

export const deleteCategorySchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one brand ID is required'),
});
