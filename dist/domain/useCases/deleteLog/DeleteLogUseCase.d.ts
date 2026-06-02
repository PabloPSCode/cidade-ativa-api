import { ILogRepository } from '../../repositories/ILogRepository.js';
export declare class DeleteLogUseCase {
    private readonly logRepository;
    constructor(logRepository: ILogRepository);
    execute(id: string): Promise<void>;
}
