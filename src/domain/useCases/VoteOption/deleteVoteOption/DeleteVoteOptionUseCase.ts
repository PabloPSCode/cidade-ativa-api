import { AppError } from '../../../errors/AppError.js';
import { IVoteOptionRepository } from '../../../repositories/IVoteOptionRepository.js';

export class DeleteVoteOptionUseCase {
  constructor(private readonly repository: IVoteOptionRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Opção de voto não encontrada.', 404);
    await this.repository.delete(id);
  }
}
