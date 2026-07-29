import {
    WebSocketGateway, WebSocketServer, SubscribeMessage,
    MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

interface OrderStatusChangedPayload {
    orderId: number;
    status: string;
    note: string | null;
    changedAt: string;
}

@WebSocketGateway({
    cors: { origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000' },
    namespace: '/orders',
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger('OrdersGateway');

    handleConnection(client: Socket) {
        this.logger.log(`client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinOrder')
    onJoinOrder(@MessageBody() orderId: number, @ConnectedSocket() client: Socket) {
        client.join(`order:${orderId}`);
    }

    @SubscribeMessage('leaveOrder')
    onLeaveOrder(@MessageBody() orderId: number, @ConnectedSocket() client: Socket) {
        client.leave(`order:${orderId}`);
    }

    @OnEvent('order.status.changed')
    handleOrderStatusChanged(payload: OrderStatusChangedPayload) {
        this.server.to(`order:${payload.orderId}`).emit('order.status.changed', payload);
    }
}