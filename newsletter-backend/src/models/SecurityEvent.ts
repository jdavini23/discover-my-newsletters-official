import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('security_events')
export class SecurityEvent {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  eventType: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @Column()
  isHighRisk: boolean;

  @CreateDateColumn()
  createdAt: Date;

  constructor(data?: Partial<SecurityEvent>) {
    if (data) {
      Object.assign(this, data);
    }
    this.createdAt = data?.createdAt || new Date();
    this.isHighRisk = data?.isHighRisk || false;
  }

  toJSON() {
    return {
      id: this.id,
      eventType: this.eventType,
      userId: this.userId,
      ipAddress: this.ipAddress,
      metadata: this.metadata,
      isHighRisk: this.isHighRisk,
      createdAt: this.createdAt,
    };
  }
}

