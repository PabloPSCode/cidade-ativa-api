import { AppError } from '../../errors/AppError.js';
import { PaginationDTO } from '../../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../dtos/PaginatedResultDTO.js';
import { VoteOptionResponseDTO } from '../../dtos/VoteOptionResponseDTO.js';
import { IVoteOptionRepository } from '../../repositories/IVoteOptionRepository.js';
import { IVoteRepository } from '../../repositories/IVoteRepository.js';

export class ListVoteOptionsUseCase {
  constructor(
    private readonly repository: IVoteOptionRepository,
    private readonly voteRepository: IVoteRepository,
  ) {}

  async execute(
    pagination: PaginationDTO,
    voteId?: string,
  ): Promise<PaginatedResultDTO<VoteOptionResponseDTO>> {
    if (voteId) {
      const vote = await this.voteRepository.findById(voteId);
      if (!vote) throw new AppError('Voto não encontrado.', 404);
    }

    const result = await this.repository.list(pagination, voteId);
    return {
      data: result.data.map((v) => ({
        id: v.id,
        optionText: v.optionText,
        voteId: v.voteId,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
      })),
      meta: result.meta,
    };
  }
}
