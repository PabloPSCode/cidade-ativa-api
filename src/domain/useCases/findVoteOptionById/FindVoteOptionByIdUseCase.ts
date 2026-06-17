import { AppError } from '../../errors/AppError.js';
import { VoteOptionResponseDTO } from '../../dtos/VoteOptionResponseDTO.js';
import { IVoteOptionRepository } from '../../repositories/IVoteOptionRepository.js';

export class FindVoteOptionByIdUseCase {
  constructor(private readonly repository: IVoteOptionRepository) {}

  async execute(id: string): Promise<VoteOptionResponseDTO> {
    const voteOption = await this.repository.findById(id);
    if (!voteOption) throw new AppError('Opção de voto não encontrada.', 404);
    return {
      id: voteOption.id,
      optionText: voteOption.optionText,
      voteId: voteOption.voteId,
      createdAt: voteOption.createdAt,
      updatedAt: voteOption.updatedAt,
    };
  }
}
