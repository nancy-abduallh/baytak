import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { bigintTransformer } from '../common/transformers/numeric.transformer';

export type AdminRole = 'super_admin' | 'support' | 'finance';

@Entity('admins')
export class Admin {
    @PrimaryColumn({
        type: 'bigint',
        generated: 'increment',
        transformer: bigintTransformer,
    })
    id: number;

    @Column({ name: 'full_name', length: 120 })
    fullName: string;

    @Column({ length: 160, unique: true })
    email: string;

    @Exclude()
    @Column({ name: 'password_hash', length: 255, select: false })
    passwordHash: string;

    @Column({ type: 'enum', enum: ['super_admin', 'support', 'finance'], default: 'support' })
    role: AdminRole;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}