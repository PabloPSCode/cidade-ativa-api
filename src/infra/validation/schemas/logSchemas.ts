import { z } from 'zod/v4';

export const createLogSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  userName: z.string().min(1, 'userName is required'),
  email: z.string().email('Invalid email'),
  activityDescription: z.string().min(1, 'activityDescription is required'),
});

export const updateLogSchema = z.object({
  userId: z.string().min(1, 'userId is required').optional(),
  userName: z.string().min(1, 'userName is required').optional(),
  email: z.string().email('Invalid email').optional(),
  activityDescription: z
    .string()
    .min(1, 'activityDescription is required')
    .optional(),
});

export type CreateLogInput = z.infer<typeof createLogSchema>;
export type UpdateLogInput = z.infer<typeof updateLogSchema>;
