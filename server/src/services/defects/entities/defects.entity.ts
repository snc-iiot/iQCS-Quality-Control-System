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
  defects_type: string;

  @Column({ type: 'uuid' })
  process_id: string;

  @Column({ type: 'uuid' })
  machine_id: string;

  @Column({ type: 'uuid' })
  operator_id: string;

  @Column({ type: 'uuid' })
  part_id: string;

  @Column({ type: 'uuid' })
  case_id: string;

  @Column()
  production_quantity: number;

  @Column()
  ng_quantity: number;

  @Column()
  rework_quantity: number;

  @Column()
  scrap_quantity: number;

  @Column()
  claim_supplier_quantity: number;

  @Column()
  scrap_approval_sheet_no: string;

  @Column()
  car_no: string;

  @Column()
  image: string;

  @Column()
  solve_problem: string;

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
