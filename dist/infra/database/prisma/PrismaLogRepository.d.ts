import { PrismaClient } from '@prisma/client';
import { ILogRepository } from '../../../domain/repositories/ILogRepository.js';
import { Log } from '../../../domain/entities/Log.js';
import { CreateLogDTO } from '../../../domain/dtos/CreateLogDTO.js';
import { UpdateLogDTO } from '../../../domain/dtos/UpdateLogDTO.js';
export declare class PrismaLogRepository implements ILogRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(data: CreateLogDTO): Promise<Log>;
    findById(id: string): Promise<Log | null>;
    findAll(page: number, perPage: number): Promise<{
        data: Log[];
        total: number;
    }>;
    update(id: string, data: UpdateLogDTO): Promise<Log>;
    delete(id: string): Promise<void>;
}
