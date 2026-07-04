import { prisma } from './prismaClient.js';
import { getCurrentCityId } from './cityContext.js';
import { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
import { User } from '../../../domain/entities/User.js';
import { CreateUserDTO } from '../../../domain/dtos/CreateUserDTO.js';
import { UpdateUserDTO } from '../../../domain/dtos/UpdateUserDTO.js';
import { PaginationDTO } from '../../../domain/dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../domain/dtos/PaginatedResultDTO.js';

type CreateInput = CreateUserDTO & { passwordHash: string };

export class PrismaUserRepository implements IUserRepository {
  private toEntity(r: any): User {
    return new User(
      r.id,
      r.name,
      r.email,
      r.passwordHash,
      r.isCouncilman,
      r.isAdmin,
      r.address,
      r.neighborhood,
      r.city,
      r.uf,
      r.createdAt,
      r.cityId,
    );
  }

  async create(data: CreateInput): Promise<User> {
    const { password: _p, cityId, ...rest } = data as any;
    const r = await prisma.user.create({
      data: {
        ...rest,
        address: rest.address ?? '',
        neighborhood: rest.neighborhood ?? '',
        city: rest.city ?? '',
        uf: rest.uf ?? '',
        // Usa a cidade escolhida no cadastro; só recorre à cidade padrão
        // (request/seed) quando nenhuma foi informada.
        cityId: cityId || (await getCurrentCityId()),
      },
    });
    return this.toEntity(r);
  }

  async findById(id: string): Promise<User | null> {
    const r = await prisma.user.findFirst({ where: { id, deletedAt: null } });
    return r ? this.toEntity(r) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const r = await prisma.user.findFirst({ where: { email, deletedAt: null } });
    return r ? this.toEntity(r) : null;
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const r = await prisma.user.update({ where: { id }, data });
    return this.toEntity(r);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async list(
    pagination: PaginationDTO,
    cityId?: string,
  ): Promise<PaginatedResultDTO<User>> {
    const { page = 1, perPage = 10 } = pagination;
    const skip = (page - 1) * perPage;
    const where = { deletedAt: null, ...(cityId ? { cityId } : {}) };
    const [records, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: perPage,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
    return {
      data: records.map((r) => this.toEntity(r)),
      meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    };
  }
}
