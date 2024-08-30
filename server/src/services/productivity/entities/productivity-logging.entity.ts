import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_productivity_logging' })
export class ProductivityLogging {
  @PrimaryColumn('uuid')
  prod_log_id: string;

  @Column({ type: 'timestamp' })
  datetime: string;

  @Column({ type: 'uuid' })
  process_id: string;

  @Column({ type: 'uuid' })
  machine_id: string;

  @Column({ type: 'uuid' })
  operator_id: string;

  @Column({ type: 'uuid' })
  part_id: string;

  @Column()
  quantity: number;

  @Column()
  remarks: string;

  @Column()
  plant_code: string;

  @Column({ type: 'uuid' })
  creator_id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'now()' })
  updated_at: Date;
}
