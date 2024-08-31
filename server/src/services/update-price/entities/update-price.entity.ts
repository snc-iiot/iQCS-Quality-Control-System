import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_update_prices' })
export class UpdatePrice {
  @PrimaryColumn('uuid')
  update_price_id: string;

  @Column({ type: 'date' })
  effective_date: string;

  @Column({ type: 'uuid' })
  part_id: string;

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: 'numeric' })
  ng_price: number;

  @Column({ type: 'numeric' })
  scrap_price: number;

  @Column({ type: 'numeric' })
  rework_price: number;

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
