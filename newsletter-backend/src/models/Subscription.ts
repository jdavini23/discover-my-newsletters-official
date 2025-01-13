import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';/

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.subscriptions)
  user!: User;

  @Column()
  newsletterId!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'enum', enum: ['daily', 'weekly', 'monthly'], default: 'weekly' })
  frequency!: string;

  @Column({ default: false })
  isPaused!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

