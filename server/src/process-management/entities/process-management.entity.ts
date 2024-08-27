import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_processes' })
export class ProcessManagement {
  @PrimaryColumn()
  process_id: string;

  @Column()
  process_name: string;

  @Column()
  process_description: string;

  @Column()
  process_order: number;

  @Column()
  process_color: string;

  @Column()
  plant_code: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
