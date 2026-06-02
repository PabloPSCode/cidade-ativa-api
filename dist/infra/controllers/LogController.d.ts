import { CreateLogUseCase } from '../../domain/useCases/createLog/CreateLogUseCase.js';
import { FindLogByIdUseCase } from '../../domain/useCases/findLogById/FindLogByIdUseCase.js';
import { ListLogsUseCase } from '../../domain/useCases/listLogs/ListLogsUseCase.js';
import { UpdateLogUseCase } from '../../domain/useCases/updateLog/UpdateLogUseCase.js';
import { DeleteLogUseCase } from '../../domain/useCases/deleteLog/DeleteLogUseCase.js';
import type { CreateLogInput, UpdateLogInput } from '../validation/schemas/logSchemas.js';
export declare class LogController {
    private readonly createLogUseCase;
    private readonly findLogByIdUseCase;
    private readonly listLogsUseCase;
    private readonly updateLogUseCase;
    private readonly deleteLogUseCase;
    constructor(createLogUseCase: CreateLogUseCase, findLogByIdUseCase: FindLogByIdUseCase, listLogsUseCase: ListLogsUseCase, updateLogUseCase: UpdateLogUseCase, deleteLogUseCase: DeleteLogUseCase);
    create(body: CreateLogInput): Promise<{
        data: import("../../domain/entities/Log.js").Log;
    }>;
    list(page?: string, perPage?: string): Promise<import("../../domain/dtos/PaginatedResultDTO.js").PaginatedResult<import("../../domain/entities/Log.js").Log>>;
    findById(id: string): Promise<{
        data: import("../../domain/entities/Log.js").Log;
    }>;
    update(id: string, body: UpdateLogInput): Promise<{
        data: import("../../domain/entities/Log.js").Log;
    }>;
    delete(id: string): Promise<void>;
}
