import { ILogRepository } from '../../repositories/ILogRepository.js';
import { UpdateLogDTO } from '../../dtos/UpdateLogDTO.js';
import { Log } from '../../entities/Log.js';
export declare class UpdateLogUseCase {
    private readonly logRepository;
    constructor(logRepository: ILogRepository);
    execute(id: string, data: UpdateLogDTO): Promise<Log>;
}
