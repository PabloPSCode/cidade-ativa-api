import { prisma } from './prismaClient.js';
import { getCurrentCityId } from './cityContext.js';
import { ICoolActionRepository } from '../../../domain/repositories/ICoolActionRepository.js';
import {
  CoolAction,
  CoolActionCategory,
} from '../../../domain/entities/CoolAction.js';
import { CreateCoolActionDTO } from '../../../domain/dtos/CreateCoolActionDTO.js';
import { UpdateCoolActionDTO } from '../../../domain/dtos/UpdateCoolActionDTO.js';
import { PaginationDTO } from '../../../domain/dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../domain/dtos/PaginatedResultDTO.js';

export class PrismaCoolActionRepository implements ICoolActionRepository {
  private toEntity(r: any): CoolAction {
    return new CoolAction(
      r.id,
      r.title,
      r.category as CoolActionCategory,
      r.points,
      r.createdAt,
      r.cityId,
    );
  }

  async create(data: CreateCoolActionDTO): Promise<CoolAction> {
    const r = await prisma.coolAction.create({
      data: { ...data, cityId: await getCurrentCityId() },
    });
    return this.toEntity(r);
  }

  async findById(id: string): Promise<CoolAction | null> {
    const r = await prisma.coolAction.findFirst({
      where: { id, deletedAt: null },
    });
    return r ? this.toEntity(r) : null;
  }

  async update(id: string, data: UpdateCoolActionDTO): Promise<CoolAction> {
    const r = await prisma.coolAction.update({ where: { id }, data });
    return this.toEntity(r);
  }

  async delete(id: string): Promise<void> {
    await prisma.coolAction.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async list(
    pagination: PaginationDTO,
    cityId?: string,
  ): Promise<PaginatedResultDTO<CoolAction>> {
    const { page = 1, perPage = 10 } = pagination;
    const skip = (page - 1) * perPage;
    const where = { deletedAt: null, ...(cityId ? { cityId } : {}) };
    const [records, total] = await Promise.all([
      prisma.coolAction.findMany({
        skip,
        take: perPage,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.coolAction.count({ where }),
    ]);
    return {
      data: records.map((r) => this.toEntity(r)),
      meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    };
  }
}
