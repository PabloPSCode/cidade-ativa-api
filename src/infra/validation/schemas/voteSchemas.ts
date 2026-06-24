import { z } from 'zod';

export const createVoteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  pollId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const updateVoteSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  pollId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});
