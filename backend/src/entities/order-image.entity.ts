import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Order } from './order.entity';
import { bigintTransformer } from '../common/transformers/numeric.transformer';

@Entity('order_images')
export class OrderImage {
    @PrimaryColumn({
        type: 'bigint',
        generated: 'increment',
        transformer: bigintTransformer,
    })
    id: number;

    @Column({ name: 'order_id', type: 'bigint', transformer: bigintTransformer })
    orderId: number;

    @ManyToOne(() => Order, (order) => order.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ name: 'image_url', length: 255 })
    imageUrl: string;

    @CreateDateColumn({ name: 'uploaded_at' })
    uploadedAt: Date;
}