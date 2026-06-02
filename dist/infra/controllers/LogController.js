"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogController = void 0;
const common_1 = require("@nestjs/common");
const CreateLogUseCase_js_1 = require("../../domain/useCases/createLog/CreateLogUseCase.js");
const FindLogByIdUseCase_js_1 = require("../../domain/useCases/findLogById/FindLogByIdUseCase.js");
const ListLogsUseCase_js_1 = require("../../domain/useCases/listLogs/ListLogsUseCase.js");
const UpdateLogUseCase_js_1 = require("../../domain/useCases/updateLog/UpdateLogUseCase.js");
const DeleteLogUseCase_js_1 = require("../../domain/useCases/deleteLog/DeleteLogUseCase.js");
const zodValidationPipe_js_1 = require("../../middlewares/zodValidationPipe.js");
const logSchemas_js_1 = require("../validation/schemas/logSchemas.js");
let LogController = class LogController {
    createLogUseCase;
    findLogByIdUseCase;
    listLogsUseCase;
    updateLogUseCase;
    deleteLogUseCase;
    constructor(createLogUseCase, findLogByIdUseCase, listLogsUseCase, updateLogUseCase, deleteLogUseCase) {
        this.createLogUseCase = createLogUseCase;
        this.findLogByIdUseCase = findLogByIdUseCase;
        this.listLogsUseCase = listLogsUseCase;
        this.updateLogUseCase = updateLogUseCase;
        this.deleteLogUseCase = deleteLogUseCase;
    }
    async create(body) {
        const log = await this.createLogUseCase.execute(body);
        return { data: log };
    }
    async list(page, perPage) {
        const result = await this.listLogsUseCase.execute({
            page: page ? Number(page) : undefined,
            perPage: perPage ? Number(perPage) : undefined,
        });
        return result;
    }
    async findById(id) {
        const log = await this.findLogByIdUseCase.execute(id);
        return { data: log };
    }
    async update(id, body) {
        const log = await this.updateLogUseCase.execute(id, body);
        return { data: log };
    }
    async delete(id) {
        await this.deleteLogUseCase.execute(id);
    }
};
exports.LogController = LogController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new zodValidationPipe_js_1.ZodValidationPipe(logSchemas_js_1.createLogSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LogController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LogController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LogController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new zodValidationPipe_js_1.ZodValidationPipe(logSchemas_js_1.updateLogSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LogController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LogController.prototype, "delete", null);
exports.LogController = LogController = __decorate([
    (0, common_1.Controller)('logs'),
    __param(0, (0, common_1.Inject)('CreateLogUseCase')),
    __param(1, (0, common_1.Inject)('FindLogByIdUseCase')),
    __param(2, (0, common_1.Inject)('ListLogsUseCase')),
    __param(3, (0, common_1.Inject)('UpdateLogUseCase')),
    __param(4, (0, common_1.Inject)('DeleteLogUseCase')),
    __metadata("design:paramtypes", [CreateLogUseCase_js_1.CreateLogUseCase,
        FindLogByIdUseCase_js_1.FindLogByIdUseCase,
        ListLogsUseCase_js_1.ListLogsUseCase,
        UpdateLogUseCase_js_1.UpdateLogUseCase,
        DeleteLogUseCase_js_1.DeleteLogUseCase])
], LogController);
//# sourceMappingURL=LogController.js.map