import { ILogRepository } from '../../repositories/ILogRepository.js';
import { Log } from '../../entities/Log.js';
export declare class FindLogByIdUseCase {
    private readonly logRepository;
    constructor(logRepository: ILogRepository);
    execute(id: string): Promise<Log>;
}
