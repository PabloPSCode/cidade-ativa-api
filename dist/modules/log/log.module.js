"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogModule = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const LogController_js_1 = require("../../infra/controllers/LogController.js");
const PrismaLogRepository_js_1 = require("../../infra/database/prisma/PrismaLogRepository.js");
const CreateLogUseCase_js_1 = require("../../domain/useCases/createLog/CreateLogUseCase.js");
const FindLogByIdUseCase_js_1 = require("../../domain/useCases/findLogById/FindLogByIdUseCase.js");
const ListLogsUseCase_js_1 = require("../../domain/useCases/listLogs/ListLogsUseCase.js");
const UpdateLogUseCase_js_1 = require("../../domain/useCases/updateLog/UpdateLogUseCase.js");
const DeleteLogUseCase_js_1 = require("../../domain/useCases/deleteLog/DeleteLogUseCase.js");
let LogModule = class LogModule {
};
exports.LogModule = LogModule;
exports.LogModule = LogModule = __decorate([
    (0, common_1.Module)({
        controllers: [LogController_js_1.LogController],
        providers: [
            {
                provide: 'PRISMA_CLIENT',
                useFactory: () => {
                    const prisma = new client_1.PrismaClient();
                    return prisma;
                },
            },
            {
                provide: 'ILogRepository',
                useClass: PrismaLogRepository_js_1.PrismaLogRepository,
            },
            {
                provide: 'CreateLogUseCase',
                useFactory: (logRepository) => new CreateLogUseCase_js_1.CreateLogUseCase(logRepository),
                inject: ['ILogRepository'],
            },
            {
                provide: 'FindLogByIdUseCase',
                useFactory: (logRepository) => new FindLogByIdUseCase_js_1.FindLogByIdUseCase(logRepository),
                inject: ['ILogRepository'],
            },
            {
                provide: 'ListLogsUseCase',
                useFactory: (logRepository) => new ListLogsUseCase_js_1.ListLogsUseCase(logRepository),
                inject: ['ILogRepository'],
            },
            {
                provide: 'UpdateLogUseCase',
                useFactory: (logRepository) => new UpdateLogUseCase_js_1.UpdateLogUseCase(logRepository),
                inject: ['ILogRepository'],
            },
            {
                provide: 'DeleteLogUseCase',
                useFactory: (logRepository) => new DeleteLogUseCase_js_1.DeleteLogUseCase(logRepository),
                inject: ['ILogRepository'],
            },
        ],
    })
], LogModule);
//# sourceMappingURL=log.module.js.map