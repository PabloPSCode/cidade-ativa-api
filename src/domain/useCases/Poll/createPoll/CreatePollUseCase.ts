import { CreatePollDTO } from '../../../dtos/CreatePollDTO.js';
import { PollResponseDTO } from '../../../dtos/PollResponseDTO.js';
import { IPollRepository } from '../../../repositories/IPollRepository.js';

export class CreatePollUseCase {
  constructor(private readonly repository: IPollRepository) {}

  async execute(data: CreatePollDTO): Promise<PollResponseDTO> {
    const poll = await this.repository.create(data);
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
