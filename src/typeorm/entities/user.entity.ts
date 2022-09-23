import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'email', unique: true, type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'identify_card', type: 'varchar', unique: true, length: 12 })
  identifyCard: string;

  @Column({ name: 'birthday', type: 'varchar', length: 50 })
  birthday: string;

  @Column({ name: 'gender', type: 'varchar', length: 10 })
  gender: string;

  @Column({ name: 'province', type: 'varchar', length: 255 })
  province: string;

  @Column({ name: 'district', type: 'varchar', length: 255 })
  district: string;

  @Column({ name: 'ward', type: 'varchar', length: 255 })
  ward: string;

  @Column({ name: 'is_admin', type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({
    name: 'token_reset_password',
    type: 'text',
    nullable: true,
  })
  tokenResetPassword: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;
}
