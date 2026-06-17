import { PaginationDTO } from '../../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../dtos/PaginatedResultDTO.js';
import { SolicitationResponseDTO } from '../../dtos/SolicitationResponseDTO.js';
import { ISolicitationRepository } from '../../repositories/ISolicitationRepository.js';

export class ListSolicitationsUseCase {
  constructor(private readonly repository: ISolicitationRepository) {}

  async execute(
    pagination: PaginationDTO,
    filters?: { userId?: string; status?: string },
  ): Promise<PaginatedResultDTO<SolicitationResponseDTO>> {
    const result = await this.repository.list(pagination, filters);
    return {
      data: result.data.map((s) => ({
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
      })),
      meta: result.meta,
    };
  }
}
