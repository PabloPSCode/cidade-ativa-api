import { ILogRepository } from '../../../repositories/ILogRepository.js';
import { UpdateLogDTO } from '../../../dtos/UpdateLogDTO.js';
import { Log } from '../../../entities/Log.js';
import { AppError } from '../../../errors/AppError.js';

export class UpdateLogUseCase {
  constructor(private readonly logRepository: ILogRepository) {}

  async execute(id: string, data: UpdateLogDTO): Promise<Log> {
    const existingLog = await this.logRepository.findById(id);

    if (!existingLog) {
      throw new AppError('Log not found', 404);
    }

    const updatedLog = await this.logRepository.update(id, data);

    return updatedLog;
  }
}
