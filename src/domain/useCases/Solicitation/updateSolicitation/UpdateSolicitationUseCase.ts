import { AppError } from '../../../errors/AppError.js';
import { UpdateSolicitationDTO } from '../../../dtos/UpdateSolicitationDTO.js';
import { SolicitationResponseDTO } from '../../../dtos/SolicitationResponseDTO.js';
import { ISolicitationRepository } from '../../../repositories/ISolicitationRepository.js';
import {
  IImageStorageService,
  IMAGE_FOLDERS,
} from '../../../services/IImageStorageService.js';

export class UpdateSolicitationUseCase {
  constructor(
    private readonly repository: ISolicitationRepository,
    private readonly imageStorage: IImageStorageService,
  ) {}

  async execute(
    id: string,
    data: UpdateSolicitationDTO,
  ): Promise<SolicitationResponseDTO> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Solicitação não encontrada.', 404);
    const solvedImageUrls = data.solvedImageUrls?.length
      ? await this.imageStorage.uploadImages(
          data.solvedImageUrls,
          IMAGE_FOLDERS.solicitations,
        )
      : data.solvedImageUrls;
    const s = await this.repository.update(id, { ...data, solvedImageUrls });
    return {
      id: s.id,
      protocolNumber: s.protocolNumber,
      title: s.title,
      description: s.description,
      neighborhood: s.neighborhood,
      city: s.city,
      uf: s.uf,
      street: s.street,
      cep: s.cep,
      requestingUserId: s.requestingUserId,
      requestingUserName: s.requestingUserName ?? '',
      solicitationTypeId: s.solicitationTypeId,
      status: s.status,
      isCollective: s.isCollective,
      unsolvedImageUrls: s.unsolvedImageUrls,
      solvedImageUrls: s.solvedImageUrls,
      solvedDate: s.solvedDate,
      solvedCommentary: s.solvedCommentary,
      solvedUserId: s.solvedUserId,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    };
  }
}
