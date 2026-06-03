import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getEnv } from '../../config/env.js';

export const createPrismaClient = (): PrismaClient => {
  const adapter = new PrismaPg({ connectionString: getEnv().databaseUrl });

  return new PrismaClient({ adapter });
};

export const prisma = createPrismaClient();
