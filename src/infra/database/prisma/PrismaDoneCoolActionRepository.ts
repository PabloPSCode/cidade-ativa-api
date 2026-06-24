import { prisma } from './prismaClient.js';
import {
  IDoneCoolActionRepository,
  UserPointsAggregate,
} from '../../../domain/repositories/IDoneCoolActionRepository.js';
import { DoneCoolAction } from '../../../domain/entities/DoneCoolAction.js';
import { CreateDoneCoolActionDTO } from '../../../domain/dtos/CreateDoneCoolActionDTO.js';
import { UpdateDoneCoolActionDTO } from '../../../domain/dtos/UpdateDoneCoolActionDTO.js';
import { PaginationDTO } from '../../../domain/dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../domain/dtos/PaginatedResultDTO.js';

export class PrismaDoneCoolActionRepository implements IDoneCoolActionRepository {
  private toEntity(r: any): DoneCoolAction {
    return new DoneCoolAction(
      r.id,
      r.userId,
      r.description,
      r.neighborhood,
      r.street,
      r.actionPhotoURL,
      r.coolActionId,
      r.createdAt,
    );
  }

  async create(data: CreateDoneCoolActionDTO): Promise<DoneCoolAction> {
    const r = await prisma.doneCoolAction.create({ data });
    return this.toEntity(r);
  }

  async findById(id: string): Promise<DoneCoolAction | null> {
    const r = await prisma.doneCoolAction.findFirst({
      where: { id, deletedAt: null },
    });
    return r ? this.toEntity(r) : null;
  }

  async update(
    id: string,
    data: UpdateDoneCoolActionDTO,
  ): Promise<DoneCoolAction> {
    const r = await prisma.doneCoolAction.update({ where: { id }, data });
    return this.toEntity(r);
  }

  async delete(id: string): Promise<void> {
    await prisma.doneCoolAction.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async list(
    pagination: PaginationDTO,
    userId?: string,
  ): Promise<PaginatedResultDTO<DoneCoolAction>> {
    const { page = 1, perPage = 10 } = pagination;
    const skip = (page - 1) * perPage;
    const where = userId ? { userId, deletedAt: null } : { deletedAt: null };
    const [records, total] = await Promise.all([
      prisma.doneCoolAction.findMany({
        skip,
        take: perPage,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.doneCoolAction.count({ where }),
    ]);
    return {
      data: records.map((r) => this.toEntity(r)),
      meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    };
  }

  async rankingByPoints(): Promise<UserPointsAggregate[]> {
    const rows = await prisma.$queryRaw<
      {
        userId: string;
        userName: string;
        totalPoints: number | bigint;
        actionsCount: number | bigint;
      }[]
    >`
      SELECT u.id AS "userId",
             u.name AS "userName",
             COALESCE(SUM(ca.points), 0)::int AS "totalPoints",
             COUNT(dca.id)::int AS "actionsCount"
      FROM "DoneCoolAction" dca
      JOIN "CoolAction" ca
        ON ca.id = dca."coolActionId" AND ca."deletedAt" IS NULL
      JOIN "User" u
        ON u.id = dca."userId" AND u."deletedAt" IS NULL
      WHERE dca."deletedAt" IS NULL
      GROUP BY u.id, u.name
      ORDER BY "totalPoints" DESC, u.name ASC
    `;

    return rows.map((r) => ({
      userId: r.userId,
      userName: r.userName,
      totalPoints: Number(r.totalPoints),
      actionsCount: Number(r.actionsCount),
    }));
  }
}
