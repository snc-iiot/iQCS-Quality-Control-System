import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tb_plants' })
export class Plant {
  @PrimaryColumn()
  plant_code: string;

  @Column()
  plant_description: string;

  @Column()
  company: string;

  @Column()
  business_type: string;
}
