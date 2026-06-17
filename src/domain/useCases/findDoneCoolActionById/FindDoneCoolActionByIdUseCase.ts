import { AppError } from '../../errors/AppError.js';
import { DoneCoolActionResponseDTO } from '../../dtos/DoneCoolActionResponseDTO.js';
import { IDoneCoolActionRepository } from '../../repositories/IDoneCoolActionRepository.js';

export class FindDoneCoolActionByIdUseCase {
  constructor(private readonly repository: IDoneCoolActionRepository) {}

  async execute(id: string): Promise<DoneCoolActionResponseDTO> {
    const dca = await this.repository.findById(id);
    if (!dca)
      throw new AppError('Registro de ação legal não encontrado.', 404);
    return {
      id: dca.id,
      userId: dca.userId,
      description: dca.description,
      neighborhood: dca.neighborhood,
      street: dca.street,
      actionPhotoURL: dca.actionPhotoURL,
      coolActionId: dca.coolActionId,
      createdAt: dca.createdAt,
    };
  }
}
