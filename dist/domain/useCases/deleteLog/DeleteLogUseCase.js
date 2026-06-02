"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteLogUseCase = void 0;
const AppError_js_1 = require("../../errors/AppError.js");
class DeleteLogUseCase {
    logRepository;
    constructor(logRepository) {
        this.logRepository = logRepository;
    }
    async execute(id) {
        const existingLog = await this.logRepository.findById(id);
        if (!existingLog) {
            throw new AppError_js_1.AppError('Log not found', 404);
        }
        await this.logRepository.delete(id);
    }
}
exports.DeleteLogUseCase = DeleteLogUseCase;
//# sourceMappingURL=DeleteLogUseCase.js.map