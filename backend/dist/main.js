"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.setGlobalPrefix('api/v1');
    app.enableCors({ origin: config.get('corsOrigin'), credentials: true });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    const port = config.getOrThrow('port');
    await app.listen(port);
    console.log(`Baytak API running on http://localhost:${port}/api/v1`);
}
bootstrap();
//# sourceMappingURL=main.js.map