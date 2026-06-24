import { Vote } from '../entities/Vote.js';
import { CreateVoteDTO } from '../dtos/CreateVoteDTO.js';
import { UpdateVoteDTO } from '../dtos/UpdateVoteDTO.js';
import { PaginationDTO } from '../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../dtos/PaginatedResultDTO.js';

export interface IVoteRepository {
  create(data: CreateVoteDTO): Promise<Vote>;
  findById(id: string): Promise<Vote | null>;
  update(id: string, data: UpdateVoteDTO): Promise<Vote>;
  delete(id: string): Promise<void>;
  list(
    pagination: PaginationDTO,
    filters?: { pollId?: string; userId?: string },
  ): Promise<PaginatedResultDTO<Vote>>;
  hasVoteOptions(voteId: string): Promise<boolean>;
}
