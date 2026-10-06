import { z } from 'zod';

export const userByEmailSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .max(100, 'User name must be less than 100 characters')
    .optional(),
  email: z.string().trim().email('Invalid email address').optional(),
  phone: z.string().trim().optional().optional(),
  address: z
    .string()
    .trim()
    .max(255, 'Address must be less than 255 characters')
    .optional(),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().trim(),
    newPassword: z.string().min(4, 'Password must be at least 4 characters'),
    confirmPassword: z.string().trim(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
