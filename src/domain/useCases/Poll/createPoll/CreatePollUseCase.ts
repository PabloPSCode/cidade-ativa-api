import { CreatePollDTO } from '../../../dtos/CreatePollDTO.js';
import { PollResponseDTO } from '../../../dtos/PollResponseDTO.js';
import { IPollRepository } from '../../../repositories/IPollRepository.js';
import {
  IImageStorageService,
  IMAGE_FOLDERS,
} from '../../../services/IImageStorageService.js';

export class CreatePollUseCase {
  constructor(
    private readonly repository: IPollRepository,
    private readonly imageStorage: IImageStorageService,
  ) {}

  async execute(data: CreatePollDTO): Promise<PollResponseDTO> {
    const pollCoverUrl = await this.imageStorage.uploadImage(
      data.pollCoverUrl,
      IMAGE_FOLDERS.polls,
    );
    const poll = await this.repository.create({ ...data, pollCoverUrl });
    return {
      id: poll.id,
      title: poll.title,
      description: poll.description,
      pollCoverUrl: poll.pollCoverUrl,
      startedAt: poll.startedAt,
      finishedAt: poll.finishedAt,
      status: poll.status,
      createdAt: poll.createdAt,
      updatedAt: poll.updatedAt,
    };
  }
}
