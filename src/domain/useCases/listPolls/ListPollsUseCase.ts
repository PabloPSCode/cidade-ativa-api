import { PaginationDTO } from '../../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../dtos/PaginatedResultDTO.js';
import { PollResponseDTO } from '../../dtos/PollResponseDTO.js';
import { IPollRepository } from '../../repositories/IPollRepository.js';

export class ListPollsUseCase {
  constructor(private readonly repository: IPollRepository) {}

  async execute(
    pagination: PaginationDTO,
    status?: string,
  ): Promise<PaginatedResultDTO<PollResponseDTO>> {
    const result = await this.repository.list(pagination, status);
    return {
      data: result.data.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        pollCoverUrl: p.pollCoverUrl,
        startedAt: p.startedAt,
        finishedAt: p.finishedAt,
        status: p.status,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      meta: result.meta,
    };
  }
}
