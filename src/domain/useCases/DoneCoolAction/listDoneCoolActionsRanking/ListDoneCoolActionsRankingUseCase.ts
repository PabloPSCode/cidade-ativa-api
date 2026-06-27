import { DoneCoolActionRankingDTO } from '../../../dtos/DoneCoolActionRankingDTO.js';
import { IDoneCoolActionRepository } from '../../../repositories/IDoneCoolActionRepository.js';

export class ListDoneCoolActionsRankingUseCase {
  constructor(private readonly repository: IDoneCoolActionRepository) {}

  async execute(cityId?: string): Promise<DoneCoolActionRankingDTO[]> {
    const aggregates = await this.repository.rankingByPoints(cityId);
    return aggregates.map((aggregate, index) => ({
      rank: index + 1,
      ...aggregate,
    }));
  }
}
