import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EmailTemplateType {
  WELCOME = 'welcome',
  PAYMENT_CONFIRMATION = 'payment_confirmation',
  PAYMENT_FAILED = 'payment_failed',
  PAYOUT_APPROVED = 'payout_approved',
  PAYOUT_REJECTED = 'payout_rejected',
  CUSTOM = 'custom',
}

@Entity('email_templates')
export class EmailTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  subject: string;

  @Column({ type: 'enum', enum: EmailTemplateType, default: EmailTemplateType.CUSTOM })
  type: EmailTemplateType;

  @Column({ type: 'text' })
  htmlBody: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
