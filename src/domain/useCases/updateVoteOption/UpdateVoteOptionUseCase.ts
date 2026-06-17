import { AppError } from '../../errors/AppError.js';
import { UpdateVoteOptionDTO } from '../../dtos/UpdateVoteOptionDTO.js';
import { VoteOptionResponseDTO } from '../../dtos/VoteOptionResponseDTO.js';
import { IVoteOptionRepository } from '../../repositories/IVoteOptionRepository.js';

export class UpdateVoteOptionUseCase {
  constructor(private readonly repository: IVoteOptionRepository) {}

  async execute(
    id: string,
    data: UpdateVoteOptionDTO,
  ): Promise<VoteOptionResponseDTO> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Opção de voto não encontrada.', 404);
    const updated = await this.repository.update(id, data);
    return {
      id: updated.id,
      optionText: updated.optionText,
      voteId: updated.voteId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
