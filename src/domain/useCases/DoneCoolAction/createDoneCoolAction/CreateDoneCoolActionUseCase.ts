import { AppError } from '../../../errors/AppError.js';
import { CreateDoneCoolActionDTO } from '../../../dtos/CreateDoneCoolActionDTO.js';
import { DoneCoolActionResponseDTO } from '../../../dtos/DoneCoolActionResponseDTO.js';
import { IDoneCoolActionRepository } from '../../../repositories/IDoneCoolActionRepository.js';
import { IUserRepository } from '../../../repositories/IUserRepository.js';
import { ICoolActionRepository } from '../../../repositories/ICoolActionRepository.js';

export class CreateDoneCoolActionUseCase {
  constructor(
    private readonly repository: IDoneCoolActionRepository,
    private readonly userRepository: IUserRepository,
    private readonly coolActionRepository: ICoolActionRepository,
  ) {}

  async execute(
    data: CreateDoneCoolActionDTO,
  ): Promise<DoneCoolActionResponseDTO> {
    const user = await this.userRepository.findById(data.userId);
    if (!user) throw new AppError('Usuário não encontrado.', 404);
    const coolAction = await this.coolActionRepository.findById(
      data.coolActionId,
    );
    if (!coolAction) throw new AppError('Ação legal não encontrada.', 404);
    const dca = await this.repository.create(data);
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
