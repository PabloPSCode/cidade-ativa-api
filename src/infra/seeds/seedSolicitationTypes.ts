import { prisma } from '../database/prisma/prismaClient.js';
import type { Seed } from './SeedRunner.js';

const solicitationTypes: { description: string; points: number }[] = [
  { description: 'Buraco em via pública', points: 50 },
  { description: 'Lote sujo ou terreno abandonado', points: 30 },
  { description: 'Iluminação pública com defeito', points: 40 },
  { description: 'Calçada danificada ou irregular', points: 35 },
  { description: 'Entulho ou descarte irregular de resíduos', points: 45 },
  { description: 'Árvore com risco de queda', points: 60 },
  { description: 'Esgoto a céu aberto', points: 70 },
  { description: 'Alagamento ou drenagem insuficiente', points: 55 },
  { description: 'Sinalização de trânsito danificada', points: 40 },
  { description: 'Pichação em bem público', points: 20 },
  { description: 'Animal solto ou abandonado', points: 25 },
  { description: 'Poda de árvore necessária', points: 30 },
  { description: 'Vazamento de água em via pública', points: 65 },
  { description: 'Fossa ou sumidouro com problema', points: 50 },
  { description: 'Lixo acumulado em via pública', points: 35 },
];

export const seedSolicitationTypes: Seed = {
  name: 'Solicitation Types',

  async isPending() {
    const count = await prisma.solicitationType.count();
    return count === 0;
  },

  async run() {
    for (const type of solicitationTypes) {
      await prisma.solicitationType.upsert({
        where: { description: type.description },
        update: {},
        create: type,
      });
    }
  },
};
