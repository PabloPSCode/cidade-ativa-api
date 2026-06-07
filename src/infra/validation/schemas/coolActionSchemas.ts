import { z } from 'zod';
export const createCoolActionSchema = z.object({
  solicitationTypeId: z.string().uuid(),
  solicitationId: z.string().uuid(),
});
export const updateCoolActionSchema = z.object({
  solicitationTypeId: z.string().uuid().optional(),
});
