import { prisma } from './prismaClient.js';
import { ISolicitationTypeRepository } from '../../../domain/repositories/ISolicitationTypeRepository.js';
import { SolicitationType } from '../../../domain/entities/SolicitationType.js';
import { CreateSolicitationTypeDTO } from '../../../domain/dtos/CreateSolicitationTypeDTO.js';
import { UpdateSolicitationTypeDTO } from '../../../domain/dtos/UpdateSolicitationTypeDTO.js';
import { PaginationDTO } from '../../../domain/dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../domain/dtos/PaginatedResultDTO.js';

export class PrismaSolicitationTypeRepository implements ISolicitationTypeRepository {
  async create(data: CreateSolicitationTypeDTO): Promise<SolicitationType> {
    const record = await prisma.solicitationType.create({ data });
    return new SolicitationType(record.id, record.description, record.points);
  }

  async findById(id: string): Promise<SolicitationType | null> {
    const record = await prisma.solicitationType.findUnique({ where: { id } });
    if (!record) return null;
    return new SolicitationType(record.id, record.description, record.points);
  }

  async findByDescription(description: string): Promise<SolicitationType | null> {
    const record = await prisma.solicitationType.findUnique({ where: { description } });
    if (!record) return null;
    return new SolicitationType(record.id, record.description, record.points);
  }

  async update(id: string, data: UpdateSolicitationTypeDTO): Promise<SolicitationType> {
    const record = await prisma.solicitationType.update({ where: { id }, data });
    return new SolicitationType(record.id, record.description, record.points);
  }

  async delete(id: string): Promise<void> {
    await prisma.solicitationType.delete({ where: { id } });
  }

  async list(pagination: PaginationDTO): Promise<PaginatedResultDTO<SolicitationType>> {
    const { page = 1, perPage = 10 } = pagination;
    const skip = (page - 1) * perPage;
    const [records, total] = await Promise.all([
      prisma.solicitationType.findMany({ skip, take: perPage, orderBy: { description: 'asc' } }),
      prisma.solicitationType.count(),
    ]);
    return {
      data: records.map((r) => new SolicitationType(r.id, r.description, r.points)),
      meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    };
  }

  async hasLinkedRecords(id: string): Promise<boolean> {
    const [solicitations, coolActions] = await Promise.all([
      prisma.solicitation.count({ where: { solicitationTypeId: id } }),
      prisma.coolAction.count({ where: { solicitationTypeId: id } }),
    ]);
    return solicitations > 0 || coolActions > 0;
  }
}
