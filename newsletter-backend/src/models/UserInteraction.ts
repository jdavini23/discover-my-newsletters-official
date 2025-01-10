import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity('user_interactions')
export class UserInteraction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.interactions)
  user!: User;

  @Column()
  newsletterId!: string;

  @Column({ type: 'enum', enum: ['open', 'click', 'save', 'share'], default: 'open' })
  interactionType!: string;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  timestamp!: Date;
}
