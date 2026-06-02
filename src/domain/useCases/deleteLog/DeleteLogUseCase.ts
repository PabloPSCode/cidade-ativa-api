import { ILogRepository } from '../../repositories/ILogRepository.js';
import { AppError } from '../../errors/AppError.js';

export class DeleteLogUseCase {
  constructor(private readonly logRepository: ILogRepository) {}

  async execute(id: string): Promise<void> {
    const existingLog = await this.logRepository.findById(id);

    if (!existingLog) {
      throw new AppError('Log not found', 404);
    }

    await this.logRepository.delete(id);
  }
}
