import { AppError } from '../../../errors/AppError.js';
import { SolveSolicitationDTO } from '../../../dtos/SolveSolicitationDTO.js';
import { SolicitationResponseDTO } from '../../../dtos/SolicitationResponseDTO.js';
import { ISolicitationRepository } from '../../../repositories/ISolicitationRepository.js';
import {
  IImageStorageService,
  IMAGE_FOLDERS,
} from '../../../services/IImageStorageService.js';

export class SolveSolicitationUseCase {
  constructor(
    private readonly repository: ISolicitationRepository,
    private readonly imageStorage: IImageStorageService,
  ) {}

  async execute(
    id: string,
    data: SolveSolicitationDTO,
  ): Promise<SolicitationResponseDTO> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Solicitação não encontrada.', 404);
    const solvedImageUrls = await this.imageStorage.uploadImages(
      data.solvedImageUrls,
      IMAGE_FOLDERS.solicitations,
    );
    const s = await this.repository.update(id, {
      status: 'resolved',
      solvedDate: new Date(),
      solvedImageUrls,
      solvedCommentary: data.solvedCommentary,
      solvedUserId: data.solvedUserId,
    });
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
