import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { decimalTransformer } from '../common/transformers/numeric.transformer';

@Entity('service_categories')
export class ServiceCategory {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 60, unique: true })
    slug: string;

    @Column({ name: 'name_ar', type: 'varchar', length: 80 })
    nameAr: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string | null;

    @Column({ name: 'icon_key', type: 'varchar', length: 40 })
    iconKey: string;

    @Column({ name: 'price_from', type: 'decimal', precision: 10, scale: 2, transformer: decimalTransformer })
    priceFrom: number;

    @Column({ name: 'price_unit', type: 'varchar', length: 20, default: 'ر.س' })
    priceUnit: string;

    @Column({ name: 'sort_order', type: 'smallint', default: 0 })
    sortOrder: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
}
