import { prisma } from './prismaClient.js';
import { IVoteOptionRepository } from '../../../domain/repositories/IVoteOptionRepository.js';
import { VoteOption } from '../../../domain/entities/VoteOption.js';
import { CreateVoteOptionDTO } from '../../../domain/dtos/CreateVoteOptionDTO.js';
import { UpdateVoteOptionDTO } from '../../../domain/dtos/UpdateVoteOptionDTO.js';
import { PaginationDTO } from '../../../domain/dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../domain/dtos/PaginatedResultDTO.js';

export class PrismaVoteOptionRepository implements IVoteOptionRepository {
  private toEntity(r: any): VoteOption {
    return new VoteOption(r.id, r.optionText, r.voteId, r.createdAt, r.updatedAt);
  }

  async create(data: CreateVoteOptionDTO): Promise<VoteOption> {
    const r = await prisma.voteOption.create({ data });
    return this.toEntity(r);
  }

  async findById(id: string): Promise<VoteOption | null> {
    const r = await prisma.voteOption.findFirst({
      where: { id, deletedAt: null },
    });
    return r ? this.toEntity(r) : null;
  }

  async update(id: string, data: UpdateVoteOptionDTO): Promise<VoteOption> {
    const r = await prisma.voteOption.update({ where: { id }, data });
    return this.toEntity(r);
  }

  async delete(id: string): Promise<void> {
    await prisma.voteOption.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async list(
    pagination: PaginationDTO,
    voteId?: string,
  ): Promise<PaginatedResultDTO<VoteOption>> {
    const { page = 1, perPage = 10 } = pagination;
    const skip = (page - 1) * perPage;
    const where = voteId ? { voteId, deletedAt: null } : { deletedAt: null };
    const [records, total] = await Promise.all([
      prisma.voteOption.findMany({
        skip,
        take: perPage,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.voteOption.count({ where }),
    ]);
    return {
      data: records.map((r) => this.toEntity(r)),
      meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    };
  }
}
