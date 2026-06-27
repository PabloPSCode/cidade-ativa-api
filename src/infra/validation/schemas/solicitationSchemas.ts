import { z } from 'zod';

export const createSolicitationSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  neighborhood: z.string().min(1),
  street: z.string().min(1),
  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP must be in the format 00000-000'),
  requestingUserId: z.string().uuid(),
  solicitationTypeId: z.string().uuid(),
  isCollective: z.boolean().optional(),
  unsolvedImageUrls: z.array(z.string().min(1)).optional(),
});

export const updateSolicitationSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  neighborhood: z.string().min(1).optional(),
  street: z.string().min(1).optional(),
  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP must be in the format 00000-000')
    .optional(),
  status: z
    .enum([
      'waiting_approval',
      'not_resolved',
      'in_progress',
      'resolved',
      'unconsidered',
    ])
    .optional(),
  isCollective: z.boolean().optional(),
  solvedImageUrls: z.array(z.string().min(1)).optional(),
  solvedDate: z.coerce.date().optional(),
  solvedCommentary: z.string().optional(),
  solvedUserId: z.string().uuid().optional(),
});

export const solveSolicitationSchema = z.object({
  solvedImageUrls: z.array(z.string().min(1)).min(1),
  solvedCommentary: z.string().optional(),
  solvedUserId: z.string().uuid().optional(),
});
