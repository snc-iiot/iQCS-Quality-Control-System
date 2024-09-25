import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_model_material' })
export class Model {
  @PrimaryColumn()
  model_id: string;

  @Column()
  model_name: string;

  @Column()
  model_description: string;

  @Column()
  plant_code: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
