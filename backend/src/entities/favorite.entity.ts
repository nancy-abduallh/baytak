import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Technician } from './technician.entity';
import { bigintTransformer } from '../common/transformers/numeric.transformer';

@Entity('favorites')
export class Favorite {
    @PrimaryColumn({
        type: 'bigint',
        generated: 'increment',
        transformer: bigintTransformer,
    })
    id: number;

    @Column({ name: 'user_id', type: 'bigint', transformer: bigintTransformer })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'technician_id', type: 'bigint', transformer: bigintTransformer })
    technicianId: number;

    @ManyToOne(() => Technician, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'technician_id' })
    technician: Technician;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}