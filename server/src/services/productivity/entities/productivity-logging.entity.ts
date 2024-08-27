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

  @Column()
  process: string;

  @Column()
  machine_name: string;

  @Column()
  part_code: string;

  @Column()
  quantity: number;

  @Column()
  ng_quantity: number;

  @Column()
  remarks: string;

  @Column({ type: 'uuid' })
  creator_id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'now()' })
  updated_at: Date;
}
