import { prisma } from './prismaClient.js';
import { INeighborhoodRepository } from '../../../domain/repositories/INeighborhoodRepository.js';
import { Neighborhood } from '../../../domain/entities/Neighborhood.js';

export class PrismaNeighborhoodRepository implements INeighborhoodRepository {
  async list(cityName?: string, cityId?: string): Promise<Neighborhood[]> {
    const where: any = {};
    if (cityName) where.cityName = cityName;
    if (cityId) where.cityId = cityId;
    const records = await prisma.neighborhood.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    return records.map(
      (r) => new Neighborhood(r.id, r.name, r.cityName, r.cityId),
    );
  }
}
