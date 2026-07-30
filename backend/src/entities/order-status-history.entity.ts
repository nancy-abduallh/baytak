import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Order } from './order.entity';
import type { OrderStatus } from './order.entity';
import { bigintTransformer } from '../common/transformers/numeric.transformer';

@Entity('order_status_history')
export class OrderStatusHistory {
    @PrimaryColumn({
        type: 'bigint',
        generated: 'increment',
        transformer: bigintTransformer,
    })
    id: number;

    @Column({ name: 'order_id', type: 'bigint', transformer: bigintTransformer })
    orderId: number;

    @ManyToOne(() => Order, (order) => order.statusHistory, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ type: 'enum', enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'] })
    status: OrderStatus;

    @Column({ type: 'varchar', length: 255, nullable: true })
    note: string | null;

    @CreateDateColumn({ name: 'changed_at' })
    changedAt: Date;
}
