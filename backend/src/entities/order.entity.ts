import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Technician } from './technician.entity';
import { ServiceCategory } from './service-category.entity';
import { Address } from './address.entity';
import { OrderStatusHistory } from './order-status-history.entity';
import { OrderImage } from './order-image.entity';
import { bigintTransformer, decimalTransformer } from '../common/transformers/numeric.transformer';

export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

@Entity('orders')
export class Order {
    @PrimaryColumn({
        type: 'bigint',
        generated: 'increment',
        transformer: bigintTransformer,
    })
    id: number;

    @Column({ name: 'user_id', type: 'bigint', transformer: bigintTransformer })
    userId: number;

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'technician_id', type: 'bigint', transformer: bigintTransformer, nullable: true })
    technicianId: number | null;

    @ManyToOne(() => Technician, { nullable: true })
    @JoinColumn({ name: 'technician_id' })
    technician: Technician | null;

    @Column({ name: 'category_id', type: 'int' })
    categoryId: number;

    @ManyToOne(() => ServiceCategory)
    @JoinColumn({ name: 'category_id' })
    category: ServiceCategory;

    @Column({ name: 'address_id', type: 'bigint', transformer: bigintTransformer })
    addressId: number;

    @ManyToOne(() => Address)
    @JoinColumn({ name: 'address_id' })
    address: Address;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'enum', enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'], default: 'pending' })
    status: OrderStatus;

    @Column({ name: 'scheduled_date', type: 'date' })
    scheduledDate: string;

    @Column({ name: 'scheduled_slot', type: 'varchar', length: 30, nullable: true })
    scheduledSlot: string | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, transformer: decimalTransformer })
    amount: number;

    @Column({ name: 'payment_status', type: 'enum', enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' })
    paymentStatus: PaymentStatus;

    @Column({ name: 'payment_method_id', type: 'bigint', transformer: bigintTransformer, nullable: true })
    paymentMethodId: number | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => OrderStatusHistory, (h) => h.order)
    statusHistory: OrderStatusHistory[];

    @OneToMany(() => OrderImage, (img) => img.order)
    images: OrderImage[];
}