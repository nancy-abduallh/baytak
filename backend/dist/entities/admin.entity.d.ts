export type AdminRole = 'super_admin' | 'support' | 'finance';
export declare class Admin {
    id: number;
    fullName: string;
    email: string;
    passwordHash: string;
    role: AdminRole;
    isActive: boolean;
    createdAt: Date;
}
