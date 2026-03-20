import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Merchant } from './merchant.entity';

@Entity()
export class PayoutWallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pathIndex: number;

  @Column()
  network: string; // 'TRON' | 'BSC'

  @Column()
  address: string;

  @ManyToOne(() => Merchant)
  merchant: Merchant;

  @CreateDateColumn()
  createdAt: Date;
}
