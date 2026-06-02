import { ILogRepository } from '../../repositories/ILogRepository.js';
import { CreateLogDTO } from '../../dtos/CreateLogDTO.js';
import { Log } from '../../entities/Log.js';
export declare class CreateLogUseCase {
    private readonly logRepository;
    constructor(logRepository: ILogRepository);
    execute(data: CreateLogDTO): Promise<Log>;
}
