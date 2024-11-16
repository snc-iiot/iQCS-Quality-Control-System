import { from } from 'form-data';
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_folders' })
export class Folder {
  @PrimaryColumn()
  folder_id: string;

  @Column()
  folder_name: string;

  @Column()
  plant_code: string;

  @Column()
  creator_id: string;

  @Column()
  number_of_files: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
