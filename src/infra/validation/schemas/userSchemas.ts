import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  isCouncilman: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  // Cidade e UF são obrigatórias no cadastro de um novo usuário.
  city: z.string().min(1, 'Cidade é obrigatória'),
  uf: z.string().min(2, 'UF é obrigatória').max(2),
  // Tenant (cidade) escolhido no cadastro — também obrigatório para vincular o
  // usuário à cidade correta (do contrário cairia na cidade padrão).
  cityId: z.string().min(1, 'Cidade é obrigatória'),
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
