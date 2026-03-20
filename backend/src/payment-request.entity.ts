import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Merchant } from './merchant.entity';

@Entity()
export class PaymentRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Merchant)
  merchant: Merchant;

  @Column('decimal', { precision: 18, scale: 6 })
  amount: number;

  @Column()
  currency: string; // e.g., 'USDT'

  @Column()
  network: string; // e.g., 'TRC20', 'BEP20'

  @Column()
  status: string; // 'PENDING', 'CONFIRMING', 'COMPLETED', 'FAILED'

  @Column({ nullable: true })
  depositAddress: string;

  @Column({ nullable: true })
  txHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
