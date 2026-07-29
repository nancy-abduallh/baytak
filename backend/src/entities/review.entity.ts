import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';
import { Technician } from './technician.entity';
import { bigintTransformer } from '../common/transformers/numeric.transformer';

@Entity('reviews')
export class Review {
    @PrimaryColumn({
        type: 'bigint',
        generated: 'increment',
        transformer: bigintTransformer,
    })
    id: number;

    @Column({ name: 'order_id', type: 'bigint', transformer: bigintTransformer, unique: true })
    orderId: number;

    @ManyToOne(() => Order, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ name: 'user_id', type: 'bigint', transformer: bigintTransformer })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'technician_id', type: 'bigint', transformer: bigintTransformer })
    technicianId: number;

    @ManyToOne(() => Technician)
    @JoinColumn({ name: 'technician_id' })
    technician: Technician;

    @Column({ type: 'tinyint' })
    rating: number;

    @Column({ length: 500, nullable: true })
    comment: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}