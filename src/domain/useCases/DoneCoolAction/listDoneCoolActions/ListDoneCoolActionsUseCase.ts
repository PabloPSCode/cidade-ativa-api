import { PaginationDTO } from '../../../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../dtos/PaginatedResultDTO.js';
import { DoneCoolActionResponseDTO } from '../../../dtos/DoneCoolActionResponseDTO.js';
import { IDoneCoolActionRepository } from '../../../repositories/IDoneCoolActionRepository.js';

export class ListDoneCoolActionsUseCase {
  constructor(private readonly repository: IDoneCoolActionRepository) {}

  async execute(
    pagination: PaginationDTO,
    userId?: string,
    cityId?: string,
  ): Promise<PaginatedResultDTO<DoneCoolActionResponseDTO>> {
    const result = await this.repository.list(pagination, userId, cityId);
    return {
      data: result.data.map((d) => ({
        id: d.id,
        userId: d.userId,
        description: d.description,
        neighborhood: d.neighborhood,
        street: d.street,
        actionPhotoURL: d.actionPhotoURL,
        coolActionId: d.coolActionId,
        createdAt: d.createdAt,
      })),
      meta: result.meta,
    };
  }
}
