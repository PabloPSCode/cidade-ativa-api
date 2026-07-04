import { AppError } from '../../../errors/AppError.js';
import { UpdateDoneCoolActionDTO } from '../../../dtos/UpdateDoneCoolActionDTO.js';
import { DoneCoolActionResponseDTO } from '../../../dtos/DoneCoolActionResponseDTO.js';
import { IDoneCoolActionRepository } from '../../../repositories/IDoneCoolActionRepository.js';
import {
  IImageStorageService,
  IMAGE_FOLDERS,
} from '../../../services/IImageStorageService.js';

export class UpdateDoneCoolActionUseCase {
  constructor(
    private readonly repository: IDoneCoolActionRepository,
    private readonly imageStorage: IImageStorageService,
  ) {}

  async execute(
    id: string,
    data: UpdateDoneCoolActionDTO,
  ): Promise<DoneCoolActionResponseDTO> {
    const existing = await this.repository.findById(id);
    if (!existing)
      throw new AppError('Registro de ação legal não encontrado.', 404);
    const actionPhotoURL = data.actionPhotoURL
      ? await this.imageStorage.uploadImage(
          data.actionPhotoURL,
          IMAGE_FOLDERS.doneCoolActions,
        )
      : data.actionPhotoURL;
    const dca = await this.repository.update(id, { ...data, actionPhotoURL });
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
