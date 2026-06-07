const prismaClientConstructor = jest.fn();
const prismaPgConstructor = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: prismaClientConstructor,
}));

jest.mock(
  '@prisma/adapter-pg',
  () => ({
    PrismaPg: prismaPgConstructor,
  }),
  { virtual: true },
);

import { createPrismaClient } from './prismaClient.js';

describe('createPrismaClient', () => {
  const databaseUrl =
    'postgresql://postgres:postgres@localhost:5432/cidade_ativa_db';
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(() => {
    process.env.DATABASE_URL = databaseUrl;
    prismaClientConstructor.mockReset();
    prismaPgConstructor.mockReset();
    prismaPgConstructor.mockImplementation((options: unknown) => ({ options }));
  });

  afterAll(() => {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
      return;
    }

    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it('creates PrismaClient with the PostgreSQL driver adapter', () => {
    createPrismaClient();

    expect(prismaPgConstructor).toHaveBeenCalledWith({
      connectionString: databaseUrl,
    });
    expect(prismaClientConstructor).toHaveBeenCalledWith({
      adapter: { options: { connectionString: databaseUrl } },
    });
  });
});
