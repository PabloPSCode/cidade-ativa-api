import { prisma } from '../database/prisma/prismaClient.js';
import type { Seed } from './SeedRunner.js';

const publicPhones: { institutionName: string; phone: string }[] = [
  { institutionName: 'Bombeiros', phone: '193' },
  { institutionName: 'Polícia Militar', phone: '190' },
  { institutionName: 'Prefeitura', phone: '156' },
  { institutionName: 'SAMU', phone: '192' },
  { institutionName: 'Defesa Civil', phone: '199' },
  { institutionName: 'Guarda Municipal', phone: '153' },
];

export const seedPublicPhones: Seed = {
  name: 'Public Phones',

  async isPending() {
    const count = await prisma.publicPhone.count();
    return count === 0;
  },

  async run() {
    for (const entry of publicPhones) {
      await prisma.publicPhone.upsert({
        where: { phone: entry.phone },
        update: {},
        create: entry,
      });
    }
  },
};
