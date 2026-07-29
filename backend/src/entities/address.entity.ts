import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { bigintTransformer, decimalTransformer } from '../common/transformers/numeric.transformer';

@Entity('addresses')
export class Address {
    @PrimaryColumn({
        type: 'bigint',
        generated: 'increment',
        transformer: bigintTransformer,
    })
    id: number;

    @Column({ name: 'user_id', type: 'bigint', transformer: bigintTransformer })
    userId: number;

    @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ length: 60, default: 'المنزل' })
    label: string;

    @Column({ length: 80 })
    city: string;

    @Column({ length: 80 })
    district: string;

    @Column({ length: 160, nullable: true })
    street: string | null;

    @Column({ name: 'building_no', length: 30, nullable: true })
    buildingNo: string | null;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true, transformer: decimalTransformer })
    lat: number | null;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true, transformer: decimalTransformer })
    lng: number | null;

    @Column({ name: 'is_default', default: false })
    isDefault: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}