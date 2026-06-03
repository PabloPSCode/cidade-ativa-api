import { AppError } from '../../errors/AppError.js';
import { SolicitationResponseDTO } from '../../dtos/SolicitationResponseDTO.js';
import { ISolicitationRepository } from '../../repositories/ISolicitationRepository.js';

export class FindSolicitationByIdUseCase {
  constructor(private readonly repository: ISolicitationRepository) {}

  async execute(id: string): Promise<SolicitationResponseDTO> {
    const s = await this.repository.findById(id);
    if (!s) throw new AppError('Solicitation not found', 404);
    return {
      id: s.id, protocolNumber: s.protocolNumber, title: s.title,
      description: s.description, neighborhood: s.neighborhood, city: s.city,
      uf: s.uf, street: s.street, requestingUserId: s.requestingUserId,
      solicitationTypeId: s.solicitationTypeId, status: s.status,
      unsolvedImageUrls: s.unsolvedImageUrls, solvedImageUrls: s.solvedImageUrls,
      solvedDate: s.solvedDate, solvedCommentary: s.solvedCommentary,
      solvedUserId: s.solvedUserId, createdAt: s.createdAt, updatedAt: s.updatedAt,
    };
  }
}
