import { z } from 'zod';
export const createCitySchema = z.object({
  name: z.string().min(1),
  ufId: z.string().uuid(),
});
export const updateCitySchema = z.object({
  name: z.string().min(1).optional(),
  ufId: z.string().uuid().optional(),
});
