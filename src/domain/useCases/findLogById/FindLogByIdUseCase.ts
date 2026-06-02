import { ILogRepository } from '../../repositories/ILogRepository.js';
import { Log } from '../../entities/Log.js';
import { AppError } from '../../errors/AppError.js';

export class FindLogByIdUseCase {
  constructor(private readonly logRepository: ILogRepository) {}

  async execute(id: string): Promise<Log> {
    const log = await this.logRepository.findById(id);

    if (!log) {
      throw new AppError('Log not found', 404);
    }

    return log;
  }
}
