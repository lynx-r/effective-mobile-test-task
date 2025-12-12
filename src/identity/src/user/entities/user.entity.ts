import { Token } from '@auth/entities/token.entity';
import { Role, UserStatus } from 'building-blocks/contracts/identity.contract';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'building-blocks/typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role, // Use the Role enum for this column
    default: Role.USER // Set a default role if needed
  })
  role: Role;

  @Column()
  createdAt: Date;

  @Column({ nullable: true }) // Making 'updatedAt' nullable
  updatedAt?: Date | null; // You can use 'Date | null' to allow null values

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  status: UserStatus;

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
    this.createdAt = partial?.createdAt ?? new Date();
  }
}
