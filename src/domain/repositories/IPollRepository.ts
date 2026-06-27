import { Poll } from '../entities/Poll.js';
import { CreatePollDTO } from '../dtos/CreatePollDTO.js';
import { UpdatePollDTO } from '../dtos/UpdatePollDTO.js';
import { PaginationDTO } from '../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../dtos/PaginatedResultDTO.js';

export interface IPollRepository {
  create(data: CreatePollDTO): Promise<Poll>;
  findById(id: string): Promise<Poll | null>;
  update(id: string, data: UpdatePollDTO): Promise<Poll>;
  delete(id: string): Promise<void>;
  list(
    pagination: PaginationDTO,
    status?: string,
    cityId?: string,
  ): Promise<PaginatedResultDTO<Poll>>;
}
