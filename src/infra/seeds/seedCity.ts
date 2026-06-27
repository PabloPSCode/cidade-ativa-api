import { getEnv } from '../config/env.js';
import { prisma } from '../database/prisma/prismaClient.js';
import { resetCityContextCache } from '../database/prisma/cityContext.js';
import type { Seed } from './SeedRunner.js';

export const seedCity: Seed = {
  name: 'City',

  async isPending() {
    const count = await prisma.city.count();
    return count === 0;
  },

  async run() {
    const { cityName, cityUf } = getEnv();
    await prisma.city.create({
      data: { name: cityName.trim(), uf: cityUf.trim() },
    });
    resetCityContextCache();
  },
};
