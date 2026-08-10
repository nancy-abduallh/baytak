import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';


@Entity('site_settings')
export class SiteSetting {
    @PrimaryColumn({ type: 'tinyint', default: 1 })
    id: number;

    @Column({ name: 'site_name', type: 'varchar', length: 80, default: 'بيتك' })
    siteName: string;

    @Column({ name: 'footer_description', type: 'text', nullable: true })
    footerDescription: string | null;

    @Column({
        name: 'availability_note',
        type: 'varchar',
        length: 160,
        nullable: true,
    })
    availabilityNote: string | null;

    // ---------- Contact us ----------
    @Column({
        name: 'contact_phone',
        type: 'varchar',
        length: 30,
        nullable: true,
    })
    contactPhone: string | null;

    @Column({
        name: 'contact_whatsapp',
        type: 'varchar',
        length: 30,
        nullable: true,
    })
    contactWhatsapp: string | null;

    @Column({
        name: 'contact_email',
        type: 'varchar',
        length: 160,
        nullable: true,
    })
    contactEmail: string | null;

    @Column({ name: 'website_url', type: 'varchar', length: 200, nullable: true })
    websiteUrl: string | null;

    @Column({ name: 'address', type: 'varchar', length: 255, nullable: true })
    address: string | null;

    @Column({
        name: 'working_hours',
        type: 'varchar',
        length: 120,
        nullable: true,
    })
    workingHours: string | null;

    // ---------- Social links ----------
    @Column({
        name: 'facebook_url',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    facebookUrl: string | null;

    @Column({ name: 'twitter_url', type: 'varchar', length: 255, nullable: true })
    twitterUrl: string | null;

    @Column({
        name: 'instagram_url',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    instagramUrl: string | null;

    @Column({ name: 'tiktok_url', type: 'varchar', length: 255, nullable: true })
    tiktokUrl: string | null;

    // ---------- Misc ----------
    @Column({
        name: 'copyright_text',
        type: 'varchar',
        length: 160,
        nullable: true,
    })
    copyrightText: string | null;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}