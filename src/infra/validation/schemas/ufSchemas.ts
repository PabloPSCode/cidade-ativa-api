import { z } from 'zod';
export const createUFSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});
export const updateUFSchema = z.object({ name: z.string().min(1).optional() });
