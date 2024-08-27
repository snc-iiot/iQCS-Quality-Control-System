import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_part_material' })
export class PartManagement {
  @PrimaryColumn()
  part_id: string;

  @Column()
  part_code: string;

  @Column()
  part_name: string;

  @Column()
  part_description: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
