import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Address } from './address.entity';
import { Order } from './order.entity';
import { bigintTransformer } from '../common/transformers/numeric.transformer';

@Entity('users')
export class User {
    @PrimaryColumn({
        type: 'bigint',
        generated: 'increment',
        transformer: bigintTransformer,
    })
    id: number;

    @Column({ name: 'full_name', length: 120 })
    fullName: string;

    @Column({ length: 20, unique: true })
    phone: string;

    @Column({ length: 160, unique: true, nullable: true })
    email: string | null;

    @Exclude()
    @Column({ name: 'password_hash', length: 255, select: false })
    passwordHash: string;

    @Column({ name: 'avatar_url', length: 255, nullable: true })
    avatarUrl: string | null;

    @Column({ length: 80, nullable: true })
    city: string | null;

    @Column({ length: 80, nullable: true })
    district: string | null;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'is_phone_verified', default: false })
    isPhoneVerified: boolean;

    @Column({ name: 'last_login_at', type: 'datetime', nullable: true })
    lastLoginAt: Date | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date | null;

    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}