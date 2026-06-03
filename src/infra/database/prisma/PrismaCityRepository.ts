import { prisma } from './prismaClient.js';
import { ICityRepository } from '../../../domain/repositories/ICityRepository.js';
import { City } from '../../../domain/entities/City.js';
import { CreateCityDTO } from '../../../domain/dtos/CreateCityDTO.js';
import { UpdateCityDTO } from '../../../domain/dtos/UpdateCityDTO.js';
import { PaginationDTO } from '../../../domain/dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../domain/dtos/PaginatedResultDTO.js';

export class PrismaCityRepository implements ICityRepository {
  async create(data: CreateCityDTO): Promise<City> {
    const r = await prisma.city.create({ data });
    return new City(r.id, r.name, r.ufId);
  }
  async findById(id: string): Promise<City | null> {
    const r = await prisma.city.findUnique({ where: { id } });
    return r ? new City(r.id, r.name, r.ufId) : null;
  }
  async findByNameAndUF(name: string, ufId: string): Promise<City | null> {
    const r = await prisma.city.findUnique({ where: { name_ufId: { name, ufId } } });
    return r ? new City(r.id, r.name, r.ufId) : null;
  }
  async update(id: string, data: UpdateCityDTO): Promise<City> {
    const r = await prisma.city.update({ where: { id }, data });
    return new City(r.id, r.name, r.ufId);
  }
  async delete(id: string): Promise<void> {
    await prisma.city.delete({ where: { id } });
  }
  async list(pagination: PaginationDTO, ufId?: string): Promise<PaginatedResultDTO<City>> {
    const { page = 1, perPage = 10 } = pagination;
    const skip = (page - 1) * perPage;
    const where = ufId ? { ufId } : {};
    const [records, total] = await Promise.all([prisma.city.findMany({ skip, take: perPage, where, orderBy: { name: 'asc' } }), prisma.city.count({ where })]);
    return { data: records.map((r) => new City(r.id, r.name, r.ufId)), meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) } };
  }
  async hasNeighborhoods(id: string): Promise<boolean> {
    const count = await prisma.neighborhood.count({ where: { cityId: id } });
    return count > 0;
  }
}
