import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Merchant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  apiKey: string;

  @Column({ nullable: true })
  apiSecret: string;

  @Column({ nullable: true })
  callbackUrl: string;

  @Column({ nullable: true })
  destinationAddress: string;

  @ManyToOne(() => User, user => user.merchants)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
