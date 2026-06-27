import { VoteOption } from '../entities/VoteOption.js';
import { CreateVoteOptionDTO } from '../dtos/CreateVoteOptionDTO.js';
import { UpdateVoteOptionDTO } from '../dtos/UpdateVoteOptionDTO.js';
import { PaginationDTO } from '../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../dtos/PaginatedResultDTO.js';

export interface IVoteOptionRepository {
  create(data: CreateVoteOptionDTO): Promise<VoteOption>;
  findById(id: string): Promise<VoteOption | null>;
  update(id: string, data: UpdateVoteOptionDTO): Promise<VoteOption>;
  delete(id: string): Promise<void>;
  list(
    pagination: PaginationDTO,
    voteId?: string,
    cityId?: string,
  ): Promise<PaginatedResultDTO<VoteOption>>;
}
