import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { bigintTransformer } from '../common/transformers/numeric.transformer';

@Entity('notifications')
export class Notification {
    @PrimaryColumn({
        type: 'bigint',
        generated: 'increment',
        transformer: bigintTransformer,
    })
    id: number;

    @Column({ name: 'user_id', type: 'bigint', transformer: bigintTransformer, nullable: true })
    userId: number | null;

    @Column({ name: 'technician_id', type: 'bigint', transformer: bigintTransformer, nullable: true })
    technicianId: number | null;

    @Column({ length: 150 })
    title: string;

    @Column({ length: 400 })
    body: string;

    @Column({ length: 40, default: 'order_update' })
    type: string;

    @Column({ name: 'is_read', default: false })
    isRead: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}