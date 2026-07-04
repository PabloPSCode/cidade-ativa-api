import { prisma } from './prismaClient.js';
import { getCurrentCityId } from './cityContext.js';
import { IPollRepository } from '../../../domain/repositories/IPollRepository.js';
import { Poll, PollStatus } from '../../../domain/entities/Poll.js';
import { CreatePollDTO } from '../../../domain/dtos/CreatePollDTO.js';
import { UpdatePollDTO } from '../../../domain/dtos/UpdatePollDTO.js';
import { PaginationDTO } from '../../../domain/dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../domain/dtos/PaginatedResultDTO.js';

export class PrismaPollRepository implements IPollRepository {
  private toEntity(r: any): Poll {
    return new Poll(
      r.id,
      r.title,
      r.description,
      r.pollCoverUrl,
      r.startedAt,
      r.finishedAt,
      r.status as PollStatus,
      r.createdAt,
      r.updatedAt,
      r.cityId,
    );
  }

  async create(data: CreatePollDTO): Promise<Poll> {
    const r = await prisma.poll.create({
      data: { ...data, cityId: await getCurrentCityId() },
    });
    return this.toEntity(r);
  }

  async findById(id: string): Promise<Poll | null> {
    const r = await prisma.poll.findFirst({ where: { id, deletedAt: null } });
    return r ? this.toEntity(r) : null;
  }

  async update(id: string, data: UpdatePollDTO): Promise<Poll> {
    const r = await prisma.poll.update({ where: { id }, data });
    return this.toEntity(r);
  }

  async delete(id: string): Promise<void> {
    await prisma.poll.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async list(
    pagination: PaginationDTO,
    status?: string,
    cityId?: string,
  ): Promise<PaginatedResultDTO<Poll>> {
    const { page = 1, perPage = 10 } = pagination;
    const skip = (page - 1) * perPage;
    const where: any = { deletedAt: null };
    if (status) where.status = status;
    if (cityId) where.cityId = cityId;
    const [records, total] = await Promise.all([
      prisma.poll.findMany({
        skip,
        take: perPage,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.poll.count({ where }),
    ]);
    return {
      data: records.map((r) => this.toEntity(r)),
      meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    };
  }
}
