import { PaginationDTO } from '../../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../dtos/PaginatedResultDTO.js';
import { PublicPhoneResponseDTO } from '../../dtos/PublicPhoneResponseDTO.js';
import { IPublicPhoneRepository } from '../../repositories/IPublicPhoneRepository.js';

export class ListPublicPhonesUseCase {
  constructor(private readonly repository: IPublicPhoneRepository) {}

  async execute(
    pagination: PaginationDTO,
  ): Promise<PaginatedResultDTO<PublicPhoneResponseDTO>> {
    const result = await this.repository.list(pagination);
    return {
      data: result.data.map((p) => ({
        id: p.id,
        institutionName: p.institutionName,
        phone: p.phone,
      })),
      meta: result.meta,
    };
  }
}
