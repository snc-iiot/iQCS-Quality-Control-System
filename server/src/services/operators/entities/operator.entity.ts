import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_operators' })
export class Operator {
  @PrimaryColumn()
  operator_id: string;

  @Column()
  employee_id: string;

  @Column()
  operator_name: string;

  @Column()
  position: string;

  @Column()
  responsibility: string;

  @Column()
  remarks: string;

  @Column()
  plant_code: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
