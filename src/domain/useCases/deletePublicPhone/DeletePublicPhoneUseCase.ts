import { AppError } from '../../errors/AppError.js';
import { IPublicPhoneRepository } from '../../repositories/IPublicPhoneRepository.js';

export class DeletePublicPhoneUseCase {
  constructor(private readonly repository: IPublicPhoneRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Public phone not found', 404);
    await this.repository.delete(id);
  }
}
