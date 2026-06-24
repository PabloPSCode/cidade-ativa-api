import { z } from 'zod';

export const createPublicPhoneSchema = z.object({
  institutionName: z.string().min(1, 'Institution name is required'),
  phone: z.string().min(1, 'Phone is required'),
});

export const updatePublicPhoneSchema = z.object({
  institutionName: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
});
