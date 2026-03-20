import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Merchant } from './merchant.entity';

@Entity()
export class PayoutRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 18, scale: 6 })
  amount: number;

  @Column({ default: 'USDT' })
  currency: string;

  @Column()
  network: string; // 'BSC' | 'TRON'

  @Column()
  toAddress: string;

  @Column({ default: 'PENDING' })
  status: string; // 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'

  @Column({ nullable: true })
  txHash: string;

  @ManyToOne(() => Merchant)
  merchant: Merchant;

  @CreateDateColumn()
  createdAt: Date;
}
