import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_price_ratios' })
export class PriceRatio {
  @PrimaryColumn('uuid')
  ratio_id: string;

  @Column({ type: 'date' })
  effective_date: string;

  @Column()
  ng_ratio: number;

  @Column()
  scrap_ratio: number;

  @Column()
  rework_ratio: number;

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
