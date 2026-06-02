"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLogSchema = exports.createLogSchema = void 0;
const v4_1 = require("zod/v4");
exports.createLogSchema = v4_1.z.object({
    userId: v4_1.z.string().min(1, 'userId is required'),
    userName: v4_1.z.string().min(1, 'userName is required'),
    email: v4_1.z.string().email('Invalid email'),
    activityDescription: v4_1.z.string().min(1, 'activityDescription is required'),
});
exports.updateLogSchema = v4_1.z.object({
    userId: v4_1.z.string().min(1, 'userId is required').optional(),
    userName: v4_1.z.string().min(1, 'userName is required').optional(),
    email: v4_1.z.string().email('Invalid email').optional(),
    activityDescription: v4_1.z
        .string()
        .min(1, 'activityDescription is required')
        .optional(),
});
//# sourceMappingURL=logSchemas.js.map