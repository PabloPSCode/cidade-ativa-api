import { AppError } from '../../errors/AppError.js';
import { ICoolActionRepository } from '../../repositories/ICoolActionRepository.js';

export class DeleteCoolActionUseCase {
  constructor(private readonly repository: ICoolActionRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Ação legal não encontrada.', 404);
    await this.repository.delete(id);
  }
}
