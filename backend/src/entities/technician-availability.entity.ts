import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Technician } from './technician.entity';
import { bigintTransformer } from '../common/transformers/numeric.transformer';

@Entity('technician_availability')
export class TechnicianAvailability {
    @PrimaryColumn({
        type: 'bigint',
        generated: 'increment',
        transformer: bigintTransformer,
    })
    id: number;

    @Column({ name: 'technician_id', type: 'bigint', transformer: bigintTransformer })
    technicianId: number;

    @ManyToOne(() => Technician, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'technician_id' })
    technician: Technician;

    @Column({ name: 'day_of_week', type: 'tinyint' })
    dayOfWeek: number;

    @Column({ name: 'start_time', type: 'time' })
    startTime: string;

    @Column({ name: 'end_time', type: 'time' })
    endTime: string;

    @Column({ name: 'is_available', default: true })
    isAvailable: boolean;
}