import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('email_settings')
export class EmailSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'smtp.gmail.com' })
  host: string;

  @Column({ default: 587 })
  port: number;

  @Column({ default: false })
  secure: boolean;

  @Column({ nullable: true })
  user: string;

  @Column({ nullable: true })
  pass: string;

  @Column({ default: 'x-cryptopay' })
  fromName: string;

  @Column({ nullable: true })
  fromEmail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
