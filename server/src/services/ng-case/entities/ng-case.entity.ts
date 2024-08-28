import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_ng_cases' })
export class NgCases {
  @PrimaryColumn()
  case_id: string;

  @Column()
  case_name: string;

  @Column()
  description: string;

  @Column({ type: 'jsonb' })
  processes: string[];

  @Column()
  plant_code: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
