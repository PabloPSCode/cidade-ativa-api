import { PaginationDTO } from '../../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../dtos/PaginatedResultDTO.js';
import { CityResponseDTO } from '../../dtos/CityResponseDTO.js';
import { ICityRepository } from '../../repositories/ICityRepository.js';

export class ListCitiesUseCase {
  constructor(private readonly repository: ICityRepository) {}
  async execute(
    pagination: PaginationDTO,
    ufId?: string,
  ): Promise<PaginatedResultDTO<CityResponseDTO>> {
    const result = await this.repository.list(pagination, ufId);
    return {
      data: result.data.map((c) => ({ id: c.id, name: c.name, ufId: c.ufId })),
      meta: result.meta,
    };
  }
}
