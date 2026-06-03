import { z } from 'zod';

export const createPublicPhoneSchema = z.object({
  phone: z.string().min(1, 'Phone is required'),
});

export const updatePublicPhoneSchema = z.object({
  phone: z.string().min(1).optional(),
});
