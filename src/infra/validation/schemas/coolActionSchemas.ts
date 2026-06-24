import { z } from 'zod';

export const coolActionCategorySchema = z.enum([
  'LIMPEZA_URBANA',
  'MEIO_AMBIENTE',
  'EDUCACAO',
  'BEM_ESTAR_ANIMAL',
  'ZELADORIA',
  'SEGURANCA_COMUNITARIA',
  'ENGAJAMENTO_COMUNITARIO',
]);

export const createCoolActionSchema = z.object({
  title: z.string().min(1),
  category: coolActionCategorySchema,
  points: z.number().int().positive(),
});

export const updateCoolActionSchema = z.object({
  title: z.string().min(1).optional(),
  category: coolActionCategorySchema.optional(),
  points: z.number().int().positive().optional(),
});
