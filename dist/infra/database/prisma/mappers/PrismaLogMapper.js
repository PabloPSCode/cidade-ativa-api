"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaLogMapper = void 0;
const Log_js_1 = require("../../../../domain/entities/Log.js");
class PrismaLogMapper {
    static toDomain(raw) {
        return new Log_js_1.Log(raw.id, raw.userId, raw.userName, raw.email, raw.activityDescription, raw.createdAt);
    }
    static toPersistence(log) {
        return {
            id: log.id,
            userId: log.userId,
            userName: log.userName,
            email: log.email,
            activityDescription: log.activityDescription,
            createdAt: log.createdAt,
        };
    }
}
exports.PrismaLogMapper = PrismaLogMapper;
//# sourceMappingURL=PrismaLogMapper.js.map