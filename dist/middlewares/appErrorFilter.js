"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppErrorFilter = void 0;
const common_1 = require("@nestjs/common");
const AppError_js_1 = require("../domain/errors/AppError.js");
let AppErrorFilter = class AppErrorFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (exception instanceof AppError_js_1.AppError) {
            response.status(exception.statusCode).json({
                message: exception.message,
            });
            return;
        }
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            response.status(status).json(typeof exceptionResponse === 'string'
                ? { message: exceptionResponse }
                : exceptionResponse);
            return;
        }
        console.error(exception);
        response.status(500).json({
            message: 'Internal server error',
        });
    }
};
exports.AppErrorFilter = AppErrorFilter;
exports.AppErrorFilter = AppErrorFilter = __decorate([
    (0, common_1.Catch)()
], AppErrorFilter);
//# sourceMappingURL=appErrorFilter.js.map