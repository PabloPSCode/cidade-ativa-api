import { z } from 'zod/v4';
export declare const createLogSchema: z.ZodObject<{
    userId: z.ZodString;
    userName: z.ZodString;
    email: z.ZodString;
    activityDescription: z.ZodString;
}, z.core.$strip>;
export declare const updateLogSchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodString>;
    userName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    activityDescription: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateLogInput = z.infer<typeof createLogSchema>;
export type UpdateLogInput = z.infer<typeof updateLogSchema>;
