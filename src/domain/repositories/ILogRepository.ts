import { Log } from '../entities/Log.js';
import { CreateLogDTO } from '../dtos/CreateLogDTO.js';
import { UpdateLogDTO } from '../dtos/UpdateLogDTO.js';

export interface ILogRepository {
  create(data: CreateLogDTO): Promise<Log>;
  findById(id: string): Promise<Log | null>;
  findAll(
    page: number,
    perPage: number,
  ): Promise<{ data: Log[]; total: number }>;
  update(id: string, data: UpdateLogDTO): Promise<Log>;
  delete(id: string): Promise<void>;
}
