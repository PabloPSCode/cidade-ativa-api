import { AppError } from '../../../errors/AppError.js';
import { UpdateSolicitationDTO } from '../../../dtos/UpdateSolicitationDTO.js';
import { SolicitationResponseDTO } from '../../../dtos/SolicitationResponseDTO.js';
import { ISolicitationRepository } from '../../../repositories/ISolicitationRepository.js';

export class UpdateSolicitationUseCase {
  constructor(private readonly repository: ISolicitationRepository) {}

  async execute(
    id: string,
    data: UpdateSolicitationDTO,
  ): Promise<SolicitationResponseDTO> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Solicitação não encontrada.', 404);
    const s = await this.repository.update(id, data);
    return {
      id: s.id,
      protocolNumber: s.protocolNumber,
      title: s.title,
      description: s.description,
      neighborhood: s.neighborhood,
      city: s.city,
      uf: s.uf,
      street: s.street,
      requestingUserId: s.requestingUserId,
      requestingUserName: s.requestingUserName ?? '',
      solicitationTypeId: s.solicitationTypeId,
      status: s.status,
      unsolvedImageUrls: s.unsolvedImageUrls,
      solvedImageUrls: s.solvedImageUrls,
      solvedDate: s.solvedDate,
      solvedCommentary: s.solvedCommentary,
      solvedUserId: s.solvedUserId,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    };
  }
}
