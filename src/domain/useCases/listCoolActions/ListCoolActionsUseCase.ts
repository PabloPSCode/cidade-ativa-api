import { PaginationDTO } from '../../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../dtos/PaginatedResultDTO.js';
import { CoolActionResponseDTO } from '../../dtos/CoolActionResponseDTO.js';
import { ICoolActionRepository } from '../../repositories/ICoolActionRepository.js';

export class ListCoolActionsUseCase {
  constructor(private readonly repository: ICoolActionRepository) {}

  async execute(
    pagination: PaginationDTO,
  ): Promise<PaginatedResultDTO<CoolActionResponseDTO>> {
    const result = await this.repository.list(pagination);
    return {
      data: result.data.map((ca) => ({
        id: ca.id,
        solicitationTypeId: ca.solicitationTypeId,
        solicitationId: ca.solicitationId,
        createdAt: ca.createdAt,
      })),
      meta: result.meta,
    };
  }
}
