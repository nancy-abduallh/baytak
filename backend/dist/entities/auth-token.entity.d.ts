export type ActorType = 'user' | 'technician' | 'admin';
export declare class AuthToken {
    id: number;
    actorType: ActorType;
    actorId: number;
    refreshTokenHash: string;
    userAgent: string | null;
    ipAddress: string | null;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
}
