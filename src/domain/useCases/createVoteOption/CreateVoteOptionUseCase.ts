import { AppError } from '../../errors/AppError.js';
import { CreateVoteOptionDTO } from '../../dtos/CreateVoteOptionDTO.js';
import { VoteOptionResponseDTO } from '../../dtos/VoteOptionResponseDTO.js';
import { IVoteOptionRepository } from '../../repositories/IVoteOptionRepository.js';
import { IVoteRepository } from '../../repositories/IVoteRepository.js';

export class CreateVoteOptionUseCase {
  constructor(
    private readonly repository: IVoteOptionRepository,
    private readonly voteRepository: IVoteRepository,
  ) {}

  async execute(data: CreateVoteOptionDTO): Promise<VoteOptionResponseDTO> {
    const vote = await this.voteRepository.findById(data.voteId);
    if (!vote) throw new AppError('Voto não encontrado.', 404);

    const voteOption = await this.repository.create(data);
    return {
      id: voteOption.id,
      optionText: voteOption.optionText,
      voteId: voteOption.voteId,
      createdAt: voteOption.createdAt,
      updatedAt: voteOption.updatedAt,
    };
  }
}
