import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_defects_logging' })
export class DefectsLogging {
  @PrimaryColumn('uuid')
  defects_log_id: string;

  @Column({ type: 'timestamp' })
  datetime: string;

  @Column()
  process: string;

  @Column()
  machine_name: string;

  @Column()
  part_code: string;

  @Column({ type: 'uuid' })
  ng_id: string;

  @Column()
  ng_quantity: number;

  @Column()
  rework_quantity: number;

  @Column()
  rework_cost_per_unit: number;

  @Column()
  scrap_quantity: number;

  @Column()
  scrap_cost_per_unit: number;

  @Column()
  image: string;

  @Column()
  solve_problem: string;

  @Column()
  remarks: string;

  @Column({ type: 'uuid' })
  inspector_id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'now()' })
  updated_at: Date;
}
