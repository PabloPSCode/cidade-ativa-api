import { AppError } from '../../errors/AppError.js';
import { DoneCoolActionResponseDTO } from '../../dtos/DoneCoolActionResponseDTO.js';
import { IDoneCoolActionRepository } from '../../repositories/IDoneCoolActionRepository.js';

export class FindDoneCoolActionByIdUseCase {
  constructor(private readonly repository: IDoneCoolActionRepository) {}

  async execute(id: string): Promise<DoneCoolActionResponseDTO> {
    const dca = await this.repository.findById(id);
    if (!dca) throw new AppError('Done cool action not found', 404);
    return {
      id: dca.id,
      userId: dca.userId,
      coolActionId: dca.coolActionId,
      solicitationId: dca.solicitationId,
      createdAt: dca.createdAt,
    };
  }
}
