import { AppError } from '../../errors/AppError.js';
import { UpdateDoneCoolActionDTO } from '../../dtos/UpdateDoneCoolActionDTO.js';
import { DoneCoolActionResponseDTO } from '../../dtos/DoneCoolActionResponseDTO.js';
import { IDoneCoolActionRepository } from '../../repositories/IDoneCoolActionRepository.js';

export class UpdateDoneCoolActionUseCase {
  constructor(private readonly repository: IDoneCoolActionRepository) {}

  async execute(
    id: string,
    data: UpdateDoneCoolActionDTO,
  ): Promise<DoneCoolActionResponseDTO> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Done cool action not found', 404);
    const dca = await this.repository.update(id, data);
    return {
      id: dca.id,
      userId: dca.userId,
      coolActionId: dca.coolActionId,
      solicitationId: dca.solicitationId,
      createdAt: dca.createdAt,
    };
  }
}
