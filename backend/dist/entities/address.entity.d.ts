import { User } from './user.entity';
export declare class Address {
    id: number;
    userId: number;
    user: User;
    label: string;
    city: string;
    district: string;
    street: string | null;
    buildingNo: string | null;
    lat: number | null;
    lng: number | null;
    isDefault: boolean;
    createdAt: Date;
}
