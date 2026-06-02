"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListLogsUseCase = void 0;
const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;
const MAX_PER_PAGE = 100;
class ListLogsUseCase {
    logRepository;
    constructor(logRepository) {
        this.logRepository = logRepository;
    }
    async execute(pagination) {
        const page = Math.max(pagination?.page ?? DEFAULT_PAGE, 1);
        const perPage = Math.min(Math.max(pagination?.perPage ?? DEFAULT_PER_PAGE, 1), MAX_PER_PAGE);
        const { data, total } = await this.logRepository.findAll(page, perPage);
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
exports.ListLogsUseCase = ListLogsUseCase;
//# sourceMappingURL=ListLogsUseCase.js.map