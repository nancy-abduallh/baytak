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
exports.OrdersGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const event_emitter_1 = require("@nestjs/event-emitter");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let OrdersGateway = class OrdersGateway {
    server;
    logger = new common_1.Logger('OrdersGateway');
    handleConnection(client) {
        this.logger.log(`client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`client disconnected: ${client.id}`);
    }
    onJoinOrder(orderId, client) {
        client.join(`order:${orderId}`);
    }
    onLeaveOrder(orderId, client) {
        client.leave(`order:${orderId}`);
    }
    handleOrderStatusChanged(payload) {
        this.server.to(`order:${payload.orderId}`).emit('order.status.changed', payload);
    }
};
exports.OrdersGateway = OrdersGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], OrdersGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinOrder'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], OrdersGateway.prototype, "onJoinOrder", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveOrder'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], OrdersGateway.prototype, "onLeaveOrder", null);
__decorate([
    (0, event_emitter_1.OnEvent)('order.status.changed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersGateway.prototype, "handleOrderStatusChanged", null);
exports.OrdersGateway = OrdersGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000' },
        namespace: '/orders',
    })
], OrdersGateway);
//# sourceMappingURL=orders.gateway.js.map