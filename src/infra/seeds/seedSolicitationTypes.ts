import { prisma } from '../database/prisma/prismaClient.js';
import type { Seed } from './SeedRunner.js';

const solicitationTypes: { description: string }[] = [
  { description: 'Buraco em via pública' },
  { description: 'Lote sujo ou terreno abandonado' },
  { description: 'Iluminação pública com defeito' },
  { description: 'Calçada danificada ou irregular' },
  { description: 'Entulho ou descarte irregular de resíduos' },
  { description: 'Árvore com risco de queda' },
  { description: 'Esgoto a céu aberto' },
  { description: 'Alagamento ou drenagem insuficiente' },
  { description: 'Sinalização de trânsito danificada' },
  { description: 'Pichação em bem público' },
  { description: 'Animal solto ou abandonado' },
  { description: 'Poda de árvore necessária' },
  { description: 'Vazamento de água em via pública' },
  { description: 'Fossa ou sumidouro com problema' },
  { description: 'Lixo acumulado em via pública' },
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
