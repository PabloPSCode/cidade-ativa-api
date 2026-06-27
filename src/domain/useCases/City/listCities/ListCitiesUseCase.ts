import { PaginationDTO } from '../../../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../dtos/PaginatedResultDTO.js';
import { CityResponseDTO } from '../../../dtos/CityResponseDTO.js';
import { ICityRepository } from '../../../repositories/ICityRepository.js';

export class ListCitiesUseCase {
  constructor(private readonly repository: ICityRepository) {}

  async execute(
    pagination: PaginationDTO,
  ): Promise<PaginatedResultDTO<CityResponseDTO>> {
    const result = await this.repository.list(pagination);
    return {
      data: result.data.map((city) => ({
        id: city.id,
        name: city.name,
        uf: city.uf,
        createdAt: city.createdAt,
      })),
      meta: result.meta,
    };
  }
}
