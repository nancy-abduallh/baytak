import { Order } from './order.entity';
import { User } from './user.entity';
import { Technician } from './technician.entity';
export declare class Review {
    id: number;
    orderId: number;
    order: Order;
    userId: number;
    user: User;
    technicianId: number;
    technician: Technician;
    rating: number;
    comment: string | null;
    createdAt: Date;
}
