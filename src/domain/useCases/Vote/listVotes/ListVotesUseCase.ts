import { AppError } from '../../../errors/AppError.js';
import { PaginationDTO } from '../../../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../../dtos/PaginatedResultDTO.js';
import { VoteResponseDTO } from '../../../dtos/VoteResponseDTO.js';
import { IVoteRepository } from '../../../repositories/IVoteRepository.js';
import { IPollRepository } from '../../../repositories/IPollRepository.js';

export class ListVotesUseCase {
  constructor(
    private readonly repository: IVoteRepository,
    private readonly pollRepository: IPollRepository,
  ) {}

  async execute(
    pagination: PaginationDTO,
    filters?: { pollId?: string; userId?: string },
  ): Promise<PaginatedResultDTO<VoteResponseDTO>> {
    if (filters?.pollId) {
      const poll = await this.pollRepository.findById(filters.pollId);
      if (!poll) throw new AppError('Enquete não encontrada.', 404);
    }

    const result = await this.repository.list(pagination, filters);
    return {
      data: result.data.map((v) => ({
        id: v.id,
        title: v.title,
        description: v.description,
        pollId: v.pollId,
        userId: v.userId,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
      })),
      meta: result.meta,
    };
  }
}
