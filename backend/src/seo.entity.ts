import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('seo_settings')
export class SEOSettings {
  @PrimaryColumn({ default: 1 })
  id: number;

  @Column({ default: 'x-cryptopay | The Premium Payment Gateway' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  keywords: string;

  // Open Graph
  @Column({ nullable: true })
  ogTitle: string;

  @Column({ nullable: true })
  ogUrl: string;

  @Column({ type: 'text', nullable: true })
  ogDescription: string;

  @Column({ nullable: true })
  ogImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
