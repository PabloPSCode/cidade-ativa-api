import { AppError } from '../../../errors/AppError.js';
import { IVoteRepository } from '../../../repositories/IVoteRepository.js';

export class DeleteVoteUseCase {
  constructor(private readonly repository: IVoteRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Voto não encontrado.', 404);

    const hasVoteOptions = await this.repository.hasVoteOptions(id);
    if (hasVoteOptions)
      throw new AppError(
        'Não é possível excluir um voto que possui opções de voto vinculadas.',
        409,
      );

    await this.repository.delete(id);
  }
}
