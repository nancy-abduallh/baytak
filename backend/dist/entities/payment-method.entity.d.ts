import { User } from './user.entity';
export type PaymentMethodType = 'card' | 'apple_pay' | 'stc_pay' | 'cash';
export declare class PaymentMethod {
    id: number;
    userId: number;
    user: User;
    type: PaymentMethodType;
    cardBrand: string | null;
    cardLast4: string | null;
    isDefault: boolean;
    createdAt: Date;
}
