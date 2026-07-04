import { prisma } from './prismaClient.js';
import { ISolicitationSignatureRepository } from '../../../domain/repositories/ISolicitationSignatureRepository.js';
import { SolicitationSignature } from '../../../domain/entities/SolicitationSignature.js';
import { CreateSolicitationSignatureDTO } from '../../../domain/dtos/CreateSolicitationSignatureDTO.js';

export class PrismaSolicitationSignatureRepository
  implements ISolicitationSignatureRepository
{
  private toEntity(r: any): SolicitationSignature {
    return new SolicitationSignature(
      r.id,
      r.imageUrl,
      r.userName,
      r.userId,
      r.solicitationId,
      r.createdAt,
    );
  }

  async create(
    data: CreateSolicitationSignatureDTO,
  ): Promise<SolicitationSignature> {
    const r = await prisma.solicitationSignature.create({ data });
    return this.toEntity(r);
  }

  async findByUserAndSolicitation(
    userId: string,
    solicitationId: string,
  ): Promise<SolicitationSignature | null> {
    const r = await prisma.solicitationSignature.findUnique({
      where: { userId_solicitationId: { userId, solicitationId } },
    });
    return r ? this.toEntity(r) : null;
  }

  async listBySolicitationId(
    solicitationId: string,
  ): Promise<SolicitationSignature[]> {
    const rows = await prisma.solicitationSignature.findMany({
      where: { solicitationId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((r) => this.toEntity(r));
  }
}
