import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  isCouncilman: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
  address: z.string().min(1),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  uf: z.string().min(2).max(2),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  neighborhood: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  uf: z.string().min(2).max(2).optional(),
});

export const authenticateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authenticateWithGoogleSchema = z.object({
  email: z.string().email(),
});
