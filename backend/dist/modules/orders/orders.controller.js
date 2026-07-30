"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_status_dto_1 = require("./dto/update-order-status.dto");
let OrdersController = class OrdersController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(user, dto) {
        return this.service.create(user.id, dto);
    }
    findMine(user, userId) {
        if (user.id !== userId)
            throw new common_1.ForbiddenException('لا تملك صلاحية الوصول لطلبات هذا المستخدم');
        return this.service.findMine(user.id);
    }
    findOne(user, id) {
        return this.service.findOne(id, user.id);
    }
    updateStatus(id, dto) {
        return this.service.updateStatus(id, dto);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)('orders'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('users/:userId/orders'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('orders/:id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map