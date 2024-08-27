import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_users' })
export class User {
  @PrimaryColumn()
  user_id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  employee_id: string;

  @Column('simple-array')
  roles: string[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
