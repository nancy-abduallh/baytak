import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ServiceCategory } from './service-category.entity';
import { bigintTransformer, decimalTransformer } from '../common/transformers/numeric.transformer';

@Entity('technicians')
export class Technician {
    @PrimaryColumn({
        type: 'bigint',
        generated: 'increment',
        transformer: bigintTransformer,
    })
    id: number;

    @Column({ name: 'full_name', type: 'varchar', length: 120 })
    fullName: string;


    @Column({ type: 'varchar', length: 6 })
    initials: string;

    @Column({ type: 'varchar', length: 20, unique: true })
    phone: string;

    @Column({ type: 'varchar', length: 160, unique: true, nullable: true })
    email: string | null;

    @Exclude()
    @Column({ name: 'password_hash', type: 'varchar', length: 255, select: false })
    passwordHash: string;

    @Column({ name: 'avatar_url', type: 'varchar', length: 255, nullable: true })
    avatarUrl: string | null;

    @Column({ name: 'primary_category_id', type: 'int' })
    primaryCategoryId: number;

    @ManyToOne(() => ServiceCategory)
    @JoinColumn({ name: 'primary_category_id' })
    primaryCategory: ServiceCategory;

    @ManyToMany(() => ServiceCategory)
    @JoinTable({
        name: 'technician_categories',
        joinColumn: { name: 'technician_id' },
        inverseJoinColumn: { name: 'category_id' },
    })
    categories: ServiceCategory[];

    @Column({ name: 'years_experience', type: 'smallint', default: 0 })
    yearsExperience: number;

    @Column({ type: 'varchar', length: 80 })
    city: string;

    @Column({ type: 'varchar', length: 80 })
    district: string;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true, transformer: decimalTransformer })
    lat: number | null;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true, transformer: decimalTransformer })
    lng: number | null;

    @Column({ name: 'price_from', type: 'decimal', precision: 10, scale: 2, transformer: decimalTransformer })
    priceFrom: number;

    @Column({ name: 'is_verified', default: false })
    isVerified: boolean;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'average_rating', type: 'decimal', precision: 2, scale: 1, default: 0, transformer: decimalTransformer })
    averageRating: number;

    @Column({ name: 'review_count', type: 'int', default: 0 })
    reviewCount: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
