import { prisma } from './prismaClient.js';
import { ISignatureRepository } from '../../../domain/repositories/ISignatureRepository.js';
import { Signature } from '../../../domain/entities/Signature.js';
import { CreateSignatureDTO } from '../../../domain/dtos/CreateSignatureDTO.js';

export class PrismaSignatureRepository implements ISignatureRepository {
  private toEntity(r: any): Signature {
    return new Signature(
      r.id,
      r.imageUrl,
      r.userName,
      r.userId,
      r.solicitationId,
    );
  }

  async create(data: CreateSignatureDTO): Promise<Signature> {
    const r = await prisma.signature.create({ data });
    return this.toEntity(r);
  }

  async findById(id: string): Promise<Signature | null> {
    const r = await prisma.signature.findUnique({ where: { id } });
    return r ? this.toEntity(r) : null;
  }

  async findByUserId(userId: string): Promise<Signature | null> {
    const r = await prisma.signature.findUnique({ where: { userId } });
    return r ? this.toEntity(r) : null;
  }

  async delete(id: string): Promise<void> {
    await prisma.signature.delete({ where: { id } });
  }
}
