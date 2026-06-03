import { prisma } from './prismaClient.js';
import { IDoneCoolActionRepository } from '../../../domain/repositories/IDoneCoolActionRepository.js';
import { DoneCoolAction } from '../../../domain/entities/DoneCoolAction.js';
import { CreateDoneCoolActionDTO } from '../../../domain/dtos/CreateDoneCoolActionDTO.js';
import { UpdateDoneCoolActionDTO } from '../../../domain/dtos/UpdateDoneCoolActionDTO.js';
import { PaginationDTO } from '../../../domain/dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../domain/dtos/PaginatedResultDTO.js';

export class PrismaDoneCoolActionRepository implements IDoneCoolActionRepository {
  private toEntity(r: any): DoneCoolAction {
    return new DoneCoolAction(r.id, r.userId, r.coolActionId, r.solicitationId, r.createdAt);
  }

  async create(data: CreateDoneCoolActionDTO): Promise<DoneCoolAction> {
    const r = await prisma.doneCoolAction.create({ data });
    return this.toEntity(r);
  }

  async findById(id: string): Promise<DoneCoolAction | null> {
    const r = await prisma.doneCoolAction.findUnique({ where: { id } });
    return r ? this.toEntity(r) : null;
  }

  async update(id: string, data: UpdateDoneCoolActionDTO): Promise<DoneCoolAction> {
    const r = await prisma.doneCoolAction.update({ where: { id }, data });
    return this.toEntity(r);
  }

  async delete(id: string): Promise<void> {
    await prisma.doneCoolAction.delete({ where: { id } });
  }

  async list(pagination: PaginationDTO, userId?: string): Promise<PaginatedResultDTO<DoneCoolAction>> {
    const { page = 1, perPage = 10 } = pagination;
    const skip = (page - 1) * perPage;
    const where = userId ? { userId } : {};
    const [records, total] = await Promise.all([prisma.doneCoolAction.findMany({ skip, take: perPage, where, orderBy: { createdAt: 'desc' } }), prisma.doneCoolAction.count({ where })]);
    return { data: records.map((r) => this.toEntity(r)), meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) } };
  }
}
