import { AppError } from '../../../errors/AppError.js';
import { UpdatePollDTO } from '../../../dtos/UpdatePollDTO.js';
import { PollResponseDTO } from '../../../dtos/PollResponseDTO.js';
import { IPollRepository } from '../../../repositories/IPollRepository.js';
import {
  IImageStorageService,
  IMAGE_FOLDERS,
} from '../../../services/IImageStorageService.js';

export class UpdatePollUseCase {
  constructor(
    private readonly repository: IPollRepository,
    private readonly imageStorage: IImageStorageService,
  ) {}

  async execute(id: string, data: UpdatePollDTO): Promise<PollResponseDTO> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Enquete não encontrada.', 404);
    const pollCoverUrl = data.pollCoverUrl
      ? await this.imageStorage.uploadImage(
          data.pollCoverUrl,
          IMAGE_FOLDERS.polls,
        )
      : data.pollCoverUrl;
    const updated = await this.repository.update(id, { ...data, pollCoverUrl });
    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      pollCoverUrl: updated.pollCoverUrl,
      startedAt: updated.startedAt,
      finishedAt: updated.finishedAt,
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
