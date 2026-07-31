"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const configuration_1 = __importDefault(require("./config/configuration"));
const typeorm_config_1 = __importDefault(require("./config/typeorm.config"));
const auth_module_1 = require("./modules/auth/auth.module");
const service_categories_module_1 = require("./modules/service-categories/service-categories.module");
const technicians_module_1 = require("./modules/technicians/technicians.module");
const addresses_module_1 = require("./modules/addresses/addresses.module");
const orders_module_1 = require("./modules/orders/orders.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const admin_module_1 = require("./modules/admin/admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, load: [configuration_1.default, typeorm_config_1.default] }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => config.getOrThrow('database'),
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            auth_module_1.AuthModule,
            service_categories_module_1.ServiceCategoriesModule,
            technicians_module_1.TechniciansModule,
            addresses_module_1.AddressesModule,
            orders_module_1.OrdersModule,
            reviews_module_1.ReviewsModule,
            admin_module_1.AdminModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map