import { prisma } from './prismaClient.js';
import { INeighborhoodRepository } from '../../../domain/repositories/INeighborhoodRepository.js';
import { Neighborhood } from '../../../domain/entities/Neighborhood.js';

export class PrismaNeighborhoodRepository implements INeighborhoodRepository {
  async list(cityName?: string): Promise<Neighborhood[]> {
    const records = await prisma.neighborhood.findMany({
      where: cityName ? { cityName } : undefined,
      orderBy: { name: 'asc' },
    });
    return records.map((r) => new Neighborhood(r.id, r.name, r.cityName));
  }
}
