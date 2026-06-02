import { ILogRepository } from '../../repositories/ILogRepository.js';
import { CreateLogDTO } from '../../dtos/CreateLogDTO.js';
import { Log } from '../../entities/Log.js';

export class CreateLogUseCase {
  constructor(private readonly logRepository: ILogRepository) {}

  async execute(data: CreateLogDTO): Promise<Log> {
    const log = await this.logRepository.create(data);

    return log;
  }
}
