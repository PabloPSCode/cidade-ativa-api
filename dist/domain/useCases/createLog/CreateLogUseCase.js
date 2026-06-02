"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLogUseCase = void 0;
class CreateLogUseCase {
    logRepository;
    constructor(logRepository) {
        this.logRepository = logRepository;
    }
    async execute(data) {
        const log = await this.logRepository.create(data);
        return log;
    }
}
exports.CreateLogUseCase = CreateLogUseCase;
//# sourceMappingURL=CreateLogUseCase.js.map