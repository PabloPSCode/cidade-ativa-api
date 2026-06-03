import { prisma } from './prismaClient.js';
import { IUFRepository } from '../../../domain/repositories/IUFRepository.js';
import { UF } from '../../../domain/entities/UF.js';
import { CreateUFDTO } from '../../../domain/dtos/CreateUFDTO.js';
import { UpdateUFDTO } from '../../../domain/dtos/UpdateUFDTO.js';
import { PaginationDTO } from '../../../domain/dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../domain/dtos/PaginatedResultDTO.js';

export class PrismaUFRepository implements IUFRepository {
  async create(data: CreateUFDTO): Promise<UF> {
    const r = await prisma.uF.create({ data });
    return new UF(r.id, r.name);
  }
  async findById(id: string): Promise<UF | null> {
    const r = await prisma.uF.findUnique({ where: { id } });
    return r ? new UF(r.id, r.name) : null;
  }
  async findByName(name: string): Promise<UF | null> {
    const r = await prisma.uF.findUnique({ where: { name } });
    return r ? new UF(r.id, r.name) : null;
  }
  async update(id: string, data: UpdateUFDTO): Promise<UF> {
    const r = await prisma.uF.update({ where: { id }, data });
    return new UF(r.id, r.name);
  }
  async delete(id: string): Promise<void> {
    await prisma.uF.delete({ where: { id } });
  }
  async list(pagination: PaginationDTO): Promise<PaginatedResultDTO<UF>> {
    const { page = 1, perPage = 10 } = pagination;
    const skip = (page - 1) * perPage;
    const [records, total] = await Promise.all([prisma.uF.findMany({ skip, take: perPage, orderBy: { name: 'asc' } }), prisma.uF.count()]);
    return { data: records.map((r) => new UF(r.id, r.name)), meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) } };
  }
  async hasCities(id: string): Promise<boolean> {
    const count = await prisma.city.count({ where: { ufId: id } });
    return count > 0;
  }
}
