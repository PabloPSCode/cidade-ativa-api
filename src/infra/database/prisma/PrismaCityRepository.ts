import { prisma } from './prismaClient.js';
import { ICityRepository } from '../../../domain/repositories/ICityRepository.js';
import { City } from '../../../domain/entities/City.js';
import { CreateCityDTO } from '../../../domain/dtos/CreateCityDTO.js';
import { UpdateCityDTO } from '../../../domain/dtos/UpdateCityDTO.js';
import { PaginationDTO } from '../../../domain/dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../domain/dtos/PaginatedResultDTO.js';

export class PrismaCityRepository implements ICityRepository {
  private toEntity(r: any): City {
    return new City(r.id, r.name, r.uf, r.createdAt);
  }

  async create(data: CreateCityDTO): Promise<City> {
    const r = await prisma.city.create({ data });
    return this.toEntity(r);
  }

  async findById(id: string): Promise<City | null> {
    const r = await prisma.city.findFirst({ where: { id, deletedAt: null } });
    return r ? this.toEntity(r) : null;
  }

  async findByName(name: string): Promise<City | null> {
    const r = await prisma.city.findFirst({ where: { name, deletedAt: null } });
    return r ? this.toEntity(r) : null;
  }

  async update(id: string, data: UpdateCityDTO): Promise<City> {
    const r = await prisma.city.update({ where: { id }, data });
    return this.toEntity(r);
  }

  async delete(id: string): Promise<void> {
    await prisma.city.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async list(pagination: PaginationDTO): Promise<PaginatedResultDTO<City>> {
    const { page = 1, perPage = 10 } = pagination;
    const skip = (page - 1) * perPage;
    const where = { deletedAt: null };
    const [records, total] = await Promise.all([
      prisma.city.findMany({
        skip,
        take: perPage,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.city.count({ where }),
    ]);
    return {
      data: records.map((r) => this.toEntity(r)),
      meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    };
  }
}
