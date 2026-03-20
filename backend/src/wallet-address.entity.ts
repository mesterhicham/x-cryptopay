import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class WalletAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  address: string;

  @Column('int')
  pathIndex: number; // Hierarchical Deterministic (HD) Wallet path index

  @Column()
  network: string; // 'TRC20', 'BEP20'

  @Column({ default: false })
  inUse: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
