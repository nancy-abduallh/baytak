import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { bigintTransformer } from '../common/transformers/numeric.transformer';
import { AdminPermission } from '../modules/admin/permissions.constants';


export type AdminRole = 'super_admin' | 'operations' | 'support' | 'finance';

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

    @Column({ type: 'enum', enum: ['super_admin', 'operations', 'support', 'finance'], default: 'support' })
    role: AdminRole;

    // Granular privileges assigned by a super admin. Ignored for
    // `super_admin` accounts, which implicitly have every permission.
    @Column({ type: 'json', nullable: false, default: () => "('[]')" })
    permissions: AdminPermission[];

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
