import { z } from 'zod';

export const createDoneCoolActionSchema = z.object({
  userId: z.string().uuid(),
  description: z.string().min(1),
  neighborhood: z.string().min(1),
  street: z.string().min(1),
  actionPhotoURL: z.string().min(1),
  coolActionId: z.string().uuid(),
});

export const updateDoneCoolActionSchema = z.object({
  description: z.string().min(1).optional(),
  neighborhood: z.string().min(1).optional(),
  street: z.string().min(1).optional(),
  actionPhotoURL: z.string().min(1).optional(),
  coolActionId: z.string().uuid().optional(),
});
