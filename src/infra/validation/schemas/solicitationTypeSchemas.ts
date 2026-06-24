import { z } from 'zod';

export const createSolicitationTypeSchema = z.object({
  description: z.string().min(1, 'Description is required'),
});

export const updateSolicitationTypeSchema = z.object({
  description: z.string().min(1).optional(),
});
