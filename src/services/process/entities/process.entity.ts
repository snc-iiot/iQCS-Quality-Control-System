import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_process' })
export class Process {
  @PrimaryColumn()
  process_id: string;

  @Column()
  process_name: string;

  @Column()
  process_color: string;

  @Column()
  process_description: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
