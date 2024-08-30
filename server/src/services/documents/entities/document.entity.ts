import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_documents' })
export class Document {
  @PrimaryColumn()
  document_id: string;

  @Column()
  document_name: string;

  @Column()
  document_description: string;

  @Column()
  effective_date: string;

  @Column()
  expire_date: string;

  @Column()
  source_file: string;

  @Column()
  plant_code: string;

  @Column()
  creator_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
