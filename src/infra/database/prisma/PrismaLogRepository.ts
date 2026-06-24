import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ILogRepository } from '../../../domain/repositories/ILogRepository.js';
import { Log } from '../../../domain/entities/Log.js';
import { CreateLogDTO } from '../../../domain/dtos/CreateLogDTO.js';
import { UpdateLogDTO } from '../../../domain/dtos/UpdateLogDTO.js';
import { PrismaLogMapper } from './mappers/PrismaLogMapper.js';

@Injectable()
export class PrismaLogRepository implements ILogRepository {
  constructor(
    @Inject('PRISMA_CLIENT')
    private readonly prisma: PrismaClient,
  ) {}

  async create(data: CreateLogDTO): Promise<Log> {
    const log = await this.prisma.log.create({
      data: {
        userId: data.userId,
        userName: data.userName,
        email: data.email,
        activityDescription: data.activityDescription,
      },
    });

    return PrismaLogMapper.toDomain(log);
  }

  async findById(id: string): Promise<Log | null> {
    const log = await this.prisma.log.findFirst({
      where: { id, deletedAt: null },
    });

    if (!log) {
      return null;
    }

    return PrismaLogMapper.toDomain(log);
  }

  async findAll(
    page: number,
    perPage: number,
  ): Promise<{ data: Log[]; total: number }> {
    const where = { deletedAt: null };
    const [logs, total] = await Promise.all([
      this.prisma.log.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.log.count({ where }),
    ]);

    return {
      data: logs.map(PrismaLogMapper.toDomain),
      total,
    };
  }

  async update(id: string, data: UpdateLogDTO): Promise<Log> {
    const updatedLog = await this.prisma.log.update({
      where: { id },
      data: {
        ...(data.userId !== undefined && { userId: data.userId }),
        ...(data.userName !== undefined && { userName: data.userName }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.activityDescription !== undefined && {
          activityDescription: data.activityDescription,
        }),
      },
    });

    return PrismaLogMapper.toDomain(updatedLog);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.log.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
