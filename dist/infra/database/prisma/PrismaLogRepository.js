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
exports.PrismaLogRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const PrismaLogMapper_js_1 = require("./mappers/PrismaLogMapper.js");
let PrismaLogRepository = class PrismaLogRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const log = await this.prisma.log.create({
            data: {
                userId: data.userId,
                userName: data.userName,
                email: data.email,
                activityDescription: data.activityDescription,
            },
        });
        return PrismaLogMapper_js_1.PrismaLogMapper.toDomain(log);
    }
    async findById(id) {
        const log = await this.prisma.log.findUnique({
            where: { id },
        });
        if (!log) {
            return null;
        }
        return PrismaLogMapper_js_1.PrismaLogMapper.toDomain(log);
    }
    async findAll(page, perPage) {
        const [logs, total] = await Promise.all([
            this.prisma.log.findMany({
                skip: (page - 1) * perPage,
                take: perPage,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.log.count(),
        ]);
        return {
            data: logs.map(PrismaLogMapper_js_1.PrismaLogMapper.toDomain),
            total,
        };
    }
    async update(id, data) {
        const updatedLog = await this.prisma.log.update({
            where: { id },
            data: {
                ...(data.userId !== undefined && { userId: data.userId }),
                ...(data.userName !== undefined && { userName: data.userName }),
                ...(data.email !== undefined && { email: data.email }),
                ...(data.activityDescription !== undefined && {
                    activityDescription: data.activityDescription,
                }),
            },
        });
        return PrismaLogMapper_js_1.PrismaLogMapper.toDomain(updatedLog);
    }
    async delete(id) {
        await this.prisma.log.delete({
            where: { id },
        });
    }
};
exports.PrismaLogRepository = PrismaLogRepository;
exports.PrismaLogRepository = PrismaLogRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PRISMA_CLIENT')),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], PrismaLogRepository);
//# sourceMappingURL=PrismaLogRepository.js.map