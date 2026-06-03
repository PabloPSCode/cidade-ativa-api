import { z } from 'zod';
export const createDoneCoolActionSchema = z.object({ userId: z.string().uuid(), coolActionId: z.string().uuid(), solicitationId: z.string().uuid() });
export const updateDoneCoolActionSchema = z.object({ coolActionId: z.string().uuid().optional() });
