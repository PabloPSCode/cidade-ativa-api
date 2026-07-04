import { prisma } from './prismaClient.js';
import { getCurrentCityId } from './cityContext.js';
import { IVoteRepository } from '../../../domain/repositories/IVoteRepository.js';
import { Vote } from '../../../domain/entities/Vote.js';
import { CreateVoteDTO } from '../../../domain/dtos/CreateVoteDTO.js';
import { UpdateVoteDTO } from '../../../domain/dtos/UpdateVoteDTO.js';
import { PaginationDTO } from '../../../domain/dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../domain/dtos/PaginatedResultDTO.js';

export class PrismaVoteRepository implements IVoteRepository {
  private toEntity(r: any): Vote {
    return new Vote(
      r.id,
      r.title,
      r.description,
      r.pollId,
      r.userId,
      r.createdAt,
      r.updatedAt,
      r.cityId,
    );
  }

  async create(data: CreateVoteDTO): Promise<Vote> {
    const r = await prisma.vote.create({
      data: { ...data, cityId: await getCurrentCityId() },
    });
    return this.toEntity(r);
  }

  async findById(id: string): Promise<Vote | null> {
    const r = await prisma.vote.findFirst({ where: { id, deletedAt: null } });
    return r ? this.toEntity(r) : null;
  }

  async update(id: string, data: UpdateVoteDTO): Promise<Vote> {
    const r = await prisma.vote.update({ where: { id }, data });
    return this.toEntity(r);
  }

  async delete(id: string): Promise<void> {
    await prisma.vote.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async list(
    pagination: PaginationDTO,
    filters?: { pollId?: string; userId?: string },
    cityId?: string,
  ): Promise<PaginatedResultDTO<Vote>> {
    const { page = 1, perPage = 10 } = pagination;
    const skip = (page - 1) * perPage;
    const where: any = { deletedAt: null };
    if (filters?.pollId) where.pollId = filters.pollId;
    if (filters?.userId) where.userId = filters.userId;
    if (cityId) where.cityId = cityId;
    const [records, total] = await Promise.all([
      prisma.vote.findMany({
        skip,
        take: perPage,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.vote.count({ where }),
    ]);
    return {
      data: records.map((r) => this.toEntity(r)),
      meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    };
  }

  async hasVoteOptions(voteId: string): Promise<boolean> {
    const count = await prisma.voteOption.count({
      where: { voteId, deletedAt: null },
    });
    return count > 0;
  }
}
