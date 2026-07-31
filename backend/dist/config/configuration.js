"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT ?? '4000', 10),
    corsOrigin: (process.env.CORS_ORIGIN ?? 'http://localhost:3000,http://localhost:3001,http://localhost:3002')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES ?? '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES ?? '30d',
    },
});
//# sourceMappingURL=configuration.js.map