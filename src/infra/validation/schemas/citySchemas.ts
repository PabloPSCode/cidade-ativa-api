import { z } from 'zod';

export const createCitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  uf: z.string().min(1, 'UF is required'),
});

export const updateCitySchema = z.object({
  name: z.string().min(1).optional(),
  uf: z.string().min(1).optional(),
});
