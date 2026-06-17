import { AppError } from '../../../errors/AppError.js';
import { VoteResponseDTO } from '../../../dtos/VoteResponseDTO.js';
import { IVoteRepository } from '../../../repositories/IVoteRepository.js';

export class FindVoteByIdUseCase {
  constructor(private readonly repository: IVoteRepository) {}

  async execute(id: string): Promise<VoteResponseDTO> {
    const vote = await this.repository.findById(id);
    if (!vote) throw new AppError('Voto não encontrado.', 404);
    return {
      id: vote.id,
      title: vote.title,
      description: vote.description,
      pollId: vote.pollId,
      userId: vote.userId,
      createdAt: vote.createdAt,
      updatedAt: vote.updatedAt,
    };
  }
}
