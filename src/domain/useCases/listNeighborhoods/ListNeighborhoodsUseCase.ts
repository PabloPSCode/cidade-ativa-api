import { PaginationDTO } from '../../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../dtos/PaginatedResultDTO.js';
import { NeighborhoodResponseDTO } from '../../dtos/NeighborhoodResponseDTO.js';
import { INeighborhoodRepository } from '../../repositories/INeighborhoodRepository.js';

export class ListNeighborhoodsUseCase {
  constructor(private readonly repository: INeighborhoodRepository) {}
  async execute(pagination: PaginationDTO, cityId?: string): Promise<PaginatedResultDTO<NeighborhoodResponseDTO>> {
    const result = await this.repository.list(pagination, cityId);
    return { data: result.data.map((n) => ({ id: n.id, name: n.name, cityId: n.cityId })), meta: result.meta };
  }
}
