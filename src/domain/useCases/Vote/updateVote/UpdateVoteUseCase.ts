import { AppError } from '../../../errors/AppError.js';
import { UpdateVoteDTO } from '../../../dtos/UpdateVoteDTO.js';
import { VoteResponseDTO } from '../../../dtos/VoteResponseDTO.js';
import { IVoteRepository } from '../../../repositories/IVoteRepository.js';

export class UpdateVoteUseCase {
  constructor(private readonly repository: IVoteRepository) {}

  async execute(id: string, data: UpdateVoteDTO): Promise<VoteResponseDTO> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Voto não encontrado.', 404);
    const updated = await this.repository.update(id, data);
    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      pollId: updated.pollId,
      userId: updated.userId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
