import { getEnv } from '../config/env.js';
import { prisma } from '../database/prisma/prismaClient.js';
import { loadCityNeighborhoods } from '../integrations/openai/cityNeighborhoods.js';
import type { Seed } from './SeedRunner.js';

export const seedNeighborhoods: Seed = {
  name: 'Neighborhoods',

  async isPending() {
    const count = await prisma.neighborhood.count();
    return count === 0;
  },

  async run() {
    const neighborhoods = await loadCityNeighborhoods();
    if (neighborhoods.length === 0) return;

    const cityName = getEnv().cityName.trim();
    await prisma.neighborhood.createMany({
      data: neighborhoods.map((name) => ({ name, cityName })),
    });
  },
};
