import { z } from 'zod';

export const createVoteOptionSchema = z.object({
  optionText: z.string().min(1, 'Option text is required'),
  voteId: z.string().uuid(),
});

export const updateVoteOptionSchema = z.object({
  optionText: z.string().min(1).optional(),
  voteId: z.string().uuid().optional(),
});
