import { prisma } from './prismaClient.js';
import { IPublicPhoneRepository } from '../../../domain/repositories/IPublicPhoneRepository.js';
import { PublicPhone } from '../../../domain/entities/PublicPhone.js';
import { CreatePublicPhoneDTO } from '../../../domain/dtos/CreatePublicPhoneDTO.js';
import { UpdatePublicPhoneDTO } from '../../../domain/dtos/UpdatePublicPhoneDTO.js';
import { PaginationDTO } from '../../../domain/dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../domain/dtos/PaginatedResultDTO.js';

export class PrismaPublicPhoneRepository implements IPublicPhoneRepository {
  async create(data: CreatePublicPhoneDTO): Promise<PublicPhone> {
    const r = await prisma.publicPhone.create({ data });
    return new PublicPhone(r.id, r.phone);
  }

  async findById(id: string): Promise<PublicPhone | null> {
    const r = await prisma.publicPhone.findUnique({ where: { id } });
    return r ? new PublicPhone(r.id, r.phone) : null;
  }

  async findByPhone(phone: string): Promise<PublicPhone | null> {
    const r = await prisma.publicPhone.findUnique({ where: { phone } });
    return r ? new PublicPhone(r.id, r.phone) : null;
  }

  async update(id: string, data: UpdatePublicPhoneDTO): Promise<PublicPhone> {
    const r = await prisma.publicPhone.update({ where: { id }, data });
    return new PublicPhone(r.id, r.phone);
  }

  async delete(id: string): Promise<void> {
    await prisma.publicPhone.delete({ where: { id } });
  }

  async list(
    pagination: PaginationDTO,
  ): Promise<PaginatedResultDTO<PublicPhone>> {
    const { page = 1, perPage = 10 } = pagination;
    const skip = (page - 1) * perPage;
    const [records, total] = await Promise.all([
      prisma.publicPhone.findMany({ skip, take: perPage }),
      prisma.publicPhone.count(),
    ]);
    return {
      data: records.map((r) => new PublicPhone(r.id, r.phone)),
      meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    };
  }
}
