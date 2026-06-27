import { prisma } from './prismaClient.js';
import { getCurrentCityId } from './cityContext.js';
import { ISolicitationRepository } from '../../../domain/repositories/ISolicitationRepository.js';
import {
  Solicitation,
  SolicitationStatus,
} from '../../../domain/entities/Solicitation.js';
import { CreateSolicitationDTO } from '../../../domain/dtos/CreateSolicitationDTO.js';
import { UpdateSolicitationDTO } from '../../../domain/dtos/UpdateSolicitationDTO.js';
import { PaginationDTO } from '../../../domain/dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../domain/dtos/PaginatedResultDTO.js';

export class PrismaSolicitationRepository implements ISolicitationRepository {
  private toEntity(r: any): Solicitation {
    const entity = new Solicitation(
      r.id,
      r.protocolNumber,
      r.title,
      r.description,
      r.neighborhood,
      r.city,
      r.uf,
      r.street,
      r.cep,
      r.requestingUserId,
      r.solicitationTypeId,
      r.status as SolicitationStatus,
      Array.isArray(r.unsolvedImageUrls)
        ? r.unsolvedImageUrls
        : JSON.parse(r.unsolvedImageUrls ?? '[]'),
      r.solvedImageUrls
        ? Array.isArray(r.solvedImageUrls)
          ? r.solvedImageUrls
          : JSON.parse(r.solvedImageUrls)
        : null,
      r.solvedDate,
      r.solvedCommentary,
      r.solvedUserId,
      r.createdAt,
      r.updatedAt,
      r.cityId,
    );
    if (r.requestingUser?.name) {
      entity.requestingUserName = r.requestingUser.name;
    }
    return entity;
  }

  async create(data: CreateSolicitationDTO): Promise<Solicitation> {
    const r = await prisma.solicitation.create({
      data: {
        ...data,
        city: '',
        uf: '',
        cityId: await getCurrentCityId(),
        unsolvedImageUrls: data.unsolvedImageUrls ?? [],
        status: 'waiting_approval',
      },
    });
    return this.toEntity(r);
  }

  async findById(id: string): Promise<Solicitation | null> {
    const r = await prisma.solicitation.findFirst({
      where: { id, deletedAt: null },
      include: { requestingUser: true },
    });
    return r ? this.toEntity(r) : null;
  }

  async update(id: string, data: UpdateSolicitationDTO): Promise<Solicitation> {
    const r = await prisma.solicitation.update({
      where: { id },
      data: data as any,
    });
    return this.toEntity(r);
  }

  async delete(id: string): Promise<void> {
    await prisma.solicitation.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async list(
    pagination: PaginationDTO,
    filters?: { userId?: string; status?: string },
    cityId?: string,
  ): Promise<PaginatedResultDTO<Solicitation>> {
    const { page = 1, perPage = 10 } = pagination;
    const skip = (page - 1) * perPage;
    const where: any = { deletedAt: null };
    if (filters?.userId) where.requestingUserId = filters.userId;
    if (filters?.status) where.status = filters.status;
    if (cityId) where.cityId = cityId;
    const [records, total] = await Promise.all([
      prisma.solicitation.findMany({
        skip,
        take: perPage,
        where,
        orderBy: { createdAt: 'desc' },
        include: { requestingUser: true },
      }),
      prisma.solicitation.count({ where }),
    ]);
    return {
      data: records.map((r) => this.toEntity(r)),
      meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    };
  }

  async countOpenByUser(userId: string): Promise<number> {
    return prisma.solicitation.count({
      where: {
        requestingUserId: userId,
        status: { not: 'resolved' },
        deletedAt: null,
      },
    });
  }
}
