import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_machines' })
export class Machine {
  @PrimaryColumn()
  machine_id: string;

  @Column()
  machine_no: string;

  @Column()
  machine_name: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  plant_code: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
