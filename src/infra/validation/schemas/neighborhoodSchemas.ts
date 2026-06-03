import { z } from 'zod';
export const createNeighborhoodSchema = z.object({ name: z.string().min(1), cityId: z.string().uuid() });
export const updateNeighborhoodSchema = z.object({ name: z.string().min(1).optional(), cityId: z.string().uuid().optional() });
