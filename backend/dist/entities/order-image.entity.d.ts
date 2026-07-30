import { Order } from './order.entity';
export declare class OrderImage {
    id: number;
    orderId: number;
    order: Order;
    imageUrl: string;
    uploadedAt: Date;
}
