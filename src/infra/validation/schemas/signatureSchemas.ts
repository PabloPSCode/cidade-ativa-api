import { z } from 'zod';

export const createSignatureSchema = z.object({
  imageUrl: z.string().min(1, 'Image URL is required'),
  userName: z.string().min(1, 'User name is required'),
  userId: z.string().uuid(),
  solicitationId: z.string().uuid().optional(),
});

// Para assinar uma solicitação: a imagem/nome vêm da assinatura já registrada
// do usuário, então só userId e solicitationId são necessários.
export const createSolicitationSignatureSchema = z.object({
  userId: z.string().uuid(),
  solicitationId: z.string().uuid(),
});
