import { Address } from './address.entity';
import { Order } from './order.entity';
export declare class User {
    id: number;
    fullName: string;
    phone: string;
    email: string | null;
    passwordHash: string;
    avatarUrl: string | null;
    city: string | null;
    district: string | null;
    isActive: boolean;
    isPhoneVerified: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    addresses: Address[];
    orders: Order[];
}
