import { prisma } from './prismaClient.js';
import { INeighborhoodRepository } from '../../../domain/repositories/INeighborhoodRepository.js';
import { Neighborhood } from '../../../domain/entities/Neighborhood.js';
import { CreateNeighborhoodDTO } from '../../../domain/dtos/CreateNeighborhoodDTO.js';
import { UpdateNeighborhoodDTO } from '../../../domain/dtos/UpdateNeighborhoodDTO.js';
import { PaginationDTO } from '../../../domain/dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../domain/dtos/PaginatedResultDTO.js';

export class PrismaNeighborhoodRepository implements INeighborhoodRepository {
  async create(data: CreateNeighborhoodDTO): Promise<Neighborhood> {
    const r = await prisma.neighborhood.create({ data });
    return new Neighborhood(r.id, r.name, r.cityId);
  }
  async findById(id: string): Promise<Neighborhood | null> {
    const r = await prisma.neighborhood.findUnique({ where: { id } });
    return r ? new Neighborhood(r.id, r.name, r.cityId) : null;
  }
  async findByNameAndCity(name: string, cityId: string): Promise<Neighborhood | null> {
    const r = await prisma.neighborhood.findUnique({ where: { name_cityId: { name, cityId } } });
    return r ? new Neighborhood(r.id, r.name, r.cityId) : null;
  }
  async update(id: string, data: UpdateNeighborhoodDTO): Promise<Neighborhood> {
    const r = await prisma.neighborhood.update({ where: { id }, data });
    return new Neighborhood(r.id, r.name, r.cityId);
  }
  async delete(id: string): Promise<void> {
    await prisma.neighborhood.delete({ where: { id } });
  }
  async list(pagination: PaginationDTO, cityId?: string): Promise<PaginatedResultDTO<Neighborhood>> {
    const { page = 1, perPage = 10 } = pagination;
    const skip = (page - 1) * perPage;
    const where = cityId ? { cityId } : {};
    const [records, total] = await Promise.all([prisma.neighborhood.findMany({ skip, take: perPage, where, orderBy: { name: 'asc' } }), prisma.neighborhood.count({ where })]);
    return { data: records.map((r) => new Neighborhood(r.id, r.name, r.cityId)), meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) } };
  }
}
