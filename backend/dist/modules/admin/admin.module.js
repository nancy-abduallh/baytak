"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const admin_auth_controller_1 = require("./admin-auth.controller");
const admin_auth_service_1 = require("./admin-auth.service");
const jwt_admin_strategy_1 = require("./strategies/jwt-admin.strategy");
const admin_entity_1 = require("../../entities/admin.entity");
const order_entity_1 = require("../../entities/order.entity");
const user_entity_1 = require("../../entities/user.entity");
const technician_entity_1 = require("../../entities/technician.entity");
const service_category_entity_1 = require("../../entities/service-category.entity");
const orders_module_1 = require("../orders/orders.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([admin_entity_1.Admin, order_entity_1.Order, user_entity_1.User, technician_entity_1.Technician, service_category_entity_1.ServiceCategory]),
            passport_1.PassportModule,
            jwt_1.JwtModule.register({}),
            orders_module_1.OrdersModule,
        ],
        controllers: [admin_auth_controller_1.AdminAuthController, admin_controller_1.AdminController],
        providers: [admin_auth_service_1.AdminAuthService, admin_service_1.AdminService, jwt_admin_strategy_1.JwtAdminStrategy],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map