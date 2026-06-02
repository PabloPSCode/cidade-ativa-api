"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
exports.env = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 3333),
    databaseUrl: process.env.DATABASE_URL ?? 'file:./dev.db',
};
//# sourceMappingURL=env.js.map