import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { bigintTransformer } from '../common/transformers/numeric.transformer';

export type PaymentMethodType = 'card' | 'apple_pay' | 'stc_pay' | 'cash';

@Entity('payment_methods')
export class PaymentMethod {
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

    @Column({ type: 'enum', enum: ['card', 'apple_pay', 'stc_pay', 'cash'] })
    type: PaymentMethodType;

    @Column({ name: 'card_brand', type: 'varchar', length: 30, nullable: true })
    cardBrand: string | null;

    @Column({ name: 'card_last4', type: 'varchar', length: 4, nullable: true })
    cardLast4: string | null;

    @Column({ name: 'is_default', default: false })
    isDefault: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}