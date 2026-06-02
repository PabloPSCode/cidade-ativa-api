"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindLogByIdUseCase = void 0;
const AppError_js_1 = require("../../errors/AppError.js");
class FindLogByIdUseCase {
    logRepository;
    constructor(logRepository) {
        this.logRepository = logRepository;
    }
    async execute(id) {
        const log = await this.logRepository.findById(id);
        if (!log) {
            throw new AppError_js_1.AppError('Log not found', 404);
        }
        return log;
    }
}
exports.FindLogByIdUseCase = FindLogByIdUseCase;
//# sourceMappingURL=FindLogByIdUseCase.js.map