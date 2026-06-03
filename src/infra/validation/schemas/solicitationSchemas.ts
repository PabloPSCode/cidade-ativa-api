import { z } from 'zod';

export const createSolicitationSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  uf: z.string().min(2).max(2),
  street: z.string().min(1),
  requestingUserId: z.string().uuid(),
  solicitationTypeId: z.string().uuid(),
  unsolvedImageUrls: z.array(z.string().url()).optional(),
  protocolNumber: z.string().optional(),
});

export const updateSolicitationSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  neighborhood: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  uf: z.string().min(2).max(2).optional(),
  street: z.string().min(1).optional(),
  status: z.enum(['not_resolved', 'in_progress', 'resolved', 'unconsidered']).optional(),
  solvedImageUrls: z.array(z.string().url()).optional(),
  solvedDate: z.coerce.date().optional(),
  solvedCommentary: z.string().optional(),
  solvedUserId: z.string().uuid().optional(),
});
