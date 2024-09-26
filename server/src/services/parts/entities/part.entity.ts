import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_part_material' })
export class Part {
  @PrimaryColumn()
  part_id: string;

  @Column()
  sap_code: string;

  @Column()
  part_code: string;

  @Column()
  model_id: string;

  @Column()
  part_name: string;

  @Column()
  part_description: string;

  @Column({ type: 'jsonb' })
  processes: string[];

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: 'jsonb' })
  customers: string[];

  @Column()
  plant_code: string;

  @Column()
  type: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
