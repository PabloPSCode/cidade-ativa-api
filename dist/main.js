"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_js_1 = require("./app.module.js");
const appErrorFilter_js_1 = require("./middlewares/appErrorFilter.js");
const env_js_1 = require("./infra/config/env.js");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_js_1.AppModule);
    app.useGlobalFilters(new appErrorFilter_js_1.AppErrorFilter());
    app.enableCors();
    await app.listen(env_js_1.env.port);
    console.log(`Server running on http://localhost:${env_js_1.env.port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map