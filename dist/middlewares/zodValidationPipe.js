"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodValidationPipe = void 0;
const common_1 = require("@nestjs/common");
class ZodValidationPipe {
    schema;
    constructor(schema) {
        this.schema = schema;
    }
    transform(value) {
        const result = this.schema.safeParse(value);
        if (!result.success) {
            const fieldErrors = {};
            for (const issue of result.error.issues) {
                const path = issue.path.join('.');
                if (!fieldErrors[path]) {
                    fieldErrors[path] = [];
                }
                fieldErrors[path].push(issue.message);
            }
            throw new common_1.BadRequestException({
                message: 'Validation error',
                errors: { fieldErrors },
            });
        }
        return result.data;
    }
}
exports.ZodValidationPipe = ZodValidationPipe;
//# sourceMappingURL=zodValidationPipe.js.map