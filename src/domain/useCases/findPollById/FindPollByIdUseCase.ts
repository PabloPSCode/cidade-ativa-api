import { AppError } from '../../errors/AppError.js';
import { PollResponseDTO } from '../../dtos/PollResponseDTO.js';
import { IPollRepository } from '../../repositories/IPollRepository.js';

export class FindPollByIdUseCase {
  constructor(private readonly repository: IPollRepository) {}

  async execute(id: string): Promise<PollResponseDTO> {
    const poll = await this.repository.findById(id);
    if (!poll) throw new AppError('Enquete não encontrada.', 404);
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
