import { ILogRepository } from '../../../repositories/ILogRepository.js';
import { PaginationDTO } from '../../../dtos/PaginationDTO.js';
import { PaginatedResult } from '../../../dtos/PaginatedResultDTO.js';
import { Log } from '../../../entities/Log.js';

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;
const MAX_PER_PAGE = 100;

export class ListLogsUseCase {
  constructor(private readonly logRepository: ILogRepository) {}

  async execute(
    pagination?: Partial<PaginationDTO>,
    cityId?: string,
  ): Promise<PaginatedResult<Log>> {
    const page = Math.max(pagination?.page ?? DEFAULT_PAGE, 1);
    const perPage = Math.min(
      Math.max(pagination?.perPage ?? DEFAULT_PER_PAGE, 1),
      MAX_PER_PAGE,
    );

    const { data, total } = await this.logRepository.findAll(
      page,
      perPage,
      cityId,
    );

    return {
      data,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }
}
