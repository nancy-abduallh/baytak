import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { bigintTransformer } from '../common/transformers/numeric.transformer';

export type ActorType = 'user' | 'technician' | 'admin';

@Entity('auth_tokens')
export class AuthToken {
    @PrimaryColumn({
        type: 'bigint',
        generated: 'increment',
        transformer: bigintTransformer,
    })
    id: number;

    @Column({ name: 'actor_type', type: 'enum', enum: ['user', 'technician', 'admin'] })
    actorType: ActorType;

    @Column({ name: 'actor_id', type: 'bigint', transformer: bigintTransformer })
    actorId: number;

    @Column({ name: 'refresh_token_hash', type: 'varchar', length: 255 })
    refreshTokenHash: string;

    @Column({ name: 'user_agent', type: 'varchar', length: 255, nullable: true })
    userAgent: string | null;

    @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
    ipAddress: string | null;

    @Column({ name: 'expires_at', type: 'datetime' })
    expiresAt: Date;

    @Column({ name: 'revoked_at', type: 'datetime', nullable: true })
    revokedAt: Date | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}