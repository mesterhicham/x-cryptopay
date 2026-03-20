import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('branding')
export class Branding {
  @PrimaryColumn({ default: 1 })
  id: number;

  @Column({ nullable: true })
  siteName: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  faviconUrl: string;

  @Column({ default: '#8b5cf6' })
  primaryColor: string;

  @Column({ nullable: true })
  pwaLogoUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
