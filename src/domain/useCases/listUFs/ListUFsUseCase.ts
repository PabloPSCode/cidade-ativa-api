import { PaginationDTO } from '../../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../dtos/PaginatedResultDTO.js';
import { UFResponseDTO } from '../../dtos/UFResponseDTO.js';
import { IUFRepository } from '../../repositories/IUFRepository.js';

export class ListUFsUseCase {
  constructor(private readonly repository: IUFRepository) {}
  async execute(
    pagination: PaginationDTO,
  ): Promise<PaginatedResultDTO<UFResponseDTO>> {
    const result = await this.repository.list(pagination);
    return {
      data: result.data.map((u) => ({ id: u.id, name: u.name })),
      meta: result.meta,
    };
  }
}
