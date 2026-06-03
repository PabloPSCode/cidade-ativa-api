import { AppError } from '../../errors/AppError.js';
import { ICityRepository } from '../../repositories/ICityRepository.js';

export class DeleteCityUseCase {
  constructor(private readonly repository: ICityRepository) {}
  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('City not found', 404);
    const hasNeighborhoods = await this.repository.hasNeighborhoods(id);
    if (hasNeighborhoods) throw new AppError('Cannot delete a city that has linked neighborhoods', 400);
    await this.repository.delete(id);
  }
}
