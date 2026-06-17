import { AppError } from '../../errors/AppError.js';
import { IPollRepository } from '../../repositories/IPollRepository.js';

export class DeletePollUseCase {
  constructor(private readonly repository: IPollRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Enquete não encontrada.', 404);
    await this.repository.delete(id);
  }
}
