import { prisma } from '../database/prisma/prismaClient.js';
import { getCurrentCityId } from '../database/prisma/cityContext.js';
import type { Seed } from './SeedRunner.js';

export const publicPhones: { institutionName: string; phone: string }[] = [
  { institutionName: 'Polícia Militar', phone: '190' },
  { institutionName: 'Defesa Civil', phone: '199' },
];

export const seedPublicPhones: Seed = {
  name: 'Public Phones',

  async isPending() {
    // No tenant city yet means nothing to attach reference data to.
    const cities = await prisma.city.count({ where: { deletedAt: null } });
    if (cities === 0) return false;
    const count = await prisma.publicPhone.count();
    return count === 0;
  },

  async run() {
    const cityId = await getCurrentCityId();
    await prisma.publicPhone.createMany({
      data: publicPhones.map((phone) => ({ ...phone, cityId })),
    });
  },
};
