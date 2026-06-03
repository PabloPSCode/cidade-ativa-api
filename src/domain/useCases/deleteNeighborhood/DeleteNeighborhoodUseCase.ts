import { AppError } from '../../errors/AppError.js';
import { INeighborhoodRepository } from '../../repositories/INeighborhoodRepository.js';

export class DeleteNeighborhoodUseCase {
  constructor(private readonly repository: INeighborhoodRepository) {}
  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Neighborhood not found', 404);
    await this.repository.delete(id);
  }
}
