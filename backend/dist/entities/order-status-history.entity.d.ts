import { Order } from './order.entity';
import type { OrderStatus } from './order.entity';
export declare class OrderStatusHistory {
    id: number;
    orderId: number;
    order: Order;
    status: OrderStatus;
    note: string | null;
    changedAt: Date;
}
