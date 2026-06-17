import { DoneCoolAction } from '../entities/DoneCoolAction.js';
import { CreateDoneCoolActionDTO } from '../dtos/CreateDoneCoolActionDTO.js';
import { UpdateDoneCoolActionDTO } from '../dtos/UpdateDoneCoolActionDTO.js';
import { DoneCoolActionRankingDTO } from '../dtos/DoneCoolActionRankingDTO.js';
import { PaginationDTO } from '../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../dtos/PaginatedResultDTO.js';

export type UserPointsAggregate = Omit<DoneCoolActionRankingDTO, 'rank'>;

export interface IDoneCoolActionRepository {
  create(data: CreateDoneCoolActionDTO): Promise<DoneCoolAction>;
  findById(id: string): Promise<DoneCoolAction | null>;
  update(id: string, data: UpdateDoneCoolActionDTO): Promise<DoneCoolAction>;
  delete(id: string): Promise<void>;
  list(
    pagination: PaginationDTO,
    userId?: string,
  ): Promise<PaginatedResultDTO<DoneCoolAction>>;
  rankingByPoints(): Promise<UserPointsAggregate[]>;
}
