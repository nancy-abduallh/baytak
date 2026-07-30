import { User } from './user.entity';
import { Technician } from './technician.entity';
export declare class Favorite {
    id: number;
    userId: number;
    user: User;
    technicianId: number;
    technician: Technician;
    createdAt: Date;
}
