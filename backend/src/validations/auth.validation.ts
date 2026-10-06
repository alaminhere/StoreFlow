import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().trim().email('Invalid email address'),
    phone: z.string(),
    password: z.string().min(4, 'Password must be at least 4 characters'),
    confirmPassword: z.string(),
    agree: z.boolean(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const signinSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only 6 digits'),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(4, 'Password must be at least 4 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
});
