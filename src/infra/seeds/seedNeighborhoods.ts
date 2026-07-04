import { prisma } from '../database/prisma/prismaClient.js';
import { CityNeighborhoodsSeeder } from './CityNeighborhoodsSeeder.js';
import type { Seed } from './SeedRunner.js';

export const seedNeighborhoods: Seed = {
  name: 'Neighborhoods',

  async isPending() {
    const citiesMissingNeighborhoods = await prisma.city.count({
      where: { deletedAt: null, neighborhoods: { none: {} } },
    });
    return citiesMissingNeighborhoods > 0;
  },

  async run() {
    await new CityNeighborhoodsSeeder().seedMissing();
  },
};
