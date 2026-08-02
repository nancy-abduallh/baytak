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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_admin_guard_1 = require("./guards/jwt-admin.guard");
const admin_service_1 = require("./admin.service");
const update_order_status_dto_1 = require("../orders/dto/update-order-status.dto");
const technician_flags_dto_1 = require("./dto/technician-flags.dto");
const update_user_blocked_dto_1 = require("./dto/update-user-blocked.dto");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const create_technician_dto_1 = require("./dto/create-technician.dto");
const update_technician_dto_1 = require("./dto/update-technician.dto");
let AdminController = class AdminController {
    admin;
    constructor(admin) {
        this.admin = admin;
    }
    getStats() {
        return this.admin.getStats();
    }
    getAnalytics() {
        return this.admin.getAnalytics();
    }
    getOrders(status) {
        return this.admin.getOrders(status);
    }
    updateOrderStatus(id, dto) {
        return this.admin.updateOrderStatus(id, dto);
    }
    getTechnicians() {
        return this.admin.getTechnicians();
    }
    createTechnician(dto) {
        return this.admin.createTechnician(dto);
    }
    updateTechnician(id, dto) {
        return this.admin.updateTechnician(id, dto);
    }
    deleteTechnician(id) {
        return this.admin.deleteTechnician(id);
    }
    setTechnicianVerified(id, dto) {
        return this.admin.setTechnicianVerified(id, dto.isVerified);
    }
    setTechnicianActive(id, dto) {
        return this.admin.setTechnicianActive(id, dto.isActive);
    }
    getUsers() {
        return this.admin.getUsers();
    }
    setUserBlocked(id, dto) {
        return this.admin.setUserBlocked(id, dto.isBlocked);
    }
    getCategories() {
        return this.admin.getCategories();
    }
    createCategory(dto) {
        return this.admin.createCategory(dto);
    }
    updateCategory(id, dto) {
        return this.admin.updateCategory(id, dto);
    }
    deleteCategory(id) {
        return this.admin.deleteCategory(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Patch)('orders/:id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Get)('technicians'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getTechnicians", null);
__decorate([
    (0, common_1.Post)('technicians'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_technician_dto_1.CreateTechnicianDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createTechnician", null);
__decorate([
    (0, common_1.Patch)('technicians/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_technician_dto_1.UpdateTechnicianDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateTechnician", null);
__decorate([
    (0, common_1.Delete)('technicians/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteTechnician", null);
__decorate([
    (0, common_1.Patch)('technicians/:id/verify'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, technician_flags_dto_1.UpdateTechnicianVerifiedDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "setTechnicianVerified", null);
__decorate([
    (0, common_1.Patch)('technicians/:id/active'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, technician_flags_dto_1.UpdateTechnicianActiveDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "setTechnicianActive", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/block'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_blocked_dto_1.UpdateUserBlockedDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "setUserBlocked", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteCategory", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.UseGuards)(jwt_admin_guard_1.JwtAdminGuard),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map