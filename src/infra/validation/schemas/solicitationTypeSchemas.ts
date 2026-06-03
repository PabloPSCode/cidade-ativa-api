import { z } from 'zod';

export const createSolicitationTypeSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  points: z.number().int().min(0, 'Points must be non-negative'),
});

export const updateSolicitationTypeSchema = z.object({
  description: z.string().min(1).optional(),
  points: z.number().int().min(0).optional(),
});
