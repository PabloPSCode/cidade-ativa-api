"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLogUseCase = void 0;
const AppError_js_1 = require("../../errors/AppError.js");
class UpdateLogUseCase {
    logRepository;
    constructor(logRepository) {
        this.logRepository = logRepository;
    }
    async execute(id, data) {
        const existingLog = await this.logRepository.findById(id);
        if (!existingLog) {
            throw new AppError_js_1.AppError('Log not found', 404);
        }
        const updatedLog = await this.logRepository.update(id, data);
        return updatedLog;
    }
}
exports.UpdateLogUseCase = UpdateLogUseCase;
//# sourceMappingURL=UpdateLogUseCase.js.map