import { ILogRepository } from '../../repositories/ILogRepository.js';
import { PaginationDTO } from '../../dtos/PaginationDTO.js';
import { PaginatedResult } from '../../dtos/PaginatedResultDTO.js';
import { Log } from '../../entities/Log.js';
export declare class ListLogsUseCase {
    private readonly logRepository;
    constructor(logRepository: ILogRepository);
    execute(pagination?: Partial<PaginationDTO>): Promise<PaginatedResult<Log>>;
}
