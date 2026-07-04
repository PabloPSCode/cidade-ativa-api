import { PaginationDTO } from '../../../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../dtos/PaginatedResultDTO.js';
import { SolicitationTypeResponseDTO } from '../../../dtos/SolicitationTypeResponseDTO.js';
import { ISolicitationTypeRepository } from '../../../repositories/ISolicitationTypeRepository.js';

export class ListSolicitationTypesUseCase {
  constructor(private readonly repository: ISolicitationTypeRepository) {}

  async execute(
    pagination: PaginationDTO,
    cityId?: string,
  ): Promise<PaginatedResultDTO<SolicitationTypeResponseDTO>> {
    const result = await this.repository.list(pagination, cityId);
    return {
      data: result.data.map((s) => ({
        id: s.id,
        description: s.description,
      })),
      meta: result.meta,
    };
  }
}
