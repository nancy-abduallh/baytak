import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
interface OrderStatusChangedPayload {
    orderId: number;
    status: string;
    note: string | null;
    changedAt: string;
}
export declare class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    onJoinOrder(orderId: number, client: Socket): void;
    onLeaveOrder(orderId: number, client: Socket): void;
    handleOrderStatusChanged(payload: OrderStatusChangedPayload): void;
}
export {};
