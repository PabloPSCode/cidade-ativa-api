import { z } from 'zod';

export const pollStatusSchema = z.enum(['active', 'inactive', 'finished']);

export const createPollSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  pollCoverUrl: z.string().min(1, 'Poll cover URL is required'),
  startedAt: z.coerce.date().optional(),
  finishedAt: z.coerce.date().optional(),
  status: pollStatusSchema.optional(),
});

export const updatePollSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  pollCoverUrl: z.string().min(1).optional(),
  startedAt: z.coerce.date().optional(),
  finishedAt: z.coerce.date().optional(),
  status: pollStatusSchema.optional(),
});
